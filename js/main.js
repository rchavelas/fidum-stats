"use strict"
// Execute only when page has finished loading
//document.addEventListener('DOMContentLoaded', function() {

// Main functionalities of Fidum Online Statistical Software

// 0) App config
let defaultDecimalPlaces = 3;

// A) Helper functions
// A.1) Round decimal places (https://medium.com/swlh/how-to-round-to-a-certain-number-of-decimal-places-in-javascript-ed74c471c1b8)
const roundFn = function(number, decimalPlaces){
    if(number>=0){
        return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces)  
    } else {
        return -Number(Math.round(number*(-1) + "e" + decimalPlaces) + "e-" + decimalPlaces)
    }
}
// A.2) Convert json to html table
// Thks to https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm    
const tableFromJson = function(arrObj) {
    // testData
    // var arrObj = [
    //     { colName: "A", mean: 4.913, variance: 0.158 },
    //     { colName: "B", mean: 3.347, variance: 0.118 },
    //     { colName: "C", mean: 1.42, variance: 0.022 }]
    // tableFromJson(arrObj)
    
    // Create initial html
    var html = '<table class="outputTable">'
    
    // Create table and table header from key (tr/th)
    html += "<tr>"
    Object.keys(arrObj[0]).forEach(key => {html += '<th class="outputTableth">' + key + "</th>"})
    html += "</tr>"
    
    // Create contents of table (tr/td)
    arrObj.forEach(obj => {
        html += "<tr>";
        Object.values(obj).forEach(val => {html += '<td class="outputTableth">' + val + "</td>"})
        html += "</tr>"
    })

    // End table
    html += "</table>"
    return html  
}

// A.3) Function to update options from a select based on the type of column in handsonTable
// Pars: 
    // selectID-> id from a specific select tag in index.html
    // typeofColumn -> Type of column to extract information (numeric, factor or all)
const updateSelecOptions = function(selectID, typeofColumn){
    console.log("updating ID: " + selectID + " with options: " + typeofColumn)
    // Get info from handsonTable
    let hotDataArray = hot.getSourceDataArray();
    let hotHeadersArray = hot.getColHeader();
        // Prepare data for routine
    let cleanHotData = cleanHandosontableSourceData(hotDataArray,hotHeadersArray)
    let cleanHotDataColwise = columnWiseHandsontableCleanData(cleanHotData)
    // Filter columns based on type and return an array of column names
    let selectedCols = cleanHotDataColwise.map(col => col.colName)
    if(typeofColumn !== "all"){
        selectedCols = cleanHotDataColwise.filter(col => {
        return col.colType === typeofColumn
      }).map(col => col.colName)  
    } 
    // Empty all select options
    let selectedIdNode = document.getElementById(selectID)
    selectedIdNode.options.length = 0
    selectedCols.map(item => new Option(item,item)).forEach(child => selectedIdNode.appendChild(child))
    }

// B) Event Listeners
let outputDocumentID = document.getElementById("output")
// Print output data to output 
document.getElementById("printDataButton").addEventListener("click",function(){
    // Log operation
    console.log("Printing data")
    // Get data from Handsontable
    let hotDataArray = hot.getSourceDataArray();
    let hotHeadersArray = hot.getColHeader();
    // Print title and annotations in output region
    let p = document.createElement("p");
    p.innerHTML = `Printing data`
    p.classList.add("resultOutputTitle")
    outputDocumentID.appendChild(p)  
    // Prepare data to print
    let cleanHotData = cleanHandosontableSourceData(hotDataArray,hotHeadersArray)
    let cleanHotDataColwise = columnWiseHandsontableCleanData(cleanHotData)
    console.log(cleanHotDataColwise)
    let p2 = document.createElement("p");
    p2.innerHTML =  tableFromJson(cleanHotDataColwise);
    outputDocumentID.appendChild(p2)
    // Scroll to end of output region
    p2.scrollIntoView({behaviour:"smooth"});
})

// Descriptive statistics Routine
document.getElementById("getHotData").addEventListener("click",function(){
    // Log operation
    console.log("Printing descriptive statistics")
    // Print title and annotations in output region
    let p = document.createElement("p");
    p.innerHTML = `Descriptive Statistics`
    p.classList.add("resultOutputTitle")
    outputDocumentID.appendChild(p)  
    // Get data from Handsontable
    let hotDataArray = hot.getSourceDataArray();
    let hotHeadersArray = hot.getColHeader();
    // Prepare data for routine
    let cleanHotData = cleanHandosontableSourceData(hotDataArray,hotHeadersArray)
    let cleanHotDataColwise = columnWiseHandsontableCleanData(cleanHotData)
    // Get selected columns
    let selectedDescStatCols = document.getElementById("selectedColumnsDescStats")
    let selectedCols = [...selectedDescStatCols.selectedOptions].map(option => option.value)
    // Get selected stats
    let descStatsCheckboxObj = document.querySelectorAll('input[name="descStatsCheckbox"]:checked')
    let selectedStats =[]
    descStatsCheckboxObj.forEach(checkedBoxNode => selectedStats.push(checkedBoxNode.value))
    // Run descriptiveStatistics routine
    let desctStatsObjOutput = descriptiveStatistics(cleanHotDataColwise,selectedCols,selectedStats)
    // Append to output 
    let p2 = document.createElement("p");
    p2.innerHTML = tableFromJson(desctStatsObjOutput);
    outputDocumentID.appendChild(p2)
    // scroll to bottom 
    p2.scrollIntoView({behaviour:"smooth"});
});

//Run kmeans algorithm from kMeans.js and print it to Output
document.getElementById("computeKmeans").addEventListener("click",function(){
    // Log operation
    console.log("Runing kmeans")
    // Get input options
    let useNaiveShardingKmeans = false;
    if( document.getElementById("kMeansInitializacion").value === "kMeansNaiveShardingInit"){
        useNaiveShardingKmeans = true
        console.log("using naive sharding")
    }
    // Get data from Handsontable
    // Get data from Handsontable
    let hotDataArray = hot.getSourceDataArray();
    let hotHeadersArray = hot.getColHeader();
    let dataKm = cleanHandosontableSourceData(hotDataArray,hotHeadersArray).arrOfArr
    // Clean and validate data for kmeans algorithm
    // PENDING
    // Run kmeans algorithm
    let k = Number(document.getElementById("kMeansClusters").value)
    let result = kmeans(dataKm, k, useNaiveShardingKmeans)
    // Print title and annotations in output region
    let p = document.createElement("p");
    p.innerHTML = `Kmeans clustering with ${k} clusters`
    p.classList.add("resultOutputTitle")
    outputDocumentID.appendChild(p)  
    // Print result to output region
    result.clusters.forEach(cluster => {
        let clusterInfo = JSON.stringify(cluster.centroid,null,2) 
        let p = document.createElement("p");
        p.innerHTML = clusterInfo
        outputDocumentID.appendChild(p)
        // scroll to bottom
        p.scrollIntoView({behaviour:"smooth"});
    });
})

// C) Layout functinalities
// Update options from selects that rely on specific column type
document.getElementById("descriptiveStatsButton").addEventListener("click",
    () => {updateSelecOptions("selectedColumnsDescStats","numeric")})
// Popupu modal implementation
// SEE https://medium.com/@GistCoding/simple-popup-modal-with-vanilla-javascript-a14515ec630b
const modalTriggers = document.querySelectorAll('.popup-trigger')
const modalCloseTrigger = document.querySelector('.popup-modal__close')
const bodyBlackout = document.querySelector('.body-blackout')
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const { popupTrigger } = trigger.dataset
        const popupModal = document.querySelector(`[data-popup-modal="${popupTrigger}"]`)
        popupModal.classList.add('is--visible')
        bodyBlackout.classList.add('is-blacked-out')
        
        popupModal.querySelector('.popup-modal__close').addEventListener('click', () => {
            popupModal.classList.remove('is--visible')
            bodyBlackout.classList.remove('is-blacked-out')
        })
        
        popupModal.querySelector('.popup-modal__run').addEventListener('click', () => {
            popupModal.classList.remove('is--visible')
            bodyBlackout.classList.remove('is-blacked-out')
        })
        
    })
})

//}); // end of: DOMContentLoaded