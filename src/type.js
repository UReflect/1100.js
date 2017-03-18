export class Type {

  // Type constructor
  constructor() {}

  // Check if element is a String
  isString(elem) {
    return typeof elem === 'string';
  }

  // Check if element is an Array
  isArray(elem) {
    return elem.constructor === Array;
  }
}
