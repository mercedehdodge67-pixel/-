/* script.js — منطق بازی و رسم بردارها با p5.js (آرام و بی‌صدا) */
let x = 3, y = 4, k = 2;
let sketchInstance;

// helpers
function roundTo(n, d){ const p = Math.pow(10, d||2); return Math.round(n*p)/p; }
function updateResultText(){
  const nx = roundTo(k*x,3), ny = roundTo(k*y,3);
  const dirText = (k < 0) ? 'و در جهت مخالف قرار دارد.' : 'و در همان جهت قرار دارد.';
  const zeroText = (k === 0) ? ' (ضریب صفر است؛ بردار صفر شده).' : '';
  document.getElementById('resultText').innerText = `بردار جدید: (${nx}, ${ny}) ${dirText}${zeroText}`;
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');

  calcBtn.addEventListener('click', () => {
    const xv = parseFloat(document.getElementById('x').value);
    const yv = parseFloat(document.getElementById('y').value);
    const kv = parseFloat(document.getElementById('k').value);

    x = isNaN(xv) ? 0 : xv;
    y = isNaN(yv) ? 0 : yv;
    k = isNaN(kv) ? 1 : kv;
    updateResultText();
    if(sketchInstance && typeof sketchInstance.redrawCanvas === 'function') sketchInstance.redrawCanvas();
  });

  resetBtn.addEventListener('click', () => {
    document.getElementById('x').value = 3;
    document.getElementById('y').value = 4;
    document.getElementById('k').value = 2;
    x=3; y=4; k=2;
    updateResultText();
    if(sketchInstance && typeof sketchInstance.redrawCanvas === 'function') sketchInstance.redrawCanvas();
  });

  updateResultText();
});

// p5 sketch
(function(){
  const s = (p) => {
    p.setup = function(){
      const holder = document.getElementById('sketch-holder');
      const w = Math.max(260, holder.clientWidth - 12);
      p.createCanvas(w, w).parent('sketch-holder');
      p.pixelDensity(1);
      p.noLoop();
      // initial draw
      p.redraw();
    };

    p.windowResized = function(){
      const holder = document.getElementById('sketch-holder');
      const w = Math.max(220, holder.clientWidth - 12);
      p.resizeCanvas(w, w);
      if(typeof p.redraw === 'function') p.redraw();
    };

    p.redrawCanvas = function(){ p.redraw(); };

    p.draw = function(){
      p.clear();
      // background subtle grid
      p.push();
      p.noFill();
      p.stroke(225,235,245);
      const step = Math.max(20, Math.round(p.width/14));
      for(let gx = step; gx < p.width; gx += step){ p.line(gx,0,gx,p.height); p.line(0,gx,p.width,gx); }
      p.pop();

      // origin to center
      p.push();
      p.translate(p.width/2, p.height/2);

      // axes
      p.stroke(150);
      p.strokeWeight(1.2);
      p.line(-p.width/2+6,0,p.width/2-6,0);
      p.line(0,-p.height/2+6,0,p.height/2-6);

      // scale (pixels per unit) depending on canvas size
      const unit = Math.max(12, Math.round(Math.min(p.width,p.height)/28));
      const toPX = (v) => v * unit;

      // original vector (green)
      p.stroke(46,160,113);
      p.strokeWeight(3);
      p.push();
      p.line(0,0,toPX(x), -toPX(y));
      drawArrow(p, toPX(x), -toPX(y), 10);
      p.pop();

      // multiplied vector
      const isNeg = (k < 0);
      p.stroke(isNeg ? [224,75,75] : [43,143,214]);
      p.strokeWeight(3.5);
      p.push();
      p.line(0,0,toPX(k*x), -toPX(k*y));
      drawArrow(p, toPX(k*x), -toPX(k*y), 12);
      p.pop();

      // labels
      p.noStroke();
      p.fill(30);
      p.textSize(Math.max(12, Math.round(p.width/26)));
      p.textAlign(p.LEFT, p.TOP);
      p.text(`A(${x}, ${y})`, -p.width/2 + 10, -p.height/2 + 10);
      p.text(`kA(${roundTo(k*x,2)}, ${roundTo(k*y,2)})`, -p.width/2 + 10, -p.height/2 + 30);

      p.pop();
    };

    function drawArrow(p, tx, ty, size){
      p.push();
      p.translate(tx, ty);
      const angle = Math.atan2(ty, tx);
      p.rotate(angle);
      p.fill(30);
      p.noStroke();
      p.triangle(-size, -size/2, -size, size/2, 0, 0);
      p.pop();
    }
  };

  sketchInstance = new p5(s);
  // expose redraw on window to allow external triggers
  window.addEventListener('resize', () => { if(sketchInstance && typeof sketchInstance.redrawCanvas === 'function') sketchInstance.redrawCanvas(); });
})();
