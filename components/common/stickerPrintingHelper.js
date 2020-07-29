// 
var dir = "";
var fromTop = 210;
var fromLeft = 147;
var currentPageTotal = 0;

//147 x 210 WxH


function printAllStickers(invoice, totalPages) {
    let doc = new PDFDocument({ size: [147, 210], margin: 10 });
    for (var i = 0; i < totalPages; i++) {
        createInvoice(invoice, invoice.stickers[i], doc);
        if (i != totalPages - 1) {
            // console.log("Callled add page")
            addNewPageCondition(doc);
        }
    }
    // console.log(fromTop);
    doc.rotate(90 * (-1), { origin: [75, 75] });

    doc.end();
    savePDfToFolder(doc, invoice);
}

function createInvoice(invoice, items, doc) {
    // console.log(items)
    dir = "";

    fromTop = 15;
    fromLeft = 20;

    doc.save();
    doc.rotate(90, { origin: [75, 75] });
    generateHr(doc, fromTop);

    fromTop += 8;

    //company name
    doc.font("Helvetica-Bold")
        .fontSize(16)
        .text(invoice.stickerCompanyName, fromLeft, fromTop, { align: 'center', width: "180" });

    fromTop += 20;

    generateHr(doc, fromTop);

    fromTop += 15;
    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text("Design:", fromLeft, fromTop, { align: 'left', width: "80" })
        .font('Helvetica')
        .fontSize(14)
        .text(items.qualityName, fromLeft + 65, fromTop, { align: 'left', width: "100" });

    fromTop += 21;
    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text("Color:", fromLeft, fromTop, { align: 'left', width: "80" })
        .font('Helvetica')
        .fontSize(14)
        .text(items.color, fromLeft + 65, fromTop, { align: 'left', width: "100" });

    // fromTop += 21;
    // doc
    //     .font('Helvetica-Bold')
    //     .fontSize(14)
    //     .text("Color:", fromTop, { align: 'left', width: "80" })
    //     .font('Helvetica')
    //     .fontSize(14)
    //     .text(items.color, fromLeft + 65, fromTop, { align: 'left', width: "100" });

    fromTop += 21;
    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text("Mtrs:", fromLeft, fromTop, { align: 'left', width: "80" })
        .font('Helvetica')
        .fontSize(14)
        .text(items.qty, fromLeft + 65, fromTop, { align: 'left', width: "100" });

    fromTop += 21;

    doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text("Roll No.:", fromLeft, fromTop, { align: 'left', width: "80" })
        .font('Helvetica')
        .fontSize(14)
        .text(items.rollNo, fromLeft + 65, fromTop, { align: 'left', width: "100" });

    fromTop += 18;
    generateHr(doc, fromTop);
}


function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(10, y)
        .lineTo(200, y)
        .stroke()
        .moveDown();
}

module.exports = {
    createInvoice
};

function addNewPageCondition(doc) {
    doc.addPage();
    fromTop = 0;
}

function savePDfToFolder(doc, invoice) {
    var fileDestination = "C:\\Kalash Invoices\\";
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    fileDestination += "\\" + invoice.stickerFolderName;
    if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination);
    }

    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var finalDate = day + "." + month + "." + year + " - " + hour + "." + min + "." + sec;
    // console.log(finalDate);
    var fileName = finalDate + " -  Stickers" + ".pdf";

    fileDestination += "\\" + fileName;
    // to save the invoice as pdf
    var savePdf = fs.createWriteStream(fileDestination);
    doc.pipe(savePdf);

    savePdf.on('finish', function () {
        console.log(fileDestination)
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
