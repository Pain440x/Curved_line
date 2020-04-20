let linePoints = [];
linePoints.push(new myPoints())
linePoints[0].addPoint(5,5);
// linePoints[0].addPoint(30,400);
// linePoints[0].addPoint(100,100);
// linePoints[0].addPoint(300,100);
// linePoints[0].addPoint(400,400);
// linePoints[0].addPoint(400,100);
linePoints[0].calculateLinePercent(document.getElementById("mySlider").value);
document.getElementById("mySlider").oninput = function(){
  linePoints[0].calculateLinePercent(this.value);
}
function setup() {
  createCanvas(800, 800);
  //let t = createGraphics(203,300);
  //console.log(t.width);
  background(0);
  pixelDensity(1);
  //document.getElementById('par').innerHTML = "value " + displayDensity();
}
function mousePressed() {
  linePoints[0].mouseEvent()
  //return false; // this fails on cell phone.
}
function touchEnded() {
  linePoints[0].touchReleased();
}
function draw() {
  linePoints[0].updateSelectedPoint();
  background(0);
  stroke(255);
  noFill();
  strokeWeight(2);
  linePoints[0].drawSegment();
  stroke(0,0,255);
  strokeWeight(10);
  linePoints[0].drawSegmentPoint();
  linePoints[0].drawCurvedLine();
  linePoints[0].drawMyPoints();
  linePoints[0].drawSelectedPoint();
}
