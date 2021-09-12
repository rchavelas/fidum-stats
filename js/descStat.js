"use strict"

// Functions to provide basic statistics to columns declared in spreadsheet
// Mainly powered by functionalities in jstat https://github.com/jstat/jstat

// Helper fuctions
// Variance (https://www.tutorialspoint.com/calculating-variance-for-an-array-of-numbers-in-javascript)
function varFn(arr){
    if(!arr.length){
        return 0
    }
    // compute mean
    var sum = arr.reduce((acc,val) => acc + val);
    var num = arr.length;
    var mean = sum/num;
    // Compute var
    var variance = 0;
    arr.forEach(val => {
        variance += ((val-mean)*(val-mean))
    })
    variance /= (num-1)
    return variance
}

// Compute selected stats 
function descriptiveStatistics(cleanHotDataColwise, selectedCols,selectedStats){
    // arguments: prettyPrintArray, selectedColumns [1,3,4,...], stats: [mean, mode, sd, var,...]
    let statsVals = cleanHotDataColwise
    .filter(col => selectedCols.includes(col.colName))
    .map(col => {
        let statsObj = {"Variable": col.colName}
        // Compute selected statistics
        // n obs
        if(selectedStats.includes("n")){
            let colData = col.colArr;
            let n = colData.length
            statsObj.n = n
        }
        // Mean
        if(selectedStats.includes("mean")){
            let colData = col.colArr;
            let mean = colData.reduce((acc,val)=>acc+val)/colData.length
            statsObj.Mean = roundFn(mean, defaultDecimalPlaces)
        }
        // variance (sample)
        if(selectedStats.includes("var")){
            let colData = col.colArr;
            let variance = varFn(colData)
            statsObj.Variance = roundFn(variance, defaultDecimalPlaces)
        }
        // standard deviation (sample)
        if(selectedStats.includes("sd")){
            let colData = col.colArr;
            let sd = Math.sqrt(varFn(colData))
            statsObj.Sd = roundFn(sd, defaultDecimalPlaces)
        }
        // Return array of stat values
        return statsObj 
    })    
    return statsVals
}
