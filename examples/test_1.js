// Test file

var mcsolar = new MC('.widget', ['draggable']);
var cnt = 0

mcsolar
  .on('click', function(event) {
    console.log('Simple click !!');
  })
  .on('dblclick', function(event) {
    console.log('Double click !!');
  });
