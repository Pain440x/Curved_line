function getCurrentAction() {
  let action
  if (document.getElementById("add").checked) {
    action = "add";
  }
  if (document.getElementById("removeP").checked) {
    action = "remove";
  }
  if (document.getElementById("move").checked) {
    action = "move";
  }
  return action;
}
function quickClick(timeGap = 0, lastTime = 0) {
  let cTime = new Date();
  if (lastTime + timeGap > cTime.getTime()) {
    return true;
  }
  return false;
}

function getSegmentPoint(p1,p2,percent) {
  tempX = p1.x - p2.x;
  tempY = p1.y - p2.y;
  newP = new myPoint(0,0);
  newP.x = p1.x - (tempX * percent);
  newP.y = p1.y - (tempY * percent);
  return newP;

}

class myPoint {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}
class myPoints {
  constructor() {
    this.points = [];
    this.percent = 0.5;
    //this.oldPercent = 0.0;
    this.keepImgBuffData = 0;
    this.loopStepping = 30;
    this.steppingPrecision = 10000;
    this.currentOffset = 0;
    this.selectDistance = 10;
    this.lastCickActionTime = 0;
  }
  addPoint(x,y) {
    this.points.push(new myPoint(x,y));
    this.clearImgBuffData();
  }
  removePoint(pIndex) {
    if (pIndex != null) {
      this.points.splice(pIndex, 1);
      this.clearImgBuffData();
      return true;
    }
  }
  tryAddPoint(x,y){
    if (x < 0) { return;}
    if (y < 0) { return;}
    if (x > width) { return;}
    if (y > height) { return;}
    this.addPoint(x,y);
    return true;
  }
  adjAddPoint(x,y){
    if (x < 0) { x = 0;}
    if (y < 0) { y = 0;}
    if (x > width) { x = width;}
    if (y > height) { y = height;}
    this.addPoint(x,y);
  }
  getSelectedPoint(){
    let tempPIndex = null;
    let distance = Infinity;
    for (let i = 0; i < this.points.length; i++) {
      let loopPoint = this.points[i];
      let dist = Math.pow(loopPoint.x - mouseX, 2) +
        Math.pow(loopPoint.y - mouseY,2);
      if (dist < Math.pow(this.selectDistance,2) && dist < distance) {
        tempPIndex = i;
        distance = dist;
      }

    }
    return tempPIndex;
  }
  tryRemoveSelectedPoint() {
    let tempPIndex = this.getSelectedPoint();
    if (tempPIndex != null) {
      return this.removePoint(tempPIndex);
      //this.points.splice(tempPIndex, 1);
    }
    return false;
  }
  mouseEvent(){
    let action = getCurrentAction();
    if (action == "add") {
      if ( quickClick(400, this.lastCickActionTime) ) {return;}
      if ( this.tryAddPoint(mouseX, mouseY) ) {
        this.lastCickActionTime = new Date().getTime();
      }
    } else if (action == "remove") {
      this.tryRemoveSelectedPoint();
    }

  }
  clearImgBuffData(){
    if ( this.img) {
      this.img.clear();
    }
    this.currentOffset = 0;
    this.keepImgBuffData = true;
  }
  setLinePercent(value = 0.5){
    this.percent = value;
    this.clearImgBuffData();
  }
  calculateLinePercent(value = linePoints[0].steppingPrecision * 0.5){
    if (linePoints[0].steppingPrecision == 0) { linePoints[0].steppingPrecision = 10;}
    this.setLinePercent(value / linePoints[0].steppingPrecision)
  }
  drawSegment(startP = 0,endP = -1) {
    if (startP < 0) {startP = 0;}
    if (startP >= this.points.length - 1) {return;}
    if (endP < 0 || endP > this.points.length - 1) {endP = this.points.length -1;}
    for (let i = startP;  i < endP; i++) {
      line(this.points[i].x,this.points[i].y,
        this.points[i+1].x,this.points[i+1].y);
    }
  }
  drawMyPoints(startP = 0, endP = -1){
    if (startP < 0) {startP = 0;}
    if (startP > this.points.length - 1) {return;}
    if (endP < 0 || endP > this.points.length - 1) {endP = this.points.length -1;}
    for (let i = startP; i <= endP; i++) {
      point(this.points[i].x , this.points[i].y);
    }
  }
  drawSegmentPoint(startP = 0,endP = -1) {
    if (startP < 0) {startP = 0;}
    if (startP >= this.points.length - 1) {return;}
    if (endP < 0 || endP > this.points.length - 1) {endP = this.points.length -1;}

    for (let i = startP;  i < endP; i++) {
      //point(40,400);
      let tempPoint = getSegmentPoint(this.points[i],this.points[i+1],
         this.percent);
      point(tempPoint.x,tempPoint.y);
    }
  }
  getSegmentPoints(percent) {
    let tempPoints = new myPoints();
    tempPoints.percent = percent;
    for(let i = 0; i < this.points.length - 1; i++) {
      let tempPoint = getSegmentPoint(this.points[i] , this.points[i + 1], percent);
      tempPoints.points.push(tempPoint);
    }
    return tempPoints;
  }
  getFinalSegmentPoint(percent) {
    let tempP;
     if (this.points.length > 2) {
       let tempPoints = this.getSegmentPoints(percent);
       tempP = tempPoints.getFinalSegmentPoint(percent);
     }
     else {
        tempP = getSegmentPoint(this.points[0], this.points[1], percent);
     }
     return tempP;
  }
  curvedlineDrawingLoop() {
    //let oldtempP = new myPoint(0,0);
    if (this.currentOffset >= this.loopStepping) {
      return;
    }
    if (this.steppingPrecision < 1) {this.steppingPrecision = 1;}
    for (let i = this.currentOffset;
      i < this.percent * this.steppingPrecision;
      i += this.loopStepping) {
      let tempP = this.getFinalSegmentPoint(i / this.steppingPrecision);
      //this.img.background(255,255,255);
      this.img.stroke(255,0,220);
      this.img.strokeWeight(10);
      if( tempP ) {
         //oldtempP = tempP;
         this.img.point(tempP.x,tempP.y);
       }
       // stroke(255,0,220);
       // strokeWeight(10);
       // if( tempP ) {
       //    //oldtempP = tempP;
       //    point(tempP.x,tempP.y);
       //  }
    }
    this.currentOffset ++;
  }
  drawCurvedLine() {
    if (this.points.length < 2) {return;}
    if (!this.img) {
      //stroke(255,0,0);
      //strokeWeight(50);
      //point(50,50);
      this.img = createGraphics(width, height);
    }
    if (this.keepImgBuffData != true ) {
      // this.img.clear();
      // this.currentOffset = 0;
      // this.keepImgBuffData = true;
    }
    this.curvedlineDrawingLoop();
    // //let oldtempP = new myPoint(0,0);
    // for (let i = 0; i < this.percent * 10000; i += 5) {
    //   let tempP = this.getFinalSegmentPoint(i * 0.0001);
    //   //this.img.background(255,255,255);
    //   this.img.stroke(255,0,220);
    //   this.img.strokeWeight(10);
    //   if( tempP ) {
    //      //oldtempP = tempP;
    //      this.img.point(tempP.x,tempP.y);
    //    }
    //     //point(tempP.x, tempP.y);
    //     //this.img.point(oldtempP.x, oldtempP.y);
    // }
    image(this.img, 0, 0, 800, 800);//is.img.width, this.img.width);
    //point(50,50);
  }
}
