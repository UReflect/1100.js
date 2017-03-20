export class Draggable {

  constructor(identifier) {
    console.log("New Draggable !!");

    this._identifier = identifier;
    setupDraggable();
  }

  setupDraggable() {
    let elements = window.document.querySelectorAll(this._identifier);
      for (let [idx, elem] of elements.entries()) {
        
      }
  }
}
