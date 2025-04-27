function getMinValue(tableau, col){
    let  value1 = tableau.getString(1,col);
    let min = parseFloat(value1)
    if (min) {
      
    }
    for (let i = 0; i < tableau.getRowCount(); i++) {
       let valeurCellule = table.getString(i, col);
       valeurCellule = parseFloat(valeurCellule);
     if(valeurCellule<min){
       min = valeurCellule;
     }
    }
   // print(min)
    return min;
  }




  function getMaxValue(tableau, col){
    let  value1 = tableau.getString(1,col);
    print(value1);
    let max = parseFloat(value1);
    for (let i = 0; i < tableau.getRowCount(); i++) {
       let valeurCellule = table.getString(i, col);
       valeurCellule = parseFloat(valeurCellule);
     if(valeurCellule>max){
       max = valeurCellule;
     }
    }
    return max;
 }