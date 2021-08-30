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
let outputDocumentID = document.getElementById("output")
// Print output data to output 
// TODO... summarize function based on type of data
document.getElementById("getHotData").addEventListener("click",function(){
    // Log operation
    console.log("Printing data")
    // Get data from Handsontable
    let hotDataArray = hot.getSourceDataArray()
    // Print title and annotations in output region
    let p = document.createElement("p");
    p.innerHTML = `Printing data`
    p.classList.add("resultOutputTitle")
    outputDocumentID.appendChild(p)  
    // Prepare data to print
    let prettyPrintArray = JSON.stringify(cleanHandosontableSourceData(hotDataArray),null,2) 
    let p2 = document.createElement("p");
    p2.innerHTML = prettyPrintArray
    outputDocumentID.appendChild(p2)
    // scroll to bottom
    p2.scrollIntoView({behaviour:"smooth"});
})

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
    let dataKm = cleanHandosontableSourceData(hot.getSourceDataArray())
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