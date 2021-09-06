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
const tableFromJson = function(jsonObj) {
        // Extract value from table header. 
        let col = [];
        for (let i = 0; i < jsonObj.length; i++) {
            for (let key in jsonObj[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // Create a table.
        let table = document.createElement("table");

        // Create table header row using the extracted headers above.
        let tr = table.insertRow(-1);                   // table row.

        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");      // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (let i = 0; i < jsonObj.length; i++) {
            tr = table.insertRow(-1);
            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = jsonObj[i][col[j]];
            }
        }

        // Now, add the newly created table with json data, to a container.
  return table
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
    let prettyPrintArray = JSON.stringify(cleanHotDataColwise,null,2)  
    let p2 = document.createElement("p");
    p2.innerHTML = prettyPrintArray
    outputDocumentID.appendChild(p2)
    p2.scrollIntoView({behaviour:"smooth"});
})

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
    var selectedDescStatCols = document.getElementById("selectedColumnsDescStats")
    let selectedCols = [...selectedDescStatCols.selectedOptions].map(option => option.value)
    // Get selected stats
    let descStatsCheckboxObj = document.querySelectorAll('input[name="descStatsCheckbox"]:checked')
    let selectedStats =[]
    descStatsCheckboxObj.forEach(checkedBoxNode => selectedStats.push(checkedBoxNode.value))
    // Run descriptiveStatistics routine
    let desctStatsObjOutput = descriptiveStatistics(cleanHotDataColwise,selectedCols,selectedStats)
    // Append to output 
    let p2 = document.createElement("p");
    console.log(tableFromJson(desctStatsObjOutput))
    p2.innerHTML = ""
    p2.appendChild(tableFromJson(desctStatsObjOutput))
    outputDocumentID.appendChild(p2)
    // scroll to bottom 
    p2.scrollIntoView({behaviour:"smooth"});
});

// Descriptive statistics Routine

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