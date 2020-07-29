const PDFDocument = require("pdfkit");
var invoiceTableTop = 50;
var spaceFromTop = 0;
var dir = "";

function createInvoice(invoice) {
    invoiceTableTop = 50;
    spaceFromTop = 0;
    dir = "";

    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc, invoice);
    generateTableHeadings(doc, invoice);
    generateTableLineItems(doc, invoice);
    generateSignFooter(doc);
    generateFooter(doc, invoice);

    doc.end();

    savePDfToFolder(doc, invoice);

}

function generateHeader(doc, invoice) {
    //Print DocType
    doc.font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.docType, { align: "center" });

    //print dividing line
    invoiceTableTop += 15
    generateHr(doc, invoiceTableTop);
    invoiceTableTop += 2;

    var fromLeft = 50;
    var fromTop = 73;

    //Print Invoice No. 
    doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(invoice.invoiceType + ":", fromLeft, fromTop)
        .font('Helvetica')
        .fontSize(10)
        .text(invoice.billNo, fromLeft, fromTop + 12);

    //Print Invoice Date
    doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(invoice.dateType + ":", fromLeft, fromTop + 3 + 12 * 2)
        .font('Helvetica')
        .fontSize(10)
        .text(invoice.billDate, fromLeft, fromTop + 3 + 12 * 3);

    //Print Buyer Details, each line 25 chars
    var cIEL = 28; //Chars In Each Line
    doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(invoice.party1Type + ":", fromLeft + 80, fromTop);
    adjustLength(doc, invoice.partyName1.toProperCase(), fromLeft + 80, fromTop + 12, cIEL, "");
    if (invoice.partyAddress1.length > 0) {
        if (invoice.partyName1.length <= cIEL * 2)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 80, fromTop + 12 * 3, cIEL, "");
        else if (invoice.partyName1.length <= cIEL * 3)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 80, fromTop + 12 * 4, cIEL, "");
        else if (invoice.partyName1.length > cIEL * 3)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 80, fromTop + 12 * 5, cIEL, "");
    }

    //Print Seller Details, each line 25 chars
    doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(invoice.partyType2 + ":", fromLeft + 240, fromTop);
    adjustLength(doc, invoice.partyName2.toProperCase(), fromLeft + 240, fromTop + 12, cIEL, "");
    if (invoice.partyAddress2.length > 0) {
        if (invoice.partyName2.length <= cIEL * 2)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 240, fromTop + 12 * 3, cIEL, "");
        else if (invoice.partyName2.length <= cIEL * 3)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 240, fromTop + 12 * 4, cIEL, "");
        else if (invoice.partyName2.length > cIEL * 3)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 240, fromTop + 12 * 5, cIEL, "");
    }

    //Print Broker Details, each line 14 chars
    doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .text("Broker:", fromLeft + 400, fromTop);
    adjustLength(doc, invoice.brokerName.toProperCase(), fromLeft + 400, fromTop + 12, 16, "");

}

function generateTableHeadings(doc, invoice) {
    // generateHr(doc, 160);

    doc
        .fontSize(12)
        .text("Order Details", 40, 163, { align: 'center' });

    generateHr(doc, 176);
    spaceFromTop = 180;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        spaceFromTop,
        'Sr. No',
        invoice.tableHeadings.heading1,
        invoice.tableHeadings.heading2,
        invoice.tableHeadings.heading3,
        invoice.tableHeadings.heading4,
        invoice.tableHeadings.heading5
    );
    generateHr(doc, spaceFromTop + 17);
    doc.font("Helvetica");
    spaceFromTop += 17;
    console.log(doc.page.height, spaceFromTop);
}

function generateTableLineItems(doc, invoice) {
    let i;

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        spaceFromTop += 12;
        addNewPageCondition(doc);
        generateTableRow(
            doc,
            spaceFromTop,
            i + 1,
            item.qualityName,
            item.rolls,
            item.qty,
            item.rpm,
            (parseFloat(item.qty) * parseFloat(item.rpm)).toFixed(2)
        );
    }

    spaceFromTop += 15;
    addNewPageCondition(doc);
    generateHr(doc, spaceFromTop);

    spaceFromTop += 7;
    addNewPageCondition(doc);
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        spaceFromTop,
        "",
        "Total",
        invoice.totalRolls,
        invoice.totalQty,
        "",
        invoice.totalAmount,
    );

    doc.font("Helvetica");
    spaceFromTop += 15;
    addNewPageCondition(doc);
    generateHr(doc, spaceFromTop);
}

function generateSignFooter(doc) {
    spaceFromTop += 15;
    addNewPageCondition(doc);

    addNewPageCondition(doc);
    doc
        .fontSize(10)
        .text(
            "Date:",
            50,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
    addNewPageCondition(doc);
    doc
        .fontSize(10)
        .text(
            "Authorised Sign:",
            50,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
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

function generateTableRow(
    doc,
    y,
    sr,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5
) {
    doc
        .fontSize(10)
        .text(sr, 50, y, { width: 30, align: "center" })
        .text(heading1, 80, y, { width: 240, align: "center" })
        .text(heading2, 320, y, { width: 50, align: "center" })
        .text(heading3, 370, y, { width: 50, align: "center" })
        .text(heading4, 420, y, { width: 50, align: "center" })
        .text(heading5, 470, y, { width: 80, align: "center" });
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
    createInvoice
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

    var fileName = invoice.billNo + " - " + invoice.partyName1 + " - " + invoice.billDate + ".pdf"

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