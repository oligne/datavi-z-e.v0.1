let table;
let nom;
let prenom; 
let os;
let brouillon;
let transports; 


let valeurTransports = ['velo', 'tram', 'metro', 'marche', 'metro']
let minDrive;
let maxDrive; 


function preload() {
  font = loadFont('Avara-Black.otf');
  font2 = loadFont('Lithops-Regular.otf');
  tableBase = loadTable('donnee.csv', 'csv', 'header');
  
}

function setup() {
  createCanvas(windowWidth,windowHeight, WEBGL);
print(table)
  	 	
console.log(table.getRowCount() + ' nombre total de ligne'); //repérer le nbr de ligne
print(table.getColumnCount() + ' nombre total de collone');//repérer le nbr de collones
print(table.columns)

let cellule = table.get(int(random(8)), int(random(8)));
print(cellule)

frameRate(2)

minDrive = getMinValue (table,3)
maxDrive = getMaxValue (table,3)

colorMode(HSL)
}

function draw(){
   let nbr =frameCount%table.getRowCount();
   


  let nom = table.get(nbr,0);
  let prenom = table.get(nbr,1);
  let os = table.get(nbr,2);
  let drive = table.get(nbr,3);

  let brouillon = table.get(nbr,5);
  let transports = table.get(nbr,5);

for (let i = 0; i <valeurTransports/length; i++) {
if (valeurTransports[i]==transports) {
fill(360/5*(i+1),100,500)

}
}


}
