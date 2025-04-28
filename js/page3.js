// ───────────────── Variables pour Page 3 ─────────────────
const clusterPaddingX = 100;
const clusterRadius   = 200;
const springK         = 0.001;
const damping3        = 0.85;
const mouseRepelDist  = 60;
const mouseRepelForce = 0.2;

let months = [];
let legendExts = [];
let hoverExt3 = null;
let hoveredLegendExt = null;
let clusters = {};


function setupPage3() {
  colorMode(RGB, 255);

  months = [...new Set(points2.map(p => p.yearMonth))].sort();
  legendExts = [...new Set(points2.map(p => p.ext))].sort();

  const centerY = height / 2;
  const clusterSpacing = clusterRadius / 2;

  clusters = {};
  points2.forEach(p => {
    const monthIdx = months.indexOf(p.yearMonth);
    const monthX = map(monthIdx, 0, months.length - 1, clusterPaddingX, width - clusterPaddingX);

    if (!clusters[p.yearMonth]) clusters[p.yearMonth] = {};
    if (!clusters[p.yearMonth][p.ext]) clusters[p.yearMonth][p.ext] = [];

    const extClusters = Object.keys(clusters[p.yearMonth]);
    const extIdx = extClusters.indexOf(p.ext);
    const clusterOffset = (extIdx - (extClusters.length-1)/2) * clusterSpacing;

    p.clusterX = monthX + clusterOffset;
    p.clusterY = centerY;

    let a = random(TWO_PI);
    let r = random(20);
    p.x = p.clusterX + cos(a) * r;
    p.y = p.clusterY + sin(a) * r;
    p.vx = 0;
    p.vy = 0;

    clusters[p.yearMonth][p.ext].push(p);
  });
}


function drawPage3() {
  // ─── Fond et UI commune ───
  if (lightMode) background(255, 255, 250);
  else           background(30);
  drawCommonUI();

  // ─── Axe temporel ───
  const centerY = height / 2;
  stroke(lightMode ? 50 : 200);
  strokeWeight(2);
  line(clusterPaddingX, centerY, width - clusterPaddingX, centerY);

  strokeWeight(1);
  months.forEach((m, i) => {
    const x = map(i, 0, months.length - 1, clusterPaddingX, width - clusterPaddingX);
    line(x, centerY - 5, x, centerY + 5);
  });

  // ─── Écriture des années ───
  noStroke();
  textFont(fontReg);
  textSize(14);
  fill(lightMode ? 0 : 255);
  textAlign(CENTER, BOTTOM);
  let drawn = new Set();
  months.forEach((m, i) => {
    let [y] = m.split('-');
    if (!drawn.has(y)) {
      let x = map(i, 0, months.length - 1, clusterPaddingX, width - clusterPaddingX);
      text(y, x, centerY - 10);
      drawn.add(y);
    }
  });

  // ─── Reset hover point ext ───
  hoverExt3 = null;

  // ─── Détection du survol de la légende ───
  const margin  = 20;
  const legendY = height - 100;
  const countExt = legendExts.length;
  const spacing  = (width - 2 * margin) / countExt;

  hoveredLegendExt = null;
  legendExts.forEach((ext, i) => {
    const x    = margin + spacing * i + spacing / 2;
    const half = spacing / 2;
    if (
      mouseX > x - half &&
      mouseX < x + half &&
      mouseY > legendY &&
      mouseY < legendY + 14
    ) {
      hoveredLegendExt = ext;
    }
  });

  // ─── UPDATE PHYSIQUE ───
  // Si aucune extension survolée, on met à jour tous les points.
  // Sinon, on met à jour _seulement_ ceux qui correspondent (points rouges).
  noStroke();
  points2.forEach(p => {
    if (hoveredLegendExt && p.ext !== hoveredLegendExt) {
      // point non-sélectionné figé : on skippe l'update
      return;
    }
    // ---- répulsion intra-cluster ----
    const others = clusters[p.yearMonth][p.ext];
    const minD   = p.size * 5;
    for (let q of others) {
      if (q === p) continue;
      let dx = p.x - q.x, dy = p.y - q.y;
      let d2 = dx*dx + dy*dy;
      if (d2 < minD*minD) {
        let d = sqrt(d2) || 1;
        let push = (minD - d) * 0.01;
        let ang  = atan2(dy, dx);
        p.vx += cos(ang)*push;
        p.vy += sin(ang)*push;
      }
    }
    // ---- retour au centre ----
    let dx = p.x - p.clusterX, dy = p.y - p.clusterY;
    p.vx += -dx * springK;
    p.vy += -dy * springK;
    // ---- effet souris ----
    let dm2 = sq(p.x - mouseX) + sq(p.y - mouseY);
    if (dm2 < mouseRepelDist*mouseRepelDist) {
      let dm = sqrt(dm2) || 1;
      let f  = map(dm, 0, mouseRepelDist, mouseRepelForce, 0);
      let angM = atan2(p.y - mouseY, p.x - mouseX);
      p.vx += cos(angM)*f;
      p.vy += sin(angM)*f;
    }
    // ---- appliquer mouvement ----
    p.x  += p.vx;
    p.y  += p.vy;
    p.vx *= damping3;
    p.vy *= damping3;
  });


  const bgAlpha = hoveredLegendExt ? 30 : 255;

  // ─── DESSIN DES POINTS ───
  // 1) Points NON-hover (en noir/blanc), ils sont figés si on survole
  points2.forEach(p => {
    if (hoveredLegendExt && p.ext === hoveredLegendExt) return;
    if (lightMode) {
      fill(0, bgAlpha);
    } else {
      fill(255, bgAlpha);
    }
    ellipse(p.x, p.y, p.size * 0.8);
    if (dist(p.x, p.y, mouseX, mouseY) < p.size * 3) {
      hoverExt3 = p.ext;
    }
  });
  // 2) Points hoverés (en rouge), dessinés en dernier -> toujours au premier plan
  if (hoveredLegendExt) {
    points2.forEach(p => {
      if (p.ext === hoveredLegendExt) {
        fill(255, 0, 0);
        ellipse(p.x, p.y, p.size * 1);
      }
    });
  }

  // ─── DESSIN DE LA LÉGENDE ───
  textFont(fontReg);
  textSize(12);
  textAlign(CENTER, TOP);
  legendExts.forEach((ext, i) => {
    const x = margin + spacing * i + spacing / 2;
    fill(hoveredLegendExt === ext ? color(255, 0, 0) : (lightMode ? 0 : 255));
    noStroke();
    text(ext, x, legendY);
  });

  // ─── TOOLTIP SI SURVOL POINT ───
  if (hoverExt3) {
    push();
      textFont(fontBold);
      textSize(16);
      fill(lightMode ? 0 : 255);
      noStroke();
      textAlign(LEFT, TOP);
      text(hoverExt3, mouseX + 10, mouseY + 10);
    pop();
  }
}
