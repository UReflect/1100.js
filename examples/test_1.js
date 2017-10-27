// Test file

// $('.widget').css('width', $(window).width() / 10);
// $('.widget').css('height', $(window).height() / 10);

var mcsolar = new MC('.widget', {
  container: 'widget-container',
  grid: {
    debug: false,
    pile: false
  }
});
var cnt = 0

mcsolar
  .on('click', function(event) {
    console.log('Simple click !!');
  })
  .on('dblclick', function(event) {
    console.log('Double click !!');
  });
