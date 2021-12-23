var width = window.innerWidth;
var height = window.innerHeight;
var vertical = (width < height) ? true : false;

var mid = {x: width /2, y: height / 2};

tool.minDistance = 0.1 * width;

var path = new Path();
path.strokeWidth = (width > 700 ) ? 0.002 * width : (0.005 * width);
path.strokeColor = '#0B0A0F';
path.dashArray = [100, 144];


var colors = [
  "#F1E9DE",
  "#FFCECB",
  "#F7CA6B",
  "#FFA6A1",
  "#F3ADFD",
  "#A0FBFF",
  "#A8C8FF",
  "#ADB0FF",
  "#BC9579",
  "#474747",
  "#B0B2FC",
  "#B7FFB0",
  "#A6FFDA",
  "#A0FFFE",
  "#FFE4C6"
];

var lil_fib = (width > 700) ? [2, 3, 5, 8] : [1,2,3,5];

var big_fib = (width > 700) ? [5, 8, 13, 21] : [3, 5, 8, 13];

var biggest_fib = (width < 700) ? [21, 34, 55] : [34,	55,	89];

var circles = [];

var segmentsAdded = 0;
var circlesAdded = 0;

function onMouseDown(event) {
  // animate(event.count - Math.random());

  for(var i = 0; i < randof(lil_fib); i++) {
    var pt = pointInCircle(34 * randof(big_fib));

    path.add(event.point + pt);
    path.simplify();
    path.smooth({ type: 'catmull-rom', factor: 0.1 });
    segmentsAdded++;
  }

  // var c2 = new Path.Circle(new Point(event.point.y, Math.random() * width), randof(biggest_fib));
  // c2.fillColor = randof(colors);

  // if(Math.random() < 0.49) {
  //   c2.insertBelow(path)
  // } else {
  //   c2.shadowColor = 'rgb(0,0,0,0.45)';
  //   c2.shadowBlur = 21;
  //   c2.shadowOffset = new Point(0,0);
  // }

  // circles.push(c2);
  // circlesAdded++;
}

function onMouseDrag(event) {
  // animate(event.count - Math.random());

  //add to the squiggle
  for(var i = 0; i < randof(lil_fib); i++) {
    var pt = pointInCircle(21 * randof(big_fib));

    path.add(event.point + pt);
    path.simplify();
    path.smooth({ type: 'catmull-rom', factor: 0.2 });
    segmentsAdded++;
  }
}

function onMouseUp(event) {}

function onFrame(event) {
  for(var i = 0; i < path.segments.length; i++) {

    path.segments[i].point.x += 0.5 * Math.sin(0.03 *  event.time * i);
    path.segments[i].point.y += 0.85 * Math.cos(0.05 *  event.time * i);

    path.segments[i].handleOut += 0.03 * Math.sin(event.time * i);

    path.strokeWidth = 10 + 7 * Math.sin(event.time / 2);
    path.dashArray = [50 + 10 * Math.sin(event.time / 4), 144];
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