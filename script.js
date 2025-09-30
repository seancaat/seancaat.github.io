var width = window.innerWidth;
var height = window.innerHeight;
var vertical = (width < height) ? true : false;

var mid = {x: width /2, y: height / 2};

tool.minDistance = 0.1 * width;

var path = new Path();
path.strokeWidth = (width > 700 ) ? 0.002 * width : (0.003 * width);
path.strokeCap = 'round';
path.strokeColor = '#0B0A0F';

var colors = [
  'rgb(236,112,99)',
  'rgb(155,96,52)',
  'rgb(245,189,75)',
  'rgb(231,231,130)',
  'rgb(234,240,183)',
  'rgb(173,213,167)',
  'rgb(106,183,128)',
  'rgb(109,191,137)',
  'rgb(34,95,62)',
  'rgb(124,199,177)',
  'rgb(106,188,204)',
  'rgb(131,207,240)',
  'rgb(184,209,236)',
  'rgb(62,88,167)',
  'rgb(212,175,207)',
  'rgb(245,219,234)',
  'rgb(250,190,208)',
  'rgb(245,287,203)',
  'rgb(211,3,34)',
  'rgb(90,86,88)',
  'rgb(113,113,113)',
  'rgb(202,202,202)',
];

var lil_fib = (width > 700) ? [2, 3, 5, 8] : [1,2,3,5];

var big_fib = (width > 700) ? [5, 8, 13, 21] : [3, 5, 8, 13];

var biggest_fib = (width < 700) ? [21, 34, 55] : [34,	55,	89];

var circles = [];

var segmentsAdded = 0;
var circlesAdded = 0;

function onMouseDown(event) {
  animate(event.count - Math.random());

  for(var i = 0; i < randof(lil_fib); i++) {
    var pt = pointInCircle(34 * randof(big_fib));

    path.add(event.point + pt);
    path.simplify();
    path.smooth({ type: 'catmull-rom', factor: 0.0 });
    segmentsAdded++;
  }

  var c2 = new Path.Circle(new Point(event.point.y, Math.random() * width), randof(biggest_fib));
  c2.fillColor = randof(colors);

  if(Math.random() < 0.49) {
    c2.insertBelow(path)
  } else {
    c2.shadowColor = 'rgb(0,0,0,0.45)';
    c2.shadowBlur = 21;
    c2.shadowOffset = new Point(0,0);
  }

  circles.push(c2);
  circlesAdded++;
}

function onMouseDrag(event) {
  animate(event.count - Math.random());

  //add to the squiggle
  for(var i = 0; i < randof(lil_fib); i++) {
    var pt = pointInCircle(21 * randof(big_fib));

    path.add(event.point + pt);
    path.simplify();
    path.smooth({ type: 'catmull-rom', factor: 0.0 });
    segmentsAdded++;
  }

  //add a randomly placed, randomly colored circle
  var c1 = new Path.Circle(new Point(event.point.x, Math.random() * height), randof(biggest_fib));
  c1.fillColor = randof(colors);

  //distort it a bit
  for(var i = 0; i < c1.segments.length; i++) {
    c1.segments[i].point.x += i * Math.random() * 5;
    c1.segments[i].point.y -= i * Math.random() * 5;
  }

  if(Math.random() < 0.49) {
    c1.insertBelow(path)
    c1.shadowColor = 'rgb(0,0,0,0.15)';
    c1.shadowBlur = 12;
    c1.shadowOffset = new Point(0, 0);

  } else {
    c1.shadowColor = 'rgb(0,0,0,0.25)';
    c1.shadowBlur = 34;
    c1.shadowOffset = new Point(0, 12);
  }

  circles.push(c1);
  circlesAdded++;
}

function onMouseUp(event) {

  // trim the path
  if(path.segments.length > 50) {
    for(var i = 0; i < segmentsAdded * (0.3 + Math.random()); i++) {
      setTimeout(function(){ path.removeSegment(0); segmentsAdded--}, 50 + 70 * i);
    }
  }
  
  // adjust fill color, rotate, and shadow if it has one
  for(var i = 0; i < circles.length; i++) {
    circles[i].tween(
      {fillColor: randof(colors), rotation: randof([-1 * Math.random(), 1 * Math.random()]) * 135},
      {easing: 'easeInOutCubic',
      duration: 100 + 10 * i}
    );
  }

  //if there's max circles, remove random portion of total circles 
  if(circles.length > 20) {
    for(var i = 0; i < circlesAdded * (0.2 + Math.random()); i++) {
      repeat(i);
    }

    function repeat(i) {
      setTimeout(function(){ circles[0].remove(); circlesAdded--; circles.shift();}, 50 + 200 * i);
    } 
  }
}

function onMouseMove(event) {
  animate(event.count - 0.5 * Math.random());
}

function animate(event) { 
  for(var i = 0; i < circles.length; i++) {
    if(i % 2 == 0) {
      circles[i].position.y += 0.5 * Math.random() * (Math.sin(event + i));
    } else {
      circles[i].position.y += 2.5 * Math.random() * (Math.cos(event+ i));
    }
  }

  for(var i = 0; i < path.segments.length; i++) {
    path.segments[i].point.x += 0.90 * Math.random() * Math.sin(0.3 *  event+Math.random() + randof(big_fib) * i);
    path.segments[i].point.y += 0.781 * Math.random() * Math.cos(0.5 *  event+Math.random() + randof(big_fib) * i);

    path.segments[i].handleIn +=  Math.random() * Math.cos(8 *  event+Math.random() + randof(big_fib) * i);
    path.segments[i].handleOut += 1.2 * Math.random() * Math.sin(13 *  event+Math.random() + randof(big_fib) * i);
  }
}


// UTILITIES
function pointInCircle(n) {
  // n is the radius
  var u = Math.random();
  var v = Math.random();

  var theta = u * 2.0 * Math.PI;
  var phi = Math.acos(2.0 * v - 1.0);
  var r = Math.cbrt(Math.random());

  var x = r * Math.sin(phi) * Math.cos(theta);
  var y = r * Math.sin(phi) * Math.sin(theta);

  return new Point(n * x, n * y);
}

function randof(array) {
  return array[Math.floor(Math.random() * array.length)];
}