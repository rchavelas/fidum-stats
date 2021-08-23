"use strict"

// Main functionalities of Fidum Online Statistical Software

// A) Helper functions

// FUNCTION to clean handsontable GetSourceData()
// Returns an array of arrays with only the columns and rows with any value
const cleanHandosontableSourceData = function(arrOfArr){
    // Clear empty rows
    let arrOfArrUsedRows = arrOfArr.filter(arr => {
        return !arr.every(value => (value === null || value === ""))
    })
    
    // Clear emtpy cells
    let arrOfArrUserInput;
    if(arrOfArrUsedRows.length>0){
        // Create an array as a flag to filter columns (usedColumns)
        let len = arrOfArrUsedRows[0].length
        let usedColumns = new Array(len).fill(false)
        // Modify the state of usedColumns based on the contents of the arrOfArrUsedRows
        arrOfArrUsedRows.forEach(arr => {
            arr.forEach((value,index)=>{
                if(!(value === null || value === "")){usedColumns[index] = true}
            });
        });
        // Remove all columns in arrofArrUsedRows with all null values
        arrOfArrUserInput = arrOfArrUsedRows.map(arr => {
            return arr.filter((value,index)=>usedColumns[index]);
        })
    } else {
        arrOfArrUserInput = [...arrOfArrUsedRows]
    }

    // Print to otuput area
    return(arrOfArrUserInput)
}

// FUNCTION to print data to fidumOutput (worksheetData)
// printWorksheetData

// FUNCTION to chage the order of the arr of Arr from rowwise to columnwise

// B) Event Listeners

// Print output data to output 
// TODO... summarize function based on type of data
document.getElementById("getHotData").addEventListener("click",function(){
    let hotDataArray = hot.getSourceDataArray()
    let prettyPrintArray = JSON.stringify(cleanHandosontableSourceData(hotDataArray),null,2) 
    let p = document.createElement("p");
    p.innerHTML = prettyPrintArray
    document.getElementById("output").appendChild(p)
    console.log(prettyPrintArray)
})