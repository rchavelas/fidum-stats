const container = document.getElementById("spreadsheet");

const settings = {
    startCols: 50,
    startRows: 200,
    colWidths: 75,
    height: "100%",
    width: "100%",
    rowHeaders: true,
    colHeaders: true,
    licenseKey: 'non-commercial-and-evaluation',
}

const hot = new Handsontable(container,settings);

