'use strict'

// Initialization of handsontable whitin APP
const container = document.getElementById("spreadsheet");

const settings = {
    contextMenu: true,
    startCols: 26,
    startRows: 150,
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

// FUNCTION to change structure of cleanHandosontableSourceData() for column-wise algorithms
const columnWiseHandsontableCleanData = function(cleanHotData){
    // Define initial params
    let cleanHotDataArr = [...cleanHotData.arrOfArr];
    let cleanHotDataColArr = [];
    let objArr;
    let rows = cleanHotDataArr.length;
    let cols = cleanHotDataArr[0].length;
    // Change  arrOfArr row-wise to columnwise
    for (let i = 0; i < cols; i++) {
        objArr = new Array(rows);
        for (let j = 0; j < rows; j++){objArr[j] = cleanHotDataArr[j][i];}
        cleanHotDataColArr.push(objArr);
    }
    // Define object for column-wise applications
    let cleanHotDataHeaders = [...cleanHotData.headers];
    let cleanHotDataCol = [];
    for(let col = 0; col < cleanHotDataHeaders.length; col++){
        let colObj = {
            "colName": cleanHotDataHeaders[col],
            "colType": undefined,
            "colArr" : cleanHotDataColArr[col]
        };
        cleanHotDataCol.push(colObj)
    };
    // Return an object for columnwise applications 
    return cleanHotDataCol;
}

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
const testData1 = [
    ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
    ['2017', 10, 11, 12, 13, 15, 16],
    ['2018', 9, 11, 12, 13, 15, 16],
    ['2019', 8, 11, 12, 13, 15, 16],
    ['2020', 7, 11, 12, 13, 15, 16],
    ['2021', 6, 11, 12, 13, 15, 16]
];

const testData2 = [[1,1,1],[1,2,1],[-1,-1,-1.5],[-1,-1,-1.5]]

const testData3 = [[5.1, 3.5, 1.4, 0.2, 'setosa'],
[4.9, 3, 1.4, 0.2, 'setosa'],
[4.7, 3.2, 1.3, 0.2, 'setosa'],
[4.6, 3.1, 1.5, 0.2, 'setosa'],
[5, 3.6, 1.4, 0.2, 'setosa'],
[5.4, 3.9, 1.7, 0.4, 'setosa'],
[4.6, 3.4, 1.4, 0.3, 'setosa'],
[5, 3.4, 1.5, 0.2, 'setosa'],
[4.4, 2.9, 1.4, 0.2, 'setosa'],
[4.9, 3.1, 1.5, 0.1, 'setosa'],
[5.4, 3.7, 1.5, 0.2, 'setosa'],
[4.8, 3.4, 1.6, 0.2, 'setosa'],
[4.8, 3, 1.4, 0.1, 'setosa'],
[4.3, 3, 1.1, 0.1, 'setosa'],
[5.8, 4, 1.2, 0.2, 'setosa']];

// Input data to hot
const inputTestData = function(dataset){
    let testDataOutput = [...testData3]
    for (let row = 0; row < testDataOutput.length; row++) {
        for (let column = 0; column < testDataOutput[row].length; column++) {
            hot.setDataAtCell(row, column, testDataOutput[row][column]);
        }
    }
}
inputTestData(testData3)
// updateHOTColHeaders("A","s_length")
// updateHOTColHeaders("B","s_width")
// updateHOTColHeaders("C","p_length")
// updateHOTColHeaders("D","p_width")
// updateHOTColHeaders("E","class")