import {Type} from './type.js';
import {Draggable} from './draggable.js';
import {Resizable} from './resizable.js';

class MC {

  // MC constructor
  constructor(identifier='.widget', options={}) {
    // Identifiers
    this._identifier = identifier;
    this._container = '';
    // MC options
    this._options = options;
    // Type class
    this._type = new Type();
    // Mouvement objects
    this._draggable = null;
    this._resizable = null;

    this.setupMCOptions(options);
  }

  setupMCOptions(options) {

    if (Object.keys(options).includes('container')) this._container = options.container;

    if (!Object.keys(options).includes('draggable') || (Object.keys(options).includes('draggable') && options.draggable == true)) {
      var elements = document.querySelectorAll(this._identifier);
      this.setupDraggable(elements);
    }
    if (!Object.keys(options).includes('resizable') || (Object.keys(options).includes('resizable') && options.resizable == true)) this._resizable = new Resizable(this._identifier);
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
      // el.setAttribute('draggable', true);
      el.style.position = "absolute";

      el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        isDragReady = true;

        if (!e.pageX) {
          e.pageX = e.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);

          e.pageY = e.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
        }
        dragoffset.x = e.pageX - el.offsetLeft;
        dragoffset.y = e.pageY - el.offsetTop;
        dragoffset.elem = this;
      });
      el.addEventListener('mouseup', function () {
        isDragReady = false;
      });
      document.addEventListener('mousemove', function (e) {
        if (isDragReady) {
          if (!e.pageX) {
            e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ?
              document.documentElement.scrollLeft :
              document.body.scrollLeft);

            e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop ?
              document.documentElement.scrollTop :
              document.body.scrollTop);
          }
          dragoffset.elem.style.top = (e.pageY - dragoffset.y) + "px";
          dragoffset.elem.style.left = (e.pageX - dragoffset.x) + "px";
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

  // Get identifier
  get identifier() {
    return this._identifier;
  }

  // Set identifier
  set identifier(new_id) {
    this._identifier = new_id;
    this._element = $(this._identifier);
  }
}

module.exports = MC;
