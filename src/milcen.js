import {Type} from './type.js'

class Milcen {

  // Milcen constructor
  constructor(identifier) {
    this._identifier = identifier;
    this._eventList = new Set();
    this._type = new Type();
  }

  // Store events in the eventList
  on(event) {
    if (this._type.isString(event)) {
      event = event.trim().split(/ /);
      if (event.length == 1) event = event[0];
    }

    // Repeat action for every element
    if (this._type.isArray(event)) {
      for (let [idx, elem] of event.entries()) this.on(elem);
      return this;
    }

    this._eventList.add(event);
  }

  // Get identifier
  get identifier() {
    return this._identifier;
  }

  // Set identifier
  set identifier(new_id) {
    this._identifier = new_id;
  }

  // Get eventList
  get eventList() {
    return this._eventList;
  }

  // Set EventList
  set eventList(events) {
    this._eventList = new Set(events);
  }
}

module.exports = Milcen;
