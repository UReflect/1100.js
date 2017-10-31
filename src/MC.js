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

    // Drag click type
    this._dragClickType = 0;

    this.setupMCOptions(options);
  }

  setupMCOptions(options) {

    if (Object.keys(options).includes('container')) this._container = document.getElementById(options.container);
    if (Object.keys(options).includes('drag')) {
        if (options.drag.clickType) this._dragClickType = options.drag.clickType == 'longClick' ? 500 : 0;
    }

    if (!Object.keys(options).includes('draggable') || (Object.keys(options).includes('draggable') && options.draggable == true)) {
      var elements = document.querySelectorAll(this._identifier);
      this.setupDraggable(elements);
    }
    // if (!Object.keys(options).includes('resizable') || (Object.keys(options).includes('resizable') && options.resizable == true)) this._resizable = new Resizable(this._identifier);
    if (Object.keys(options).includes('grid') && ((typeof(options.grid) === "boolean" && options.grid === true) || typeof(options.grid) !== "boolean")) this._grid = new Grid(this._identifier, this._container, options.grid);
  }

  setResizeSide(pageX, pageY, posX, posY, width, height) {
    return
  }

  setupDraggable(elements) {
    self = this;
    Array.prototype.forEach.call(elements, function(el, i) {

      var pressTimer, resizeOpt;
      var isDragReady = false, isResizeReady = false;
      var dragoffset = {elem: null, x: 0, y: 0, startX: 0, startY: 0, startW: 0, startH: 0, startPosX: 0, startPosY: 0};

      el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var elem = this;

        pressTimer = window.setTimeout(function() {
          elem.style.zIndex = 999;
          if (!e.pageX) {
            e.pageX = e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
          }
          dragoffset.x = e.pageX - el.offsetLeft;
          dragoffset.y = e.pageY - el.offsetTop;
          dragoffset.elem = elem;

          resizeOpt = {
            right: (e.pageX > parseFloat(el.style.left) + parseFloat(el.offsetWidth) - 10 && e.pageX < parseFloat(el.style.left) + parseFloat(el.offsetWidth)) ? true : false,
            left: (e.pageX > parseFloat(el.style.left) && e.pageX < parseFloat(el.style.left) + 10) ? true : false,
            top: (e.pageY > parseFloat(el.style.top) && e.pageY < parseFloat(el.style.top) + 10) ? true : false,
            bottom: (e.pageY > parseFloat(el.style.top) + parseFloat(el.offsetHeight) - 10 && e.pageY < parseFloat(el.style.top) + parseFloat(el.offsetHeight)) ? true : false
          };

          if (resizeOpt.left || resizeOpt.right || resizeOpt.top || resizeOpt.bottom) {
            dragoffset.startX = e.clientX;
            dragoffset.startY = e.clientY;
            dragoffset.startW = el.offsetWidth;
            dragoffset.startH = el.offsetHeight;
            dragoffset.startPosX = el.offsetLeft;
            dragoffset.startPosY = el.offsetTop;
            isResizeReady = true;
          } else {
            isDragReady = true;
          }
        }, self._dragClickType);
      });
      document.addEventListener('mouseup', function (e) {
        clearTimeout(pressTimer);
        if (dragoffset.elem) {
          dragoffset.elem.style.zIndex = 0;
          if (self._grid && isDragReady) {
            var l = self._grid.calculateDragLocation(parseFloat(dragoffset.elem.style.left),
                                                     parseFloat(dragoffset.elem.style.top),
                                                     parseFloat(dragoffset.elem.offsetWidth), parseFloat(dragoffset.elem.offsetHeight));

            dragoffset.elem.style.top = l.y + 'px';
            dragoffset.elem.style.left = l.x + 'px';
          } else if (self._grid && isResizeReady) {
            var l = self._grid.calculateResizeLocation(parseFloat(dragoffset.elem.style.left),
                                                       parseFloat(dragoffset.elem.style.top),
                                                       parseFloat(dragoffset.elem.offsetWidth), parseFloat(dragoffset.elem.offsetHeight),
                                                       resizeOpt);
            console.log(l);
            dragoffset.elem.style.top = l.y + 'px';
            dragoffset.elem.style.left = l.x + 'px';
            dragoffset.elem.style.width = l.w + 'px';
            dragoffset.elem.style.height = l.h + 'px';
          }
          isDragReady = false;
          isResizeReady = false;
          dragoffset.elem = null;
        }
      });
      document.addEventListener('mousemove', function (e) {
        if (dragoffset.elem) {
          if (!e.pageX) {
            e.pageX = e.pageX || e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            e.pageY = e.pageY || e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
          }
          if (isDragReady) {
            dragoffset.elem.style.top = ((e.pageY - dragoffset.y) + dragoffset.elem.offsetHeight > self._container.offsetHeight ? self._container.offsetHeight - dragoffset.elem.offsetHeight : ((e.pageY - dragoffset.y) < 0 ? 0 : (e.pageY - dragoffset.y))) + 'px';
            dragoffset.elem.style.left = ((e.pageX - dragoffset.x) + dragoffset.elem.offsetWidth > self._container.offsetWidth ? self._container.offsetWidth - dragoffset.elem.offsetWidth : ((e.pageX - dragoffset.x) < 0 ? 0 : (e.pageX - dragoffset.x))) + 'px';
          } else if (isResizeReady) {
            if (resizeOpt.right) {
              dragoffset.elem.style.width = (dragoffset.startW + e.clientX - dragoffset.startX) + 'px';
            }
            if (resizeOpt.left) {
              dragoffset.elem.style.left = (dragoffset.startPosX + e.clientX - dragoffset.startX) + 'px';
              dragoffset.elem.style.width = (dragoffset.startW - e.clientX + dragoffset.startX) + 'px';
            }
            if (resizeOpt.top) {
              dragoffset.elem.style.top = (dragoffset.startPosY + e.clientY - dragoffset.startY) + 'px';
              dragoffset.elem.style.height = (dragoffset.startH - e.clientY + dragoffset.startY) + 'px';
            }
            if (resizeOpt.bottom) {
              dragoffset.elem.style.height = (dragoffset.startH + e.clientY - dragoffset.startY) + 'px';
            }
          }
        }
      });
    });
  }

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
