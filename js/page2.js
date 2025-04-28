let points2 = [];
const fixedSize = 3;
const occurPerPoint = 1;
const jitterAmount = 0.5;

function setupPage2(){
  points2 = []; 
  for (let r of analyseDate.getRows()) {
    const ext       = r.get('Extension');
    const yearMonth = r.get('YearMonth');
    const ptsNbr    = parseInt(r.get('points'), 10);
    const parent    = points.find(p => p.ext === ext);
    if (!parent) continue;

    // nombre de petits points à générer
    let n = Math.floor(ptsNbr / occurPerPoint);
    for (let i = 0; i < n; i++){
      // position aléatoire autour du parent
      let angle  = random(TWO_PI);
      let radius = random(parent.size/2 - 5);
      let x0     = parent.x + cos(angle) * radius;
      let y0     = parent.y + sin(angle) * radius;

      points2.push({
        parent,
        ext,
        yearMonth,        // ← on ajoute impérativement ce champ
        x: x0, y: y0,
        vx: 0, vy: 0,
        size: fixedSize
      });
    }
  }
}

let hoverExt = null; // Extension sous la souris

function drawPage2(){
  if (lightMode) background(255, 255, 250);
  else background(30);

  ///Storytelling
  textFont(fontReg);
  textSize(22);
  fill(lightMode ? 0 : 255);
  textAlign(CENTER, BOTTOM);
  text("Leurs diversité racontent l'évolution de mes pratiques \n au fil du temps...", (windowWidth/2), 50);



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


  hoverExt = null; // Reset à chaque frame
  let minDist = 9999; // On veut trouver le point le plus proche


  for (let p of points2) {
    // petit jitter
    p.vx += random(-jitterAmount, jitterAmount);
    p.vy += random(-jitterAmount, jitterAmount);
  
    // calcul de distance souris
    let d = dist(p.x, p.y, mouseX, mouseY);
  
    // répulsion si proche
    if (d < 30) {
      let angle = atan2(p.y - mouseY, p.x - mouseX);
      let force = map(d, 0, 50, 1, 0);
      p.vx += cos(angle) * force * 0.5;
      p.vy += sin(angle) * force * 0.5;
    }

   // mise à jour
  p.x += p.vx;
  p.y += p.vy;
  p.vx *= 0.9;
  p.vy *= 0.9;

  // confinement dans le cercle parent
  let dx = p.x - p.parent.x;
  let dy = p.y - p.parent.y;
  let distToParent = sqrt(dx*dx + dy*dy);
  let maxDist = p.parent.size/2 - 5;
  if (distToParent > maxDist) {
    let angle = atan2(dy, dx);
    p.x = p.parent.x + cos(angle) * maxDist;
    p.y = p.parent.y + sin(angle) * maxDist;
    p.vx *= -0.5;
    p.vy *= -0.5;
  }

// mémoriser l'extension la plus proche
if (d < 20 && d < minDist) { // Seuil plus souple (15px)
  minDist = d;
  hoverExt = p.parent.ext;
}

  }

  // collision simple
  for (let i = 0; i < points2.length; i++) {
    let a = points2[i];
    for (let j = i+1; j < points2.length && j < i+10; j++) {
      let b = points2[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      let d2 = dx*dx + dy*dy;
      if (d2 < fixedSize*fixedSize*2) {
        let angle = atan2(dy, dx);
        let push = 0.05;
        a.vx += cos(angle) * push;
        a.vy += sin(angle) * push;
        b.vx -= cos(angle) * push;
        b.vy -= sin(angle) * push;
      }
    }
  }

  // dessin des petits cercles
  noStroke();
  fill(lightMode ? 0 : 255);
  for (let p of points2) {
    ellipse(p.x, p.y, fixedSize);
  }

  // affichage du nom d'extension si besoin
  if (hoverExt) {
    fill(lightMode ? 0 : 255);
    textFont(fontBold);
    textSize(18);
    textAlign(CENTER, TOP);
    text(hoverExt, mouseX + 10, mouseY + 10);
  }
}