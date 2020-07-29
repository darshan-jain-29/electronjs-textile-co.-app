// const PDFDocument = require("pdfkit");
var invoiceTableTop = 50;
var spaceFromTop = 0;
var dir = "";

function createInvoice(invoice) {
    invoiceTableTop = 50;
    spaceFromTop = 50;
    dir = "";

    let doc = new PDFDocument({ size: [576, 768], margin: 20 });

    generateCompanyNameHeaderInvoice(doc, invoice);
    generateHeaderInvoice(doc, invoice);
    generateTableHeadingsInvoice(doc, invoice);
    generateTableLineItemsInvoice(doc, invoice);
    generateDisclaimer(doc);
    generateSignFooterInvoice(doc, invoice);

    doc.end();

    savePDfToFolderInvoice(doc, invoice);

}

function generateCompanyNameHeaderInvoice(doc, invoice) {
    //print company name
    doc
        .font('Helvetica-Bold')
        .fontSize(17)
        .text(
            invoice.companyName,
            15,
            spaceFromTop,
            { align: "center", width: 546 }
        );

    spaceFromTop += 23;
    //print company address
    doc.fontSize(10.5).font('Helvetica');
    adjustLengthInvoice(doc, invoice.companyAddress, 15, spaceFromTop, 546, "center", "10.5");

    spaceFromTop += 15;
    generateHrInvoice(doc, spaceFromTop);
}

function generateHeaderInvoice(doc, invoice) {
    spaceFromTop += 7;
    //Print DocType
    doc.font('Helvetica-Bold')
        .fontSize(15)
        .text("INVOICE", 15, spaceFromTop, { align: "center" });

    //print dividing line
    spaceFromTop += 18
    generateHrInvoice(doc, spaceFromTop);
    spaceFromTop += 2;

    // console.log(spaceFromTop);
    var fromLeft = 25;
    var fromTop = 125;

    //Print Buyer Details, each line 25 chars
    var cIEL = 25; //Chars In Each Line
    doc
        .font('Helvetica-Bold')
        .fontSize(12.5)
        .text(invoice.partyName1.toProperCase(), fromLeft, fromTop);
    //adjustLengthInvoice(doc, invoice.partyName1.toProperCase(), fromLeft, fromTop + 15, cIEL, "", "11.0");
    if (invoice.partyAddress1.length > 0) {
        if (invoice.partyName1.length <= cIEL * 2)
            adjustLengthInvoice(doc, invoice.partyAddress1.toProperCase(), fromLeft, fromTop + 7 + 15 * 1, cIEL, "", "11.0");
        else if (invoice.partyName1.length <= cIEL * 3)
            adjustLengthInvoice(doc, invoice.partyAddress1.toProperCase(), fromLeft, fromTop + 7 + 15 * 2, cIEL, "", "11.0");
        else if (invoice.partyName1.length > cIEL * 3)
            adjustLengthInvoice(doc, invoice.partyAddress1.toProperCase(), fromLeft, fromTop + 7 + 15 * 3, cIEL, "", "11.0");
    }

    //Print Buyer GST No. 
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("GST No:", fromLeft, fromTop + 10 + 15 * 5)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.party1Gst, fromLeft + 50, fromTop + 10 + 15 * 5);

    //Print Bill No. 
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text(invoice.invoiceType + ":", fromLeft + 180, fromTop)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.billNo, fromLeft + 245, fromTop);

    var tempO = invoice.billNo.split("-")
    //Print Order No. 
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("Order No" + ":", fromLeft + 180, fromTop + 7 + 15)
        .font('Helvetica')
        .fontSize(11)
        .text(tempO[0].trim(), fromLeft + 245, fromTop + 7 + 15);

    //Print Dispatch Date
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text(invoice.dateType + ":", fromLeft + 180, fromTop + 7 + 15 * 2)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.billDate, fromLeft + 245, fromTop + 7 + 15 * 2);

    //Print L.R. No
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("L.R. No." + ":", fromLeft + 180, fromTop + 7 + 15 * 3)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.lrNo, fromLeft + 245, fromTop + 7 + 15 * 3);

    //Print Transport
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("Transport" + ":", fromLeft + 180, fromTop + 7 + 15 * 4)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.transportName.toProperCase(), fromLeft + 245, fromTop + 7 + 15 * 4);


    //Print Broker Details, each line 14 chars
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("Broker:", fromLeft + 400, fromTop);
    adjustLengthInvoice(doc, invoice.brokerName.toProperCase(), fromLeft + 400, fromTop + 15, 18, "", "11");

    //Print Haste
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text(invoice.miscType + ":", fromLeft + 400, fromTop + 7 + 15 * 3)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.miscValue, fromLeft + 400, fromTop + 7 + 15 * 4);

    generateHrInvoice(doc, 225);

    //Print Shipping Address 
    doc
        .font('Helvetica-Bold')
        .fontSize(11.5)
        .text("Shipped To:", fromLeft, fromTop + 16 + 15 * 6);
    adjustLengthInvoice(doc, invoice.partyAddress2.toProperCase(), fromLeft + 70, fromTop + 16 + 15 * 6, 40, "", "11");

}

function generateTableHeadingsInvoice(doc, invoice) {
    generateHrInvoice(doc, 275);

    doc.font("Helvetica-Bold");
    doc
        .fontSize(11.5)
        .text("INVOICE DETAILS", 15, 285, { align: 'center' });

    generateHrInvoice(doc, 300);
    spaceFromTop = 310;

    // doc.font("Helvetica-Bold");

    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        'Sr. No',
        invoice.tableHeadings.heading1,
        invoice.tableHeadings.heading2,
        "HSN No.",
        invoice.tableHeadings.heading4,
        invoice.tableHeadings.heading5,
        invoice.tableHeadings.heading6,
        invoice.tableHeadings.heading7
    );
    generateHrInvoice(doc, spaceFromTop + 17);
    doc.font("Helvetica");
    spaceFromTop += 17;
    console.log(doc.page.height, spaceFromTop);
}

function generateTableLineItemsInvoice(doc, invoice) {
    let i;

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        // console.log(item, i);
        spaceFromTop += 18;
        addNewPageConditionInvoice(doc);
        generateTableRowStyle2Invoice(
            doc,
            spaceFromTop,
            i + 1,
            item.qualityName,
            item.sc,
            '5208',
            item.rolls,
            item.qty,
            item.rate,//"200.00", //
            item.value//"5000.00" //
        );
    }

    spaceFromTop += 18;
    addNewPageConditionInvoice(doc);
    generateHrInvoice(doc, spaceFromTop);

    spaceFromTop += 8;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        "Total:",
        "",
        "",
        invoice.totalRolls,
        invoice.totalQty,
        "",
        invoice.totalAmount,
    );

    //IGST
    spaceFromTop += 16;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        " ",
        "",
        "",
        "",
        "ISGT @",
        invoice.igstRate,
        invoice.igst
    );

    //CGST
    spaceFromTop += 16;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        " ",
        "",
        "",
        "",
        "CSGT @",
        invoice.cgstRate,
        invoice.cgst
    );

    //SGST
    spaceFromTop += 16;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        " ",
        "",
        "",
        "",
        "SSGT @",
        invoice.sgstRate,
        invoice.sgst
    );

    //RoundOff
    spaceFromTop += 16;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        " ",
        "",
        "",
        "",
        "",
        "Round Off",
        invoice.roundOff
    );

    //Net Amount Seperation Line
    doc.font("Helvetica");
    spaceFromTop += 15;
    addNewPageConditionInvoice(doc);
    generateHrInvoice(doc, spaceFromTop);

    //Net Amount
    spaceFromTop += 6;
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold");
    generateTableRowStyle2Invoice(
        doc,
        spaceFromTop,
        "",
        " ",
        "",
        "",
        "",
        "",
        "Net Amt",
        invoice.netAmount
    );

    doc.font("Helvetica");
    spaceFromTop += 15;
    addNewPageConditionInvoice(doc);
    generateHrInvoice(doc, spaceFromTop);
}

function generateDisclaimer(doc) {
    spaceFromTop += 7;
    addNewPageConditionInvoice(doc);
    doc
        .fontSize(11)
        .text(
            "Issue D.D./Cheque in favour of Khimesara Silk Mills Pvt . Ltd. in our A/C No. 026105008275, ICICI Bank, Zaveri Bazar Branch. IFCI Code : ICIC0000261. Note : ALL PAYMENTS MUST BE BY ACCOUNT PAYEE CHEQUE / DRAFT ONLY. We will not accept claim of any nature whatsoever if fabric is converted into garments.",
            10,
            spaceFromTop,
            { align: "center", width: 540 }
        );

    spaceFromTop += 55;
    generateHrInvoice(doc, spaceFromTop);
}

function generateSignFooterInvoice(doc, invoice) {
    spaceFromTop += 12;

    //For Company Name
    addNewPageConditionInvoice(doc);
    doc.font("Helvetica-Bold")
        .fontSize(10.5)
        .text(
            "For Khimesara Silk Mills Pvt. Ltd.",
            15,
            spaceFromTop,
            { align: "right", width: 530 }
        );

    spaceFromTop += 20;
    addNewPageConditionInvoice(doc);

    //Company GST and Date
    doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text("GSTin No. :", 15, spaceFromTop)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.companyGST, 15 + 70, spaceFromTop);

    doc
        .fontSize(11)
        .text(
            "Date:",
            15,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
    addNewPageConditionInvoice(doc);
    // Company PAN & Sign
    doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text("PAN No. :", 15, spaceFromTop)
        .font('Helvetica')
        .fontSize(11)
        .text(invoice.companyPAN, 15 + 70, spaceFromTop);

    doc
        .fontSize(11)
        .text(
            "Authorised Sign:",
            15,
            spaceFromTop,
            { align: "right", width: 400 }
        );

    spaceFromTop += 24;
    addNewPageConditionInvoice(doc);
    generateHrInvoice(doc, spaceFromTop);
}

function generateTableRowStyle2Invoice(
    doc,
    y,
    sr,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    heading6,
    heading7
) {
    doc
        .fontSize(11)
        .text(sr, 15, y, { width: 40, align: "center" })
        .text(heading1, 55, y, { width: 125, align: "center" })
        .text(heading2, 180, y, { width: 80, align: "center" })
        .text(heading3, 260, y, { width: 50, align: "center" })
        .text(heading4, 310, y, { width: 60, align: "center" })
        .text(heading5, 370, y, { width: 60, align: "center" })
        .text(heading6, 430, y, { width: 60, align: "center" })
        .text(heading7, 490, y, { width: 60, align: "center" });
}

function generateHrInvoice(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(15, y)
        .lineTo(546, y)
        .stroke()
        .moveDown();
}

module.exports = {
    createInvoice
};

function adjustLengthInvoice(doc, pName, startX, startY, increment, alignPosition, size) {
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
        if (size == "12.5" || size == "11.5" || size == "11" || size == "10.5") startY += 18;
        else startY += 15;

        j++;
    }
    //console.log(startY, "starty");
    // console.log(tempPName);
}

function addNewPageConditionInvoice(doc) {
    if (spaceFromTop > 770) {
        doc.addPage();
        spaceFromTop = 50;
    }
}

function savePDfToFolderInvoice(doc, invoice) {
    var fileDestination = "C:\\Kalash Invoices\\";
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    fileDestination += "\\" + "INVOICE";
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    var fileName = invoice.billNo + " - " + invoice.partyName1 + " - " + invoice.billDate + ".pdf"

    fileDestination += "\\" + fileName;
    // to save the invoice as pdf
    var savePdf = fs.createWriteStream(fileDestination);
    doc.pipe(savePdf);

    savePdf.on('finish', function () {
        // console.log(fileDestination)
        alert('File saved to ' + fileDestination);
        //openPdf(path); //top open the pdf
    });
}

function openPdfInvoiceInvoice(doc) {
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