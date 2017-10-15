// Test file

$('.widget').css('height', $(window).height() / 10);
$('.widget').css('width', $(window).width() / 10);

var mcsolar = new MC('.widget', {
  resizable: false,
  container: '#widget-container'
});
var cnt = 0

mcsolar
  .on('click', function(event) {
    console.log('Simple click !!');
  })
  .on('dblclick', function(event) {
    console.log('Double click !!');
  });
