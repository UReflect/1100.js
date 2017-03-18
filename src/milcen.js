import {Type} from './type.js'

class Milcen {

  // Milcen constructor
  constructor(identifier) {
    this._identifier = identifier;
    this._type = new Type();
  }

  // Store events in the eventList
  on(event, func, useCapture=false) {
    if (this._type.isString(event)) {
      event = event.trim().split(/ /);
    }

    // Set listener for every event
    this._element = window.document.querySelectorAll(this._identifier);
    for (let [idx, elem] of event.entries()) {
      if (this._element.length > 0) {
        for (let e of this._element) {
          e.addEventListener(elem, func, useCapture);
        }
      }
    }
  }

  // Get identifier
  get identifier() {
    return this._identifier;
  }

  // Set identifier
  set identifier(new_id) {
    this._identifier = new_id;
    this._element = document.querySelectorAll(this._identifier);
  }
}

module.exports = Milcen;
