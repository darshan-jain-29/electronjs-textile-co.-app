const PDFDocument = require("pdfkit");
var invoiceTableTop = 50;
var spaceFromTop = 0;
var dir = "";
var cQuality, cShade, cColor, cCondition, cLotNo = '';
var cRolls, cQuantity = 0;

function createStockPrint(invoice) {
    invoiceTableTop = 50;
    spaceFromTop = 0;
    dir = "";

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc, invoice);
    generateTableHeadings(doc, invoice);
    generateTableLineItems(doc, invoice);
    //generateFooter(doc, invoice);

    doc.end();

    savePDfToFolder(doc, invoice);

}

function generateHeader(doc, invoice) {
    spaceFromTop += 25;
    //print company name
    doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(
            invoice.companyName,
            50,
            spaceFromTop,
            { align: "center", width: 500 }
        );

    spaceFromTop += 20;

    doc
        .fontSize(12)
        .text(invoice.tableUpperHeading, 55, 40, { align: 'center' });
    generateHr(doc, 60);
}

function generateTableHeadings(doc, invoice) {
    spaceFromTop = 65;

    doc.font("Helvetica-Bold");

    generateTableRowStyle2(
        doc,
        spaceFromTop,
        invoice.tableHeadings.heading1,
        invoice.tableHeadings.heading2,
        invoice.tableHeadings.heading3,
        invoice.tableHeadings.heading4,
        invoice.tableHeadings.heading5,
        invoice.tableHeadings.heading6,
        invoice.tableHeadings.heading7
    );
    generateHr(doc, spaceFromTop + 17);
    doc.font("Helvetica");
    spaceFromTop += 17;
    // console.log(doc.page.height, spaceFromTop);
}

function generateTableLineItems(doc, invoice) {
    let i;

    var tRollTotal = 0;
    var tQtyTotal = 0;

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        var dam = item.isDamage.toUpperCase() == "TRUE" ? "D" : "F";

        if (i == 0) {
            cQuality = item.qualityName;
            cShade = item.shade;
            cColor = item.color;
            cCondition = dam;
            // cLotNo = results[i].lotNo;
            tRollTotal = parseInt(1);
            tQtyTotal = parseFloat(item.qty).toFixed(2);
        }


        if (i != 0 && (cQuality != item.qualityName || cShade != item.shade
            || cColor != item.color || cCondition != dam)) {
            spaceFromTop += 12;
            addNewPageCondition(doc);
            generateHr(doc, spaceFromTop);

            spaceFromTop += 6;
            addNewPageCondition(doc);
            generateTableRowStyle2(
                doc,
                spaceFromTop,
                '',
                '',
                '',
                '',
                'TOTAL',
                tRollTotal,
                tQtyTotal
            );
            tRollTotal = tQtyTotal = 0;
            spaceFromTop += 16;
            addNewPageCondition(doc);
            generateHr(doc, spaceFromTop);
        }

        spaceFromTop += 12;
        addNewPageCondition(doc);

        generateTableRowStyle2(
            doc,
            spaceFromTop,
            item.qualityName,
            item.shade,
            item.color,
            dam,
            item.lotNo,
            item.rollsSeries,
            item.qty
        );

        cQuality = item.qualityName;
        cShade = item.shade;
        cColor = item.color;
        cCondition = dam;

        tRollTotal = parseInt(tRollTotal) + parseInt(1);
        tQtyTotal = parseFloat((parseFloat(tQtyTotal) + parseFloat(item.qty))).toFixed(2);

        if (i == invoice.items.length - 1) {
            spaceFromTop += 12;
            addNewPageCondition(doc);
            generateHr(doc, spaceFromTop);

            spaceFromTop += 6;
            addNewPageCondition(doc);
            generateTableRowStyle2(
                doc,
                spaceFromTop,
                '',
                '',
                '',
                '',
                'TOTAL',
                tRollTotal,
                tQtyTotal
            );
            tRollTotal = tQtyTotal = 0;
            spaceFromTop += 16;
            addNewPageCondition(doc);
            generateHr(doc, spaceFromTop);
        }
    }

    spaceFromTop += 8;

    // spaceFromTop += 7;
    addNewPageCondition(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2(
        doc,
        spaceFromTop,
        "",
        "",
        "",
        "",
        "Grand Total",
        invoice.totalRolls,
        invoice.totalQty,
    );

    doc.font("Helvetica");
    spaceFromTop += 25;
    addNewPageCondition(doc);
    generateHr(doc, spaceFromTop);
}


function generateFooter(doc, invoice) {
    spaceFromTop += 12;
    addNewPageCondition(doc);

    //print company name
    doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(
            invoice.companyName,
            50,
            spaceFromTop,
            { align: "center", width: 500 }
        );

    spaceFromTop += 15;
    addNewPageCondition(doc);
    //print company address
    doc.fontSize(10).font('Helvetica');
    adjustLength(doc, invoice.companyAddress, 50, spaceFromTop, 300, "center");
}

function generateTableRowStyle2(
    doc,
    y,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    heading6,
    heading7
) {
    doc
        .fontSize(10)
        .text(heading1, 30, y, { width: 170, align: "center" })
        .text(heading2, 200, y, { width: 60, align: "center" })
        .text(heading3, 260, y, { width: 40, align: "center" })
        .text(heading4, 300, y, { width: 40, align: "center" })
        .text(heading5, 340, y, { width: 50, align: "center" })
        .text(heading6, 390, y, { width: 90, align: "center" })
        .text(heading7, 480, y, { width: 80, align: "center" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke()
        .moveDown();
}

module.exports = {
    createStockPrint
};

function adjustLength(doc, pName, startX, startY, increment, alignPosition) {
    var tempPName = [];
    var j = 0;
    // console.log(pName.length)
    for (var i = 0; i < pName.length; i += increment) {
        if (pName.charAt(i + increment) == '' || pName.charAt(i + increment) == " ")
            tempPName[j] = pName.substring(i, i + increment);
        else tempPName[j] = pName.substring(i, i + increment) + "-";
        doc
            .font('Helvetica')
            .fontSize(10)
            .text(tempPName[j], startX, startY,
                { align: alignPosition });
        startY += 12;
        j++;
    }
    //console.log(startY, "starty");
    // console.log(tempPName);
}

function addNewPageCondition(doc) {
    if (spaceFromTop > 770) {
        doc.addPage();
        spaceFromTop = 50;
    }
}

function savePDfToFolder(doc, invoice) {
    var fileDestination = "C:\\Kalash Invoices\\";
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    fileDestination += "\\" + invoice.folderName;
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getFullYear() + " - "
        + currentdate.getHours() + "."
        + currentdate.getMinutes() + "."
        + currentdate.getSeconds();
    var fileName = datetime + " - " + "STOCK DETAILS" + ".pdf"

    fileDestination += "\\" + fileName;
    // to save the invoice as pdf
    var savePdf = fs.createWriteStream(fileDestination);
    doc.pipe(savePdf);

    savePdf.on('finish', function () {
        //console.log(fileDestination)
        alert('File saved to ' + fileDestination);
        //openPdf(path); //top open the pdf
    });
}

function printPdf(doc) {
    var objFra = document.createElement('iframe');   // Create an IFrame.
    objFra.style.visibility = "hidden";    // Hide the frame.
    objFra.src = doc;                      // Set source.
    document.body.appendChild(objFra);  // Add the frame to the web page.
    objFra.contentWindow.focus();       // Set focus.
    objFra.contentWindow.print();      // Print it.
}

function openPdf(src) {
    console.log(src, __dirname)

    const win = new PDFWindow({
        width: 800,
        height: 600
    })

    //     win.loadURL('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')

    win.loadURL('E:/Work/Desktopapps/Khimesara Silk Mills/test/August 19/components/yarnpurchase/po/newPO/invoce.pdf')
}