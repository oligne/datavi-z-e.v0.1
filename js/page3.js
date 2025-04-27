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
  if (lightMode) background(255, 255, 250);
  else background(30);
  drawCommonUI();

  const centerY = height / 2;
  stroke(lightMode ? 50 : 200);
  strokeWeight(2);
  line(clusterPaddingX, centerY, width - clusterPaddingX, centerY);

  strokeWeight(1);
  months.forEach((m, i) => {
    const x = map(i, 0, months.length - 1, clusterPaddingX, width - clusterPaddingX);
    line(x, centerY - 5, x, centerY + 5);
  });

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

  hoverExt3 = null;
  
  // Important : ne reset PAS hoveredLegendExt ici ! (sinon ça saute au survol)

  noStroke();
  points2.forEach(p => {
    // ─── Répulsion entre proches ───
    const others = clusters[p.yearMonth][p.ext];
    const minD = p.size * 5;
    for (let q of others) {
      if (q === p) continue;
      let dx = p.x - q.x, dy = p.y - q.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < minD * minD) {
        let d = sqrt(d2) || 1;
        let push = (minD - d) * 0.01;
        let ang = atan2(dy, dx);
        p.vx += cos(ang) * push;
        p.vy += sin(ang) * push;
      }
    }

    // ─── Retour au centre du cluster ───
    let dx = p.x - p.clusterX;
    let dy = p.y - p.clusterY;
    p.vx += -dx * springK;
    p.vy += -dy * springK;

    // ─── Effet souris doux ───
    let dm2 = sq(p.x - mouseX) + sq(p.y - mouseY);
    if (dm2 < mouseRepelDist * mouseRepelDist) {
      let dm = sqrt(dm2) || 1;
      let f = map(dm, 0, mouseRepelDist, mouseRepelForce, 0);
      let angM = atan2(p.y - mouseY, p.x - mouseX);
      p.vx += cos(angM) * f;
      p.vy += sin(angM) * f;
    }

    // ─── Update mouvement ───
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= damping3;
    p.vy *= damping3;
  });

  // ─── DESSIN des points APRÈS update ───
  points2.forEach(p => {
    if (hoveredLegendExt) {
      if (p.ext === hoveredLegendExt) {
        fill(255, 0, 0); // rouge pétant
      } else {
        fill(lightMode ? 0 : 255); // neutre
      }
    } else {
      fill(lightMode ? 0 : 255); // neutre
    }
    ellipse(p.x, p.y, p.size * 1.2);

    // Détection hover pour tooltip
    if (dist(p.x, p.y, mouseX, mouseY) < p.size * 0.6) {
      hoverExt3 = p.ext;
    }
  });

  // ─── Légende interactive ───
  const margin = 20;
  const legendY = height - 100;
  const countExt = legendExts.length;
  const spacing = (width - 2 * margin) / countExt;

  textFont(fontReg);
  textSize(12);
  textAlign(CENTER, TOP);

  let legendHovered = false; // pour savoir si la souris est sur une légende

  legendExts.forEach((ext, i) => {
    const x = margin + spacing * i + spacing / 2;
    const half = spacing / 2;
    const isHit = mouseX > x - half &&
                  mouseX < x + half &&
                  mouseY > legendY &&
                  mouseY < legendY + 14;

    if (isHit) {
      hoveredLegendExt = ext;
      legendHovered = true;
    }

    if (hoveredLegendExt === ext) {
      fill(255, 0, 0); // rouge
    } else {
      fill(lightMode ? 0 : 255);
    }

    noStroke();
    text(ext, x, legendY);
  });

  if (!legendHovered) {
    hoveredLegendExt = null;
  }

  // ─── Tooltip si survol point ───
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