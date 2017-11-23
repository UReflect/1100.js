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
      'pinch',
      'slide'
    ];
    // Grid
    this._grid = null;

    // Drag click type
    this._dragClickType = 0;

    // Init drag variables
    this._dragoffset = {elem: null, x: 0, y: 0, startX: 0, startY: 0, startW: 0, startH: 0, startPosX: 0, startPosY: 0};
    this._pressTimer = null;
    this._resizeOpt = {};
    this._isDragReady = false
    this._isResizeReady = false;
    this._isPinchActive = false;
    this._startPinchDiff = 0;
    this._lastPinchDiff = 0;
    this._isSlideActive = false;
    this._startSlideDiff = [];
    this._lastSlideDiff = [];

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
      el.addEventListener("touchstart", function(e) { e.preventDefault(); self.onTouchDown(e, el, this); }, false);
      document.addEventListener('touchend', (e) => { self.onTouchUp(e); }, false);
      document.addEventListener('touchmove', (e) => { self.onTouchMove(e); }, false);

      el.addEventListener('mousedown', function(e) { self.onTouchDown(e, el, this); });
      document.addEventListener('mouseup', (e) => { self.onTouchUp(e); });
      document.addEventListener('mousemove', (e) => { self.onTouchMove(e); });
    });
  }

  onTouchDown(e, el, elem) {
    var self = this;

    this._pressTimer = window.setTimeout(function() {
      elem.style.zIndex = 999;

      if (e.touches) {
        let touch = e.touches[0];
        self._dragoffset.x = touch.pageX - el.offsetLeft;
        self._dragoffset.y = touch.pageY - el.offsetTop;
      } else {
        self._dragoffset.x = e.pageX - el.offsetLeft;
        self._dragoffset.y = e.pageY - el.offsetTop;
      }

      self._dragoffset.elem = elem;

      self._resizeOpt = {
        right: (e.pageX > parseFloat(el.style.left) + parseFloat(el.offsetWidth) - 10 && e.pageX < parseFloat(el.style.left) + parseFloat(el.offsetWidth)) ? true : false,
        left: (e.pageX > parseFloat(el.style.left) && e.pageX < parseFloat(el.style.left) + 10) ? true : false,
        top: (e.pageY > parseFloat(el.style.top) && e.pageY < parseFloat(el.style.top) + 10) ? true : false,
        bottom: (e.pageY > parseFloat(el.style.top) + parseFloat(el.offsetHeight) - 10 && e.pageY < parseFloat(el.style.top) + parseFloat(el.offsetHeight)) ? true : false
      };

      if (self._resizeOpt.left || self._resizeOpt.right || self._resizeOpt.top || self._resizeOpt.bottom) {
        self._dragoffset.startX = e.clientX;
        self._dragoffset.startY = e.clientY;
        self._dragoffset.startW = el.offsetWidth;
        self._dragoffset.startH = el.offsetHeight;
        self._dragoffset.startPosX = el.offsetLeft;
        self._dragoffset.startPosY = el.offsetTop;
        self._isResizeReady = true;
      } else {
        self._isDragReady = true;
      }
    }, self._dragClickType);
  }

  onTouchUp(e) {
    clearTimeout(this._pressTimer);
    if (this._dragoffset.elem) {
      this._dragoffset.elem.style.zIndex = 0;
      if (this._grid && this._isDragReady) {
        var l = this._grid.calculateDragLocation(parseFloat(this._dragoffset.elem.style.left),
                                                 parseFloat(this._dragoffset.elem.style.top),
                                                 parseFloat(this._dragoffset.elem.offsetWidth), parseFloat(this._dragoffset.elem.offsetHeight));

        this._dragoffset.elem.style.top = l.y + 'px';
        this._dragoffset.elem.style.left = l.x + 'px';
      } else if (this._grid && this._isResizeReady) {
        var l = this._grid.calculateResizeLocation(parseFloat(this._dragoffset.elem.style.left),
                                                   parseFloat(this._dragoffset.elem.style.top),
                                                   parseFloat(this._dragoffset.elem.offsetWidth), parseFloat(this._dragoffset.elem.offsetHeight),
                                                   this._resizeOpt);
        this._dragoffset.elem.style.top = l.y + 'px';
        this._dragoffset.elem.style.left = l.x + 'px';
        this._dragoffset.elem.style.width = l.w + 'px';
        this._dragoffset.elem.style.height = l.h + 'px';
      }
      this._isDragReady = false;
      this._isResizeReady = false;
      this._dragoffset.elem = null;
    }
  }

  onTouchMove(e) {
    if (this._dragoffset.elem) {
      if (this._isDragReady) {
        let pageX = e.touches ? e.touches[0].pageX : e.pageX;
        let pageY = e.touches ? e.touches[0].pageY : e.pageY;
        this._dragoffset.elem.style.top = ((pageY - this._dragoffset.y) + this._dragoffset.elem.offsetHeight > this._container.offsetHeight ? this._container.offsetHeight - this._dragoffset.elem.offsetHeight : ((pageY - this._dragoffset.y) < 0 ? 0 : (pageY - this._dragoffset.y))) + 'px';
        this._dragoffset.elem.style.left = ((pageX - this._dragoffset.x) + this._dragoffset.elem.offsetWidth > this._container.offsetWidth ? this._container.offsetWidth - this._dragoffset.elem.offsetWidth : ((pageX - this._dragoffset.x) < 0 ? 0 : (pageX - this._dragoffset.x))) + 'px';
      } else if (this._isResizeReady) {
        if (this._resizeOpt.right) {
          this._dragoffset.elem.style.width = (this._dragoffset.startW + e.clientX - this._dragoffset.startX) + 'px';
        }
        if (this._resizeOpt.left) {
          this._dragoffset.elem.style.left = (this._dragoffset.startPosX + e.clientX - this._dragoffset.startX) + 'px';
          this._dragoffset.elem.style.width = (this._dragoffset.startW - e.clientX + this._dragoffset.startX) + 'px';
        }
        if (this._resizeOpt.top) {
          this._dragoffset.elem.style.top = (this._dragoffset.startPosY + e.clientY - this._dragoffset.startY) + 'px';
          this._dragoffset.elem.style.height = (this._dragoffset.startH - e.clientY + this._dragoffset.startY) + 'px';
        }
        if (this._resizeOpt.bottom) {
          this._dragoffset.elem.style.height = (this._dragoffset.startH + e.clientY - this._dragoffset.startY) + 'px';
        }
      }
    }
  }

  handleSepcialEvents(event, func, useCapture) {
    if (event == 'pinch' || event == 'slide') {
      document.addEventListener('touchstart', function(e) {
        if (e.touches.length == 2) {
          this._startPinchDiff = Math.abs(e.touches[0].pageX - e.touches[1].pageX) + Math.abs(e.touches[0].pageY - e.touches[1].pageY);
          this._isPinchActive = true;
        } else if (e.touches.length == 3) {
          this._startSlideDiff[0] = e.touches[0].pageX;
          this._startSlideDiff[1] = e.touches[1].pageX;
          this._startSlideDiff[2] = e.touches[2].pageX;
          this._isSlideActive = true;
        }
      }.bind(this), useCapture);
      document.addEventListener('touchmove', function(e) {
        if (e.touches.length == 2 && this._isPinchActive) {
          this._lastPinchDiff = Math.abs(e.touches[0].pageX - e.touches[1].pageX) + Math.abs(e.touches[0].pageY - e.touches[1].pageY);
        } else if (e.touches.length == 3 && this._isSlideActive) {
          this._lastSlideDiff[0] = e.touches[0].pageX;
          this._lastSlideDiff[1] = e.touches[1].pageX;
          this._lastSlideDiff[2] = e.touches[2].pageX;
        }
      }.bind(this), useCapture);
      document.addEventListener('touchend', function(e) {
        if (this._isPinchActive) {
          this._isPinchActive = false;
          if (this._lastPinchDiff > this._startPinchDiff) {
            func(this, 'out');
          } else if (this._lastPinchDiff < this._startPinchDiff) {
            func(this, 'in');
          }
        } else if (this._isSlideActive) {
          if (this._startSlideDiff[0] > this._lastSlideDiff[0] &&
              this._startSlideDiff[1] > this._lastSlideDiff[1] &&
              this._startSlideDiff[2] > this._lastSlideDiff[2]) {
            func(this, 'left');
          } else if (this._startSlideDiff[0] < this._lastSlideDiff[0] &&
                     this._startSlideDiff[1] < this._lastSlideDiff[1] &&
                     this._startSlideDiff[2] < this._lastSlideDiff[2]) {
            func(this, 'right');
          }
        }
      }.bind(this), useCapture);
    }
  }

  on(event, func, useCapture=false) {
    if (this._type.isString(event)) {
      event = event.trim().split(/ /);
    }

    var elements = document.querySelectorAll(this._identifier);
    for (let value of event) {
      if (this._specialEvents.includes(value, func))
        this.handleSepcialEvents(value, func, useCapture);
      else {
        Array.prototype.forEach.call(elements, function(el, i){
          el.addEventListener(value, func, useCapture);
        });
      }
    }

    return this;
  }

  get identifier() { return this._identifier; }
  set identifier(new_id) { this._identifier = new_id; }
}

module.exports = MC;
