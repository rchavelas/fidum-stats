"use strict"

// Functions to provide basic statistics to columns declared in spreadsheet
// Mainly powered by functionalities in jstat https://github.com/jstat/jstat

// Get data from handsontable
function descriptiveStatistics(cleanHotDataColwise, selectedCols,selectedStats){
    // arguments: prettyPrintArray, selectedColumns [1,3,4,...], stats: [mean, mode, sd, var,...]
    let statsVals = cleanHotDataColwise
    .filter(col => selectedCols.includes(col.colName))
    .map(col => {
        let statsObj = {colName: col.colName}
        // Compute selected statistics
        if(selectedStats.includes("mean")){
            let colData = col.colArr;
            let mean = colData.reduce((acc,val)=>acc+val)/colData.length
            statsObj.mean = mean
        }
        // Return array of stat values
        return statsObj 
    })    
    return statsVals
}
