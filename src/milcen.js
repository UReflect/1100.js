import {Type} from './type.js'
import {Draggable} from './draggable.js'
import {Resizable} from './resizable.js'

class MC {

  // MC constructor
  constructor(identifier, modifiers=[]) {
    this._identifier = identifier;
    this._modifiers_list = modifiers;
    this._type = new Type();
    this._modifiers = new Set();

    for (let [idx, modifier] of this._modifiers_list.entries()) this[modifier]();
  }

  // Set listener on element
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

    return this;
  }

  draggable() {
    if (!('draggable' in this._modifiers)) this._modifiers.add(new Draggable());
  }

  resizable() {
    if (!('resizable' in this._modifiers)) this._modifiers.add(new Resizable());
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

module.exports = MC;
