'use strict'

// Initialization of handsontable whitin APP
const container = document.getElementById("spreadsheet");

const settings = {
    contextMenu: true,
    startCols: 26,
    startRows: 100,
    colWidths: 75,
    height: "100%",
    width: "100%",
    rowHeaders: true,
    colHeaders: true,
    manualColumnResize: true,
    licenseKey: 'non-commercial-and-evaluation',
}

const hot = new Handsontable(container,settings);

// FUNCTION to clean handsontable GetSourceData() from hot API
// Returns an array of arrays with only the columns and rows with any value
const cleanHandosontableSourceData = function(arrOfArr, headersArray){
    // Clear empty rows
    let arrOfArrUsedRows = arrOfArr.filter(arr => {
        return !arr.every(value => (value === null || value === ""))
    })
    // Create placeholders for input and headers
    let arrOfArrUserInput;
    let arrOfUsedHeaders;
    // Clear emtpy cells
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
        // Remove headers that contain no data
        arrOfUsedHeaders = headersArray.filter((col,index) => usedColumns[index]);
        
    } else {
        arrOfArrUserInput = [...arrOfArrUsedRows]
        arrOfUsedHeaders = []
    }
    // Create placeholder to output data
    let userInput = {
        "headers": arrOfUsedHeaders,
        "arrOfArr": arrOfArrUserInput
    }
    // return clean data
    return(userInput)
}

// FUNCTION to validate contents of columns

// FUNCTION to change colheader 
const updateHOTColHeaders = function(currentColumnName,newColumnName){
    console.log("Changing column name") 
    let newHotColHeaders = [...hot.getColHeader()];
    // Validate if newColumnName already exists
    if(newHotColHeaders.indexOf(newColumnName)>=0){
        return "Column name already exists";
    } else {
        // Replace if currentColumnName exists
        let currentHeaderIndex = newHotColHeaders.indexOf(currentColumnName);
        // Deny if new value already exists
        if(currentHeaderIndex >= 0){
            let replacedColName = newHotColHeaders.splice(currentHeaderIndex,1,newColumnName)
            hot.updateSettings({colHeaders: newHotColHeaders});
            return `Replaced ${replacedColName} with ${newColumnName}`
        } else {
            return "Missing column";
        }
    }
}



// Fake data to bind for testing
// Array of rows
const testData = [
    ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
    ['2017', 10, 11, 12, 13, 15, 16],
    ['2018', 9, 11, 12, 13, 15, 16],
    ['2019', 8, 11, 12, 13, 15, 16],
    ['2020', 7, 11, 12, 13, 15, 16],
    ['2021', 6, 11, 12, 13, 15, 16]
];

const testData2 = [[1,1,1],[1,2,1],[-1,-1,-1.5],[-1,-1,-1.5]]

// Input data to hot
let testDataOutput = [...testData2]
for (let row = 0; row < testDataOutput.length; row++) {
    for (let column = 0; column < testDataOutput[row].length; column++) {
        hot.setDataAtCell(row, column, testDataOutput[row][column]);
    }
}