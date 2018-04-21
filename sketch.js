let linePoints = [];
linePoints.push(new myPoints())
linePoints[0].addPoint(5,5);
// linePoints[0].addPoint(30,400);
// linePoints[0].addPoint(100,100);
// linePoints[0].addPoint(300,100);
// linePoints[0].addPoint(400,400);
// linePoints[0].addPoint(400,100);

 document.getElementById("mySlider").oninput = function(){
  //linePoints[0].percent = this.value / linePoints[0].steppingPrecision;
  //linePoints[0].setLinePercent(this.value / linePoints[0].steppingPrecision);
  linePoints[0].calculateLinePercent(this.value);
}
//console.log(linePoints);
function setup() {
  createCanvas(800, 800);
  //let t = createGraphics(203,300);
  //console.log(t.width);
  background(0);
  pixelDensity(1);
//  document.getElementById('par').innerHTML = "value " + displayDensity();

}
function mousePressed() {
  //linePoints[0].tryAddPoint(mouseX, mouseY)
  linePoints[0].mouseEvent()

  //return false;
}
function draw() {

  background(0);
  stroke(255);
  noFill();
  strokeWeight(2);
  //rect(50,50,20,20);
  //point(4, 4);
  linePoints[0].drawSegment();
  stroke(0,0,255);
  strokeWeight(10);
  linePoints[0].drawSegmentPoint();
  linePoints[0].drawCurvedLine();

  stroke(0,255,0);
  strokeWeight(10);
  //point(4, 100);
  linePoints[0].drawMyPoints();

}
