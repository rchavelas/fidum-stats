"use strict"

// Functions to provide basic statistics to columns declared in spreadsheet
// Mainly powered by functionalities in jstat https://github.com/jstat/jstat

// Get data from handsontable
function descriptiveStatistics(){
    // arguments: prettyPrintArray, selectedColumns [1,3,4,...], stats: [mean, mode, sd, var,...]
    // Replace with arguments
    let prettyPrintArray = cleanHandosontableSourceData(hot.getSourceDataArray()) 
    let jObj = jStat(prettyPrintArray)
    // Test if column has all numeric values or not to give proper stats

    //Create object to hold values
    var desctStatsObj = {};
    // Convert column to numbers in a specified column
    var c = 0 // Column
    var numCol = jObj.col(c).map(function(d){return Number(d)})
    // Get the mean of the specified colum
    var meanCol = numCol.mean()[0].toFixed(3)
    desctStatsObj.Mean = meanCol
    // Get the variance of the specified colum
    var varCol = numCol.variance()[0].toFixed(3)
    desctStatsObj.Variance = varCol
    // Return object with specified values
    return desctStatsObj
}

