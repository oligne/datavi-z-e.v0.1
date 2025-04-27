// js/main.js
let fontBold, fontReg;
let analyseExtension, analyseDossier;
let points = [];

const stabilityThreshold = 0.1;
let lightMode = true;

// Page courante
let currentPage = 1;
const maxPage = 3;

function setup() {
  // délègue la création du canvas et init à la page active
  if (currentPage === 1)      setupPage1();
  else if (currentPage === 2) setupPage2();
  else if (currentPage === 3) setupPage3();
 
}


function draw() {
  // délègue le draw() à la page active
  if (currentPage === 1)      drawPage1();
  else if (currentPage === 2) drawPage2();
  else if (currentPage === 3) drawPage3();

  }


function keyPressed() {
  // ← / →
  if (keyCode === RIGHT_ARROW && currentPage < maxPage) {
    currentPage++;
    clear();
    setup();
  } else if (keyCode === LEFT_ARROW && currentPage > 1) {
    currentPage--;
    clear();
    setup();
} else if (keyCode === LEFT_ARROW && currentPage > 2) {
    currentPage--;
    clear();
    setup();
  }

  // Espace : simple inversion du flag
  else if (key === ' ') {
    lightMode = !lightMode;
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  clear();
  setup();
}



function drawCommonUI(){

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



}
