// Test file

var milcen = new Milcen(".widget");
var cnt = 0

milcen.on("dragstart", function(event) {
  console.log(event.dx);
});
