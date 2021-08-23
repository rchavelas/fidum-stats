const container = document.getElementById("spreadsheet");

const settings = {
    contextMenu: true,
    startCols: 30,
    startRows: 70,
    colWidths: 75,
    height: "100%",
    width: "100%",
    rowHeaders: true,
    colHeaders: true,
    manualColumnResize: true,
    licenseKey: 'non-commercial-and-evaluation',
}

const hot = new Handsontable(container,settings);

