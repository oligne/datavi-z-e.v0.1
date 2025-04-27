function preload(){
    font = loadFont('Avara-Black.otf');
    font2 = loadFont('Lithops-Regular.otf');
  
    // tabledata = loadTable('assets/data_vie2', 'csv', 'header');
    analyseType = loadTable('analyse_type.csv', 'csv', 'header');
    analyseExtension = loadTable('analyse_extension.csv', 'csv', 'header');
    analyseDossier = loadTable('analyse_dossier.csv', 'csv', 'header');


}

function setup(){
    createCanvas(windowWidth,windowHeight)


//// 1 POINT PAR EXTENSIONS

    for (let i = 0; i < analyseExtension.getRowCount(); i++) {

        console.log(analyseExtension.getRow(i).obj);
        let extension = analyseExtension.getString(i, 'Valeur');
        let pourcentage = parseFloat(analyseExtension.getString(i, 'Pourcentage').replace(',', '.'));


        let size = map(pourcentage, 0, 40, 10, 100); // Taille du cercle
    
        let p = {
          extension,
          pourcentage,
          size,
          x: random(((width/2)+20),(width/2)-20),
          y: random(((height/2)+20),(height/2)-20),
          vx: 0,
          vy: 0
        };
    
        pointsPE.push(p);
      }
    }


function draw(){
        background(255, 255, 250);
      }