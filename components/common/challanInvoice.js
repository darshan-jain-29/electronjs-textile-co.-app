const PDFDocument = require("pdfkit");
var invoiceTableTop = 50;
var spaceFromTop = 0;
var dir = "";

function createChallan(invoice) {
    invoiceTableTop = 50;
    spaceFromTop = 50;
    dir = "";

    let doc = new PDFDocument({ size: [576, 768], margin: 20 });

    generateCompanyNameHeader(doc, invoice);
    generateHeader(doc, invoice);
    generateTableHeadings(doc, invoice);
    generateTableLineItems(doc, invoice);
    generateSignFooter(doc);

    doc.end();
    savePDfToFolder(doc, invoice);
}

function generateCompanyNameHeader(doc, invoice) {
    //print company name
    doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .text(
            invoice.companyName,
            15,
            spaceFromTop,
            { align: "center", width: 546 }
        );

    spaceFromTop += 25;
    //print company address
    doc.fontSize(14).font('Helvetica');
    adjustLength(doc, invoice.godownAddress, 15, spaceFromTop, 546, "center", "13.5");

    spaceFromTop += 30;
    generateHr(doc, spaceFromTop);
}

function generateHeader(doc, invoice) {
    spaceFromTop += 7;
    //Print DocType
    doc.font('Helvetica-Bold')
        .fontSize(15)
        .text(invoice.docType, 15, spaceFromTop, { align: "center" });

    //print dividing line
    spaceFromTop += 18
    generateHr(doc, spaceFromTop);
    spaceFromTop += 2;

    console.log(spaceFromTop);
    var fromLeft = 25;
    var fromTop = 135;

    //Print Invoice No. 
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.invoiceType + ":", fromLeft, fromTop)
        .font('Helvetica')
        .fontSize(14)
        .text(invoice.billNo, fromLeft, fromTop + 15);

    //Print Invoice Date
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.dateType + ":", fromLeft, fromTop + 5 + 15 * 2)
        .font('Helvetica')
        .fontSize(14)
        .text(invoice.billDate, fromLeft, fromTop + 5 + 15 * 3);

    //Print Buyer Details, each line 25 chars
    var cIEL = 23; //Chars In Each Line
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.party1Type + ":", fromLeft + 85, fromTop);
    adjustLength(doc, invoice.partyName1.toProperCase(), fromLeft + 85, fromTop + 15, cIEL, "", "13.5");
    if (invoice.partyAddress1.length > 0) {
        if (invoice.partyName1.length <= cIEL * 2)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 85, fromTop + 7 + 15 * 2, cIEL, "", "13.5");
        else if (invoice.partyName1.length <= cIEL * 3)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 85, fromTop + 7 + 15 * 3, cIEL, "", "13.5");
        else if (invoice.partyName1.length > cIEL * 3)
            adjustLength(doc, invoice.partyAddress1.toProperCase(), fromLeft + 85, fromTop + 7 + 15 * 4, cIEL, "", "13.5");
    }

    //Print Seller Details, each line 25 chars
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.partyType2 + ":", fromLeft + 255, fromTop);
    adjustLength(doc, invoice.partyName2.toProperCase(), fromLeft + 255, fromTop + 15, cIEL, "", "13.5");

    if (invoice.partyAddress2.length > 0) {
        if (invoice.partyName2.length <= cIEL * 2)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 255, fromTop + 7 + 15 * 2, cIEL, "", "13.5");
        else if (invoice.partyName2.length <= cIEL * 3)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 255, fromTop + 7 + 15 * 3, cIEL, "", "13.5");
        else if (invoice.partyName2.length > cIEL * 3)
            adjustLength(doc, invoice.partyAddress2.toProperCase(), fromLeft + 255, fromTop + 7 + 15 * 4, cIEL, "", "13.5");
    }

    //Print Broker Details, each line 14 chars
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text("Broker:", fromLeft + 420, fromTop);
    adjustLength(doc, invoice.brokerName.toProperCase(), fromLeft + 420, fromTop + 15, 16, "", "13.5");

    //Print Haste
    doc
        .font('Helvetica-Bold')
        .fontSize(13)
        .text(invoice.miscType + ":", fromLeft + 420, fromTop + 7 + 15 * 3)
        .font('Helvetica')
        .fontSize(14)
        .text(invoice.miscValue, fromLeft + 420, fromTop + 7 + 15 * 4);

}

function generateTableHeadings(doc, invoice) {
    generateHr(doc, 240);

    doc.font("Helvetica-Bold");
    doc
        .fontSize(13)
        .text(invoice.tableUpperHeading, 15, 245, { align: 'center' });

    generateHr(doc, 260);
    spaceFromTop = 270;

    // doc.font("Helvetica-Bold");

    generateTableRowStyle2(
        doc,
        spaceFromTop,
        'Sr. No',
        invoice.tableHeadings.heading1,
        invoice.tableHeadings.heading2,
        // invoice.tableHeadings.heading3,
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
        // console.log(item)
        spaceFromTop += 18;
        addNewPageCondition(doc);

        generateTableRowStyle2(
            doc,
            spaceFromTop,
            i + 1,
            item.qualityName,
            item.sc,
            // item.condition,
            item.rolls,
            item.qty
        );
    }

    spaceFromTop += 18;
    addNewPageCondition(doc);
    generateHr(doc, spaceFromTop);

    spaceFromTop += 8;
    addNewPageCondition(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2(
        doc,
        spaceFromTop,
        "",
        // "",
        "",
        "Total:",
        invoice.totalRolls,
        invoice.totalQty,
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
        .fontSize(14)
        .text(
            "Date:",
            15,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
    addNewPageCondition(doc);
    doc
        .fontSize(14)
        .text(
            "Authorised Sign:",
            15,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
    addNewPageCondition(doc);
    generateHr(doc, spaceFromTop);
}

function generateTableRowStyle2(
    doc,
    y,
    sr,
    heading1,
    heading2,
    heading4,
    heading5
) {
    doc
        .fontSize(13)
        .text(sr, 15, y, { width: 40, align: "center" })
        .text(heading1, 55, y, { width: 205, align: "center" })
        .text(heading2, 260, y, { width: 110, align: "center" })
        // .text(heading3, 370, y, { width: 50, align: "center" })
        .text(heading4, 370, y, { width: 100, align: "center" })
        .text(heading5, 470, y, { width: 56, align: "center" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(15, y)
        .lineTo(546, y)
        .stroke()
        .moveDown();
}

module.exports = {
    createChallan
};

function adjustLength(doc, pName, startX, startY, increment, alignPosition, size) {
    var tempPName = [];
    var j = 0;
    // console.log(pName.length)
    for (var i = 0; i < pName.length; i += increment) {
        if (pName.charAt(i + increment) == '' || pName.charAt(i + increment) == " ")
            tempPName[j] = pName.substring(i, i + increment);
        else tempPName[j] = pName.substring(i, i + increment) + "-";
        doc
            .font('Helvetica')
            .fontSize(size)
            .text(tempPName[j], startX, startY,
                { align: alignPosition });
        if (size == "13.5") startY += 15;
        else startY += 12;

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