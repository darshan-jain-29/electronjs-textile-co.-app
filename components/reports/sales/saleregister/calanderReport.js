function loadDataInCalanderFormat(fromMonth, fromYear, toMonth, toYear) {
    console.log(fromMonth, fromYear, toMonth, toYear)
    // document.getElementById("viewPartyName").value = partyName == "" ? "ALL" : partyName;
    // document.getElementById("viewQualityName").value = qualityName == "" ? "ALL" : qualityName;
    // document.getElementById("viewShade").value = shade == "" ? "ALL" : shade;
    // document.getElementById("viewColor").value = color == "" ? "ALL" : color;

    // document.getElementById("viewFromDate").value = fromDate == "" ? "ALL" : formatDate(fromDate);
    // document.getElementById("viewToDate").value = toDate == "" ? "ALL" : formatDate(toDate);
    // document.getElementById("masterQtySale").textContent = masterQtySale = 0;

    // // console.log(partyName, qualityName, shade, color, fromDate, toDate);
    // var queryString = "select s1.invoiceNumber, s1.dispatchDate, (s1.qtyDelivering - s1.qtyGR) as qtyDelivered, s1.rollsDelivering, s2.qualityName, s2.shade, s2.color,  s2.lotNo, s2.conditions, (s2.qty - s2.grQty) as qtySale, s3.partyName from dispatchmaster as s1, dispatchrows s2, salepomaster as s3 where s1.dUNumber = s2.dUNumber and s1.salePoNumber = s3.salePoNumber and ";

    // if (partyName.trim().length > 0) queryString += "s3.partyName = '" + partyName + "' and ";

    // if (qualityName.trim().length > 0) queryString += "s2.qualityName = '" + qualityName + "' and ";

    // if (shade.trim().length > 0) queryString += "s2.shade = '" + shade + "' and ";

    // if (color.trim().length > 0) queryString += "s2.color = '" + color + "' and ";

    // if (fromDate.trim().length > 0) queryString += "str_to_date(s1.dispatchDate,'%d-%m-%Y' ) >= '" + fromDate + "' and ";

    // if (toDate.trim().length > 0) queryString += "str_to_date(s1.dispatchDate,'%d-%m-%Y' ) <= '" + toDate + "' and ";

    // queryString += " 1 order by s3.partyName, s1.duNumber desc, s2.qualityName, s2.shade, s2.color, s2.lotNo; "

    // // console.log(queryString);
    // connection.query(
    //     queryString,
    //     function (error, results) {
    //         if (error) { alert(error + " : Tab - "); throw error; }
    //         console.log(results);
    //         addDataInDetailReport(results);
    //     }
    // );
}