let countCollisions = 0;
let showCollisions = true;
let showCollisionsInRange = true;
let showCollisionsOutOfRange = false;

function testAllCollisions(shapes) {
  countCollisions = 0;
  for (let i in shapes) {
    i = parseInt(i);
    for (let j = i+1; j < shapes.length; j++) {
    	testCollision(shapes[i], shapes[j]);
    }
  }
}

function testCollision(shapeA, shapeB) {
  let valueToReturn = false;
	for (let lineA of shapeA.lines) {
    for (let lineB of shapeB.lines) {
      let w = lineB.func.a - lineA.func.a;
      let wx = lineA.func.b - lineB.func.b;
      let wy = (-lineA.func.a * lineB.func.b) + (lineB.func.a * lineA.func.b);

      if (lineA.func.x && lineB.func.x) {
        let bothWithX = true;
      } 

      if (w == 0) {
      	if (wx == 0 && wy == 0) {
          // collision detected, check the range
          logError('Error Code: #AUEJ32');
        }
      } else {
      	// collision detected, check the range
        
        // the collision point coords:
        let x = wx/w;
        let y = wy/w;
        
        // minmax coords:
        let A_minX = min(lineA.points[0].x, lineA.points[1].x);
        let A_maxX = max(lineA.points[0].x, lineA.points[1].x);
        let A_minY = min(lineA.points[0].y, lineA.points[1].y);
        let A_maxY = max(lineA.points[0].y, lineA.points[1].y);
        
        let B_minX = min(lineB.points[0].x, lineB.points[1].x);
        let B_maxX = max(lineB.points[0].x, lineB.points[1].x);
        let B_minY = min(lineB.points[0].y, lineB.points[1].y);
        let B_maxY = max(lineB.points[0].y, lineB.points[1].y);
        
        if (lineA.func.x && lineB.func.x) {
          let bothWithX = true; // TODO: what if both are infinite?
        } else if (lineA.func.x || lineB.func.x) { 

          let finite = (lineA.func.x) ? lineB : lineA;
          let infinite = (finite == lineB) ? lineA : lineB;
          
          let inf_X = infinite.func.x;
          let inf_minY = min(infinite.points[0].y, infinite.points[1].y);
          let inf_maxY = max(infinite.points[0].y, infinite.points[1].y);


          let fin_minX = min(finite.points[0].x, finite.points[1].x);
          let fin_maxX = max(finite.points[0].x, finite.points[1].x);

          // test the range
          if (fin_minX <= inf_X && fin_maxX >= inf_X) {
            let fin_Y = finite.func.y(inf_X);
            if (inf_minY <= fin_Y && inf_maxY >= fin_Y) {
              countCollisions++;
              if (showCollisions && showCollisionsInRange) {
                // show that point
                fill(80,210,80);
                circle(inf_X,fin_Y,PointSize);
              }
              valueToReturn = true;
            }
          }
        }

        // test the range
        if ((A_minX <= x && x <= A_maxX &&
             A_minY <= y && y <= A_maxY) &&
            (B_minX <= x && x <= B_maxX &&
             B_minY <= y && y <= B_maxY)){
          // collision in range
        	countCollisions++;
          if (showCollisions && showCollisionsInRange) {
            // show that point
            fill(80,210,80);
            circle(x,y,PointSize);
          }
          valueToReturn = true;
        } else {
          if (showCollisions && showCollisionsOutOfRange) {
            // show that point
            fill(80,80,210);
            circle(x,y,PointSize);
          }
        }
      }
    }
  }
  return valueToReturn;
}