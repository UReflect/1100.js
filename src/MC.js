import {Type} from './type.js';
import {Grid} from './grid.js';

class MC {

  // MC constructor
  constructor(identifier='.widget', options={}) {
    // Identifiers
    this._identifier = identifier;
    this._container = null;
    // MC options
    this._options = options;
    // Type class
    this._type = new Type();
    // Mouvement objects
    this._draggable = null;
    this._resizable = null;
    // Special events
    this._specialEvents = [
      'longTouch',
      'pinch'
    ];
    // Grid
    this._grid = null;

    this.setupMCOptions(options);
  }

  setupMCOptions(options) {

    if (Object.keys(options).includes('container')) this._container = document.getElementById(options.container);

    if (!Object.keys(options).includes('draggable') || (Object.keys(options).includes('draggable') && options.draggable == true)) {
      var elements = document.querySelectorAll(this._identifier);
      this.setupDraggable(elements);
    }
    // if (!Object.keys(options).includes('resizable') || (Object.keys(options).includes('resizable') && options.resizable == true)) this._resizable = new Resizable(this._identifier);
    if (Object.keys(options).includes('grid') && ((typeof(options.grid) === "boolean" && options.grid === true) || typeof(options.grid) !== "boolean")) this._grid = new Grid(this._identifier, this._container, options.grid);
  }

  setupDraggable(elements) {
    self = this;
    Array.prototype.forEach.call(elements, function(el, i) {

      var isDragReady = false;
      var dragoffset = {
        elem: null,
        x: 0,
        y: 0
      };

      el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isDragReady = true;

        this.style.zIndex = 999;

        if (!e.pageX) {
          e.pageX = e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
          e.pageY = e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        }
        dragoffset.x = e.pageX - el.offsetLeft;
        dragoffset.y = e.pageY - el.offsetTop;
        dragoffset.elem = this;
      });
      el.addEventListener('mouseup', function (e) {
        isDragReady = false;
        this.style.zIndex = 0;
        if (self._grid) {
          var l = self._grid.calculateLocation(parseFloat(this.style.left),
                                               parseFloat(this.style.top),
                                               parseFloat(this.offsetWidth), parseFloat(this.offsetHeight));

          this.style.top = l.y + 'px';
          this.style.left = l.x + 'px';
        } else {
          this.style.top = e.pageY + 'px';
          this.style.left = e.pageX + 'px';
        }
      });
      document.addEventListener('mousemove', function (e) {
        if (isDragReady) {
          if (!e.pageX) {
            e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
          }

          dragoffset.elem.style.top = ((e.pageY - dragoffset.y) + dragoffset.elem.offsetHeight > self._container.offsetHeight ? self._container.offsetHeight - dragoffset.elem.offsetHeight : ((e.pageY - dragoffset.y) < 0 ? 0 : (e.pageY - dragoffset.y))) + 'px';
          dragoffset.elem.style.left = ((e.pageX - dragoffset.x) + dragoffset.elem.offsetWidth > self._container.offsetWidth ? self._container.offsetWidth - dragoffset.elem.offsetWidth : ((e.pageX - dragoffset.x) < 0 ? 0 : (e.pageX - dragoffset.x))) + 'px';
        }
      });
    });
  }

  // Set listener on element
  on(event, func, useCapture=false) {
    if (this._type.isString(event)) {
      event = event.trim().split(/ /);
    }

    var elements = document.querySelectorAll(this._identifier);
    for (let value of event) {
      Array.prototype.forEach.call(elements, function(el, i){
        el.addEventListener(value, func);
      });
    }

    return this;
  }

  get identifier() { return this._identifier; }
  set identifier(new_id) { this._identifier = new_id; }
}

module.exports = MC;
