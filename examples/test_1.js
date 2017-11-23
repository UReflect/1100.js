// Test file

// $('.widget').css('width', $(window).width() / 10);
// $('.widget').css('height', $(window).height() / 10);

var mcsolar = new MC('.widget', {
  container: 'widget-container',
  drag: {
    clickType: 'longClick'
  },
  grid: {
    debug: true,
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
  })
  .on('pinch', function(event, type) {
    if (type == 'in') {
      console.log('Pinch in !');
    } else {
      console.log('Pinch out !');
    }
  })
  .on('slide', function(event, type) {
    switch(type) {
      case 'left':
        console.log('Slide left !');
        break;
      case 'right':
        console.log('Slide Right !');
        break;
    }
  });
