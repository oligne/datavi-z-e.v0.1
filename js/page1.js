

//let lightMode = true;


function preload(){
  // Bold font for bubble labels
  fontBold = loadFont('AdobeClean-BoldIt.otf');
  // Regular font for on-screen hint
  fontReg  = loadFont('AdobeClean-BoldIt.otf');

  analyseExtension = loadTable('analyse_extension.csv', 'csv', 'header');
  analyseDossier   = loadTable('analyse_dossier.csv'  , 'csv', 'header');
  analyseDate      = loadTable('analyse_date.csv', 'csv', 'header');

}

function setupPage1(){
  createCanvas(windowWidth, windowHeight);
  textFont(fontReg);
  textSize(14);
  noStroke();

  // Precompute bubbles, clustered around center
  let hasOcc = analyseExtension.columns.includes('Occurrences');
  for (let i = 0; i < analyseExtension.getRowCount(); i++) {
    let ext  = analyseExtension.getString(i, 'Valeur');
    let perc = parseFloat(
      analyseExtension.getString(i, 'Pourcentage').replace(',', '.')
    );

    // Get occurrence count or fallback to dossier lookup
    let rawOcc = hasOcc
      ? analyseExtension.getString(i, 'Occurrences')
      : null;
    let count = 0;
    if (rawOcc) {
      count = parseInt(rawOcc.replace(/\s/g, ''), 10) || 0;
    } else {
      let matches = analyseDossier.findRows(ext, 'Valeur');
      count = matches ? matches.length : 0;
    }

    // Base size from percentage
    let baseSize = map(perc, 0, 40, 50, 200);

    // Measure both labels so text always fits
    textFont(fontBold);
    let wPct = textWidth(`${perc}%`);
    let wCnt = textWidth(`${count}`);
    let needed = max(wPct, wCnt) + 10;
    let finalSize = max(baseSize, needed);

    // Start clustered around center ±100px
    let startX = random(width/2 - 100, width/2 + 100);
    let startY = random(height/2 - 100, height/2 + 100);

    points.push({
      ext, perc, count, size: finalSize,
      x: startX, y: startY,
      vx: 0, vy: 0
    });
  }
}



function drawPage1(){
  // Light mode: soft yellow; dark mode: near-black
  if (lightMode) background(255, 255, 250);
  else          background(30);

  ///Storytelling
  textFont(fontReg);
  textSize(22);
  fill(lightMode ? 0 : 255);
  textAlign(CENTER, BOTTOM);
  text('Peut-être que mes fichiers racontent quelque chose ?', (windowWidth/2), 50);



  // annotatation Espace Gauche
  let hint = 'Appuyez sur [Espace] pour changer de mode';
  textFont(fontReg);
  textSize(16);
  fill(lightMode ? 0 : 255);
  textAlign(LEFT, BOTTOM);
  text(hint, 20, height - 20);
  let tw = textWidth(hint);
  stroke(lightMode ? 0 : 255);
  strokeWeight(1);
  noStroke();

   // annotatation Fleche Droite
   let hint2 = 'Appuyez sur [<-] et [->] pour explorer les visualisations';
   textFont(fontReg);
   textSize(16);
   fill(lightMode ? 0 : 255);
   textAlign(RIGHT, BOTTOM);
   text(hint2, (windowWidth)-20, height - 20);
   let tw2 = textWidth(hint);
   stroke(lightMode ? 0 : 255);
   strokeWeight(1);
   noStroke();

  // Repulsion physics
  for (let i = 0; i < points.length; i++) {
    let a = points[i];
    for (let j = i + 1; j < points.length; j++) {
      let b = points[j];
      let dx = a.x - b.x, dy = a.y - b.y;
      let distSq = dx*dx + dy*dy;
      let minD = (a.size + b.size)/2 + 5;
      if (distSq < minD*minD) {
        let dist = sqrt(distSq),
            f    = (minD - dist) * 0.01,
            ang  = atan2(dy, dx),
            fx   = cos(ang)*f,
            fy   = sin(ang)*f;
        a.vx += fx;  a.vy += fy;
        b.vx -= fx;  b.vy -= fy;
      }
    }
  }

  // Move & draw bubbles + two-line labels
  textAlign(CENTER, CENTER);
  textFont(fontBold);
  for (let p of points) {
    // motion
    p.x += p.vx;  p.y += p.vy;
    p.vx *= 0.55; p.vy *= 0.55;
    // bounds
    p.x = constrain(p.x, p.size/2, width  - p.size/2);
    p.y = constrain(p.y, p.size/2, height - p.size/2);

    // bubble
    if (lightMode) fill(0);
    else          fill (255, 255, 250);
    //fill(lightMode ? 0 : 255);
    ellipse(p.x, p.y, p.size);

    // labels: extension name above, value below
    fill(lightMode ? 255 : 0);
    let offset = p.size * 0.12;
    textSize(14);
    text(p.ext, p.x, p.y - offset);
    let val = lightMode ? `${p.perc}%` : `${p.count}`;
    textSize(10);
    text(val, p.x, p.y + offset);
  }
}


function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
