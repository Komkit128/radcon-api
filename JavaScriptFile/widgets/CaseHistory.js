$(document).ready(function () {

    var theme = 'energyblue';
    var delayInMilliseconds = 1000; //1 second

    /////////////////// New Code to not back page to login /////////////////////////
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
        //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        window.history.pushState(null, "", window.location.href);
        if ($("#gridCaseActive").is(":hidden")) {
            $("#GridCase").show();
            $("#ManageCaseDoctor").hide();
        } else {
            if (confirm("ต้องการกลับมาหน้าแสดงเคสวันนี้หรือไม่!")) {
                $('#collapseDoctor-All-Date1').click();
            } else {
                $('#vClear').click();
            }
        }
    };
    /////////////////// New Code to not back page to login /////////////////////////

    vTotalCase = $('#sTotalCase').html();
    vNewCase = $('#sNewCase').html();
    vWaitAccept = $('#AWaitAccept').html();
    vAccepted = $('#AAccepted').html();
    $("#ManageCase").hide();
    $('#vMtypeDetail').hide();
    $('#frmRenewCase').hide();
    $("#ManageCaseDoctor").hide();

    var Case_ID;
    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;

    $("#CancelCase").on('click', function () {
        var CaseStatus = $('#CaseStatus').val();
        var vDate = Y + m;
        gridCaseActive();

        $("#ManageCase").hide();
        scrollToTop();
        $("#DoctorID").val("");
        $("#TechID").val("");
        $("#vCaseID").val("");
        $("#RightID").val("");
        $("#sRights").html("");
        $("#GridCase").show();
    });

    $("#ViewCase").on('click', function () {
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=' + Case_OrthancID;
        openInNewTab(url);
    });

    $("#DownLoadCase").on('click', function () {
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/patients/' + Case_OrthancID + '/archive';
        openInNewTab(url);
    });


    $("#ReportCase").on('click', function () {
        var CaseID = $("#vCaseID").val();
        var url = "sapi/rad_report.php?CaseID=" + CaseID;
        openInNewTab(url);
    });

    $("#vSearch").on('click', function () {
        var vDate = Y + m;
        gridCaseActive(vDate);
    });

    $("#vClear").on('click', function () {
        //$("#vMouth").jqxDropDownList('selectIndex', 0);
        //$("#vYear").jqxDropDownList('selectIndex', 0);
        //var vDate = '00';
        //gridCaseActive(vDate);
        gridCaseActive();
    });

    $("#RenewCase").on('click', function () {
        let vCaseID = $('#vCaseID').val();
        let vTechID = $('#TechID').val();
        SRAD_UPDATE_CASE_DOC(vCaseID, vTechID, '0', '0', '');
    });


    setTimeout(function () {
        gridAppear();
    }, delayInMilliseconds);
    setTimeout(function () {
        jqxTooltipAppear();
    }, delayInMilliseconds);
    setTimeout(function () {
        jqxListBoxAppear();
    }, delayInMilliseconds);

});


function LoopLoad(vTotalCase, Date) {
    var vDate = Date;
    setInterval(function () {
        //GetTotalCase();
        var ChkRe = false;
        var ChkvTotalCase = $('#sTotalCase').html();
        var ChkvNewCase = $('#sNewCase').html();
        var ChkvWaitAccept = $('#AWaitAccept').html();
        var ChkvAccepted = $('#AResponed').html();

        if (vTotalCase != ChkvTotalCase) {
            ChkRe = true;
            try {
                gridCaseActive(vDate);
            }
            catch {
                location.reload();
            }
        }

        if (vNewCase != ChkvNewCase && !ChkRe) {
            gridCaseActive(vDate);
        }

        if (vWaitAccept != ChkvWaitAccept && !ChkRe) {
            gridCaseActive(vDate);
        }

        if (vAccepted != ChkvAccepted && !ChkRe) {
            gridCaseActive(vDate);
        }

        vTotalCase = $('#sTotalCase').html();
        vNewCase = $('#sNewCase').html();
        vWaitAccept = $('#AWaitAccept').html();
        vAccepted = $('#AResponed').html();
    }, 1000 * 3);

    
}


function jqxTooltipAppear() {
    $("#vClear").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Clear Filter' });
    $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
    $("#vConsult").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Consult/Review' });
    //$("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });

    if (!($('#gridCaseActive').is(":hidden"))) {
        $("#row00gridCaseActive").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCaseActive").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }


    if (!($('#gridPatient').is(":hidden"))) {
        $("#row00gridPatient").children().eq(1).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridPatient").children().eq(3).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridPatient").children().eq(6).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
    }
}


function gridAppear() {
    ///////////////// Tooltips Header Column /////////////////////////////
    var theme = 'energyblue';
    var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        Editrow = row;
        var offset = $("#gridCaseActive").offset();
        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
        var STATUS_Name = dataRecord.CASE_STATUS_Name;
        var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

        if (STATUS_Name == "New Case") {
            return '<span class="text-danger center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Wait Accept") {
            return '<span class="text-warning center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Accepted") {
            return '<span class="text-info center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Doctor Response") {
            return '<span class="text-success center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
    };

    var cellsrenderer2 = function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
        Editrow = row;
        var offset = $("#gridPatient").offset();
        var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);
        var STATUS_Name = dataRecord.CASE_STATUS_Name;
        var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

        if (STATUS_Name == "New Case") {
            return '<span class="text-danger center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Wait Accept") {
            return '<span class="text-warning center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Accepted") {
            return '<span class="text-info center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
        else if (STATUS_Name == "Doctor Response") {
            return '<span class="text-success center">&nbsp;<B>' + STATUS_Name_TH + '</B></span>';
        }
    };
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
    };


    $("#gridPatient").jqxGrid({
        width: "100%",
        height: 333,
        sortable: true,
        altrows: true,
        filterable: true,
        showfilterrow: true,
        autorowheight: true,
        columnsreorder: true,
        columnsresize: true,
        pageable: true,
        pagesize: 20,
        scrollmode: 'logical',
        autoShowLoadElement: false,
        pagesizeoptions: ['20', '50', '100', '500'],
        theme: theme,
        columns: [
            { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 35 },
            { text: 'วันที่ตรวจ', datafield: 'Case_DateUpdates', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', rendered: tooltiprenderer, filtertype: 'range', width: 90 },
            { text: 'Modality', datafield: 'Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' },
            { text: 'Protocol Name', datafield: 'ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 120 },
            { text: 'Study Description', datafield: 'Order_Detail', align: 'center', rendered: tooltiprenderer, minwidth: 200 },
            { text: 'แพทย์ผู้ส่ง', datafield: 'Patient_Doctor', align: 'center', rendered: tooltiprenderer, minwidth: 200 },
            { text: 'รังสีแพทย์', datafield: 'DocFullName', align: 'center', rendered: tooltiprenderer, width: 150 },
            { text: 'Status', datafield: 'CASE_STATUS_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, cellsrenderer: cellsrenderer2, width: 100 },
            { text: 'Accession Number', datafield: 'I_AccessionNumber', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, filtertype: 'checkedlist', width: 100 },
        ]
    });

    $("#gridCaseActive").jqxGrid(
        {
            width: "100%",
            height: 533,
            sortable: true,
            altrows: true,
            filterable: true,
            showfilterrow: true,
            //showstatusbar: true,
            //statusbarheight: 24,
            //showaggregates: true,
            columnsreorder: true,
            autorowheight: true,
            columnsresize: true,
            pageable: true,
            pagesize: 10,
            scrollmode: 'logical',
            autoShowLoadElement: false,
            pagesizeoptions: ['10', '20', '50', '100', '500'],
            theme: theme,
            columns: [
                { text: '#', datafield: 'Row', align: 'center', cellsalign: 'center', width: 35 },
                { text: 'สถานะ', datafield: 'CASE_STATUS_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', cellsrenderer: cellsrenderer, rendered: tooltiprenderer, width: 100 },
                { text: 'วันที่', datafield: 'Case_DateUpdates', align: 'center', cellsalign: 'center', cellsformat: 'dd MMM yyyy HH:mm:ss', filtertype: 'range', rendered: tooltiprenderer, width: 90 },
                { text: '#HN', datafield: 'Patient_HN', align: 'center', rendered: tooltiprenderer, width: 100 },
                { text: 'ผู้รับการตรวจ', datafield: 'FullName', align: 'center', rendered: tooltiprenderer, width: 250 },
                { text: 'เพศ', datafield: 'Patient_Sex_TH', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', rendered: tooltiprenderer, width: 50 },
                { text: 'อายุ', datafield: 'Patient_Age', align: 'center', cellsalign: 'center', rendered: tooltiprenderer, width: 50 },
                { text: 'Description', datafield: 'Case_StudyDESC', align: 'center', rendered: tooltiprenderer, width: 120 },
                { text: 'Protocol', datafield: 'ProtocolName', align: 'center', rendered: tooltiprenderer, minwidth: 120 },
                { text: 'Modality', datafield: 'Modality', align: 'center', width: 70, rendered: tooltiprenderer, filtertype: 'checkedlist' }
            ]
        });
    //gridCaseActive();

    $("#gridFileUpdate").jqxGrid({
        width: '100%',
        height: 185,
        //pageable: true,
        //pagerButtonsCount: 10,
        columnsResize: true,
        altrows: true,
        scrollmode: 'logical',
        //autoheight: true,
        //showstatusbar: true,
        theme: theme,
        columns: [
            {
                text: 'View', datafield: 'View', columntype: 'button', cellsalign: 'center', width: 50, cellsrenderer: function () {
                    return "Load";
                }, buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridFileUpdate").offset();

                    var dataRecord = $("#gridFileUpdate").jqxGrid('getrowdata', Editrow);
                    var vImage = dataRecord.Result_Path_IMG;

                    var url = vImage;
                    //document.getElementById("vShowImg").src = url;
                    openInNewTab(url);
                }
            },
            { text: 'ไฟล์', datafield: 'Result_CASE_FileName', align: 'center', minwidth: 50 },
            { text: 'วันที่', datafield: 'Result_CASE_DateUpdate', align: 'center', width: 150 }
        ]
    });

    $("#gridPatient").on('rowdoubleclick', function (row) {
        //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
        Editrow = row.args.rowindex;
        var offset = $("#gridPatient").offset();
        var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);
        var url = 'http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=' + Case_OrthancID;
        openInNewTab(url);
    });

    $("#gridPatient").on('rowclick', function (row) {

        //console.log("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
        Editrow = row.args.rowindex;
        var offset = $("#gridPatient").offset();
        var dataRecord = $("#gridPatient").jqxGrid('getrowdata', Editrow);
        var Case_DocRespone = dataRecord.Case_DocRespone;
        $('#pRespone').val(Case_DocRespone);

    });

    $("#gridCaseActive").on('rowdoubleclick', function (row) {

        //alert("Row with bound index: " + row.args.rowindex + " has been double-clicked.");
        Editrow = row.args.rowindex;
        //alert(Editrow);

        //var offset = $("#gridCaseActive").offset();
        //var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
        var offset = $("#gridCaseActive").offset();
        var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
        var CaseID = dataRecord.Case_ID;
        var TechID = dataRecord.Case_TechID;
        var Case_Status = dataRecord.Case_Status;
        //var dataRecord = $("#gridCaseActive").jqxGrid('getrowdata', Editrow);
        Case_ID = dataRecord.Case_ID;
        var FullName = dataRecord.FullName;
        var Hos_OrthancID = dataRecord.Hos_OrthancID;
        var Hos_Name = dataRecord.Hos_Name;
        var Patient_HN = dataRecord.Patient_HN;
        var Patient_Name = dataRecord.Patient_Name;
        var Patient_LastName = dataRecord.Patient_LastName;
        var Case_StudyDESC = dataRecord.Case_StudyDESC;
        var Patient_Sex = dataRecord.Patient_Sex_TH;
        var Patient_Age = dataRecord.Patient_Age;
        var Patient_Birthday = dataRecord.Patient_Birthday;
        var Patient_CitizenID = dataRecord.Patient_CitizenID;
        var CASE_STATUS_Name = dataRecord.CASE_STATUS_Name;
        var TreatmentRights_ID = dataRecord.TreatmentRights_ID;
        var TreatmentRights_Name = dataRecord.TreatmentRights_Name;
        var Patient_XDoc = dataRecord.DocFullName;
        var UG_Type_Name = dataRecord.UG_Type_Name;
        var Case_UrgentType = dataRecord.Case_UrgentType;
        var Patient_Doctor = dataRecord.Patient_Doctor;
        var ProtocolName = dataRecord.ProtocolName;
        var Modality = dataRecord.Modality;
        var Case_DocRespone = dataRecord.Case_DocRespone;
        var DocFullName = dataRecord.DocFullName;
        Case_TechID = dataRecord.Case_TechID;
        Case_Status = dataRecord.Case_Status;
        Case_OrthancID = dataRecord.Case_OrthancID;

        //$("#ManageCase").show();
        $("#ManageCaseDoctor").show();

        $('#ManageCase').focus();
        $('#PHos').html(Hos_Name);
        $('#PName').html(FullName);
        $('#HCase').html(Case_StudyDESC);
        $('#HProtocol').html(ProtocolName);
        $('#HModality').html(Modality);
        $('#vDStatus').html(CASE_STATUS_Name);
        $('#sUrgentType').html(UG_Type_Name);
        $("#sRights").html(TreatmentRights_Name);


        $('#vCaseID').val(Case_ID);
        $('#RightID').val(TreatmentRights_ID);
        $('#UrgentTypeID').val(Case_UrgentType);
        $('#TechID').val(Case_TechID);
        //$('#pRespone').val(Case_DocRespone); // ผลอ่าน ใช้เป็นคลิกครั้งเดียวแสดงผลอ่าน
        $('#CaseStatus').val(Case_Status);
        $('#vDocFullName').val(DocFullName);

        $('#vHN').html(Patient_HN);
        $('#vSex').html(Patient_Sex);
        $('#vAge').html(Patient_Age);
        $('#vCitizenID').html(Patient_CitizenID);
        $('#vPatientDoctor').html(Patient_XDoc);
        $('#vCitizenID').html(Patient_CitizenID);

        gridPatientActive(Patient_HN);
        CheckCaseStatus(Case_Status);
        FromTypecheck(Case_Status);
        SRAD_SEC_FILE(Case_ID);
        scrollToTop();

        //if(User_TypeID == "2"){
        $("#GridCase").hide();
    });



    $('#gridPatient').on('filter', function () {
        //alert("The Grid has been filtered");
        var filterGroups = $("#gridPatient").jqxGrid('getfilterinformation');
        var info = "";
        for (var i = 0; i < filterGroups.length; i++) {
            var filterGroup = filterGroups[i];
            info += "Filter Column: " + filterGroup.filtercolumn;
            var filters = filterGroup.filter.getfilters();
            for (var j = 0; j < filters.length; j++) {
                info += "\nValue: " + filters[j].value;
            }
        }
    });

    $('#gridCaseActive').on('filter', function () {
        //alert("The Grid has been filtered");
        var filterGroups = $("#gridCaseActive").jqxGrid('getfilterinformation');
        var info = "";
        for (var i = 0; i < filterGroups.length; i++) {
            var filterGroup = filterGroups[i];
            info += "Filter Column: " + filterGroup.filtercolumn;
            var filters = filterGroup.filter.getfilters();
            for (var j = 0; j < filters.length; j++) {
                info += "\nValue: " + filters[j].value;
            }
        }
    });

}


function jqxListBoxAppear() {
    var listSource = [{
        label: 'Row',
        value: 'Row',
        checked: true
    },
    {
        label: 'สถานะ',
        value: 'CASE_STATUS_Name',
        checked: true
    },
    {
        label: 'วันที่',
        value: 'Case_DateInsert',
        checked: true
    },
    {
        label: '#HN',
        value: 'Patient_HN',
        checked: true
    },
    {
        label: 'ผู้รับการตรวจ',
        value: 'FullName',
        checked: true
    },
    {
        label: 'เพศ',
        value: 'Patient_Sex_TH',
        checked: true
    },
    {
        label: 'อายุ',
        value: 'Patient_Age',
        checked: true
    },
    {
        label: 'Description',
        value: 'Case_StudyDESC',
        checked: true
    },
    {
        label: 'Protocol',
        value: 'ProtocolName',
        checked: true
    },
    {
        label: 'Modality',
        value: 'Modality',
        checked: true
    }
    ];
    $("#jqxlistbox").jqxListBox({
        source: listSource,
        width: 200,
        height: 200,
        checkboxes: true
    });
    $("#jqxlistbox").on('checkChange', function (event) {
        $("#gridCaseActive").jqxGrid('beginupdate');
        if (event.args.checked) {
            $("#gridCaseActive").jqxGrid('showcolumn', event.args.value);
        } else {
            $("#gridCaseActive").jqxGrid('hidecolumn', event.args.value);
        }
        $("#gridCaseActive").jqxGrid('endupdate');
    });
}

function CheckCaseStatus(Case_Status) {
    if (Case_Status != "0" && (User_TypeID == "3" || User_TypeID == "1")) {
        $('#frmSaveCase').hide();
    }
    else {
        $('#frmSaveCase').show();
    }
}



//const apiconnector = require('./apiconnect.js')($);

////////////////////////////////// API ///////////////////////////////////
// function gridCaseActive(Date) {
function gridCaseActive() {
    //var act = 'SRAD_GET_CASE_HIS';
    var act = 'SRAD_GET_CASE';
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        User_ID: vUserID,
        Type: User_Type,
        // Date : Date
    };
    var source =
    {
        type: 'GET',
        datatype: "json",
        datafields: [
            { name: 'Row', type: 'number' },
            { name: 'Case_ID', type: 'string' },
            { name: 'Hos_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'Hos_Name', type: 'string' },
            { name: 'Case_OrthancID', type: 'string' },
            { name: 'Case_ParentPatient', type: 'string' },
            { name: 'Case_StudyDESC', type: 'string' },
            { name: 'Case_Status', type: 'string' },
            { name: 'CASE_STATUS_Name', type: 'string' },
            { name: 'CASE_STATUS_Name_TH', type: 'string' },
            { name: 'Case_UrgentType', type: 'string' },
            { name: 'UG_Type_Name', type: 'string' },
            { name: 'UrgentTime', type: 'string' },
            { name: 'Case_TechID', type: 'string' },
            { name: 'Case_DoctorID', type: 'string' },
            { name: 'DocFullName', type: 'string' },
            { name: 'Patient_HN', type: 'string' },
            { name: 'Patient_Name', type: 'string' },
            { name: 'Patient_LastName', type: 'string' },
            { name: 'FullName', type: 'string' },
            { name: 'Patient_CitizenID', type: 'string' },
            { name: 'Patient_Birthday', type: 'string' },
            { name: 'Patient_Age', type: 'string' },
            { name: 'Patient_Sex', type: 'string' },
            { name: 'Patient_Sex_TH', type: 'string' },
            { name: 'TreatmentRights_ID', type: 'string' },
            { name: 'TreatmentRights_Name', type: 'string' },
            { name: 'Patient_Doctor', type: 'string' },
            { name: 'BodyPartExamined', type: 'string' },
            { name: 'Modality', type: 'string' },
            { name: 'Manufacturer', type: 'string' },
            { name: 'ProtocolName', type: 'string' },
            { name: 'SeriesDescription', type: 'string' },
            { name: 'PerformedProcedureStepDescription', type: 'string' },
            { name: 'StationName', type: 'string' },
            { name: 'Order_ID', type: 'string' },
            { name: 'Order_Detail', type: 'string' },
            { name: 'Order_Unit', type: 'string' },
            { name: 'Order_Price', type: 'number' },
            { name: 'Order_DF', type: 'number' },
            { name: 'Case_DocRespone', type: 'string' },
            { name: 'Case_DateUpdate', type: 'string' },
            { name: 'Case_DateUpdates', type: 'date' },
            { name: 'Case_DateInsert', type: 'string' }
        ],
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    try {
        $("#gridCaseActive").jqxGrid({ source: dataAdapter });
        $('#gridCaseActive').jqxGrid('clearselection');
    }
    catch {
        location.reload();
    }
}

// function Show PatientCase For Doctor {
function gridPatientActive(Patient_HN) {
    //ส่ง GET action=SRAD_GET_CASE_PATIENT&Patient_HN=รหัสHN
    //var act = 'SRAD_GET_CASE_HIS';
    //alert(Patient_HN);
    var act = 'SRAD_GET_CASE_PATIENT';
    var url = "sapi/api.class.php?action=" + act
    var pData = {
        Patient_HN: Patient_HN,
        Type: User_Type
    };
    var source =
    {
        type: 'GET',
        datatype: "json",
        datafields: [
            { name: 'Row', type: 'number' },
            { name: 'Case_ID', type: 'string' },
            { name: 'Hos_ID', type: 'string' },
            { name: 'Hos_OrthancID', type: 'string' },
            { name: 'Hos_Name', type: 'string' },
            { name: 'Case_OrthancID', type: 'string' },
            { name: 'Case_ParentPatient', type: 'string' },
            { name: 'I_AccessionNumber', type: 'string' },
            { name: 'Case_StudyDESC', type: 'string' },
            { name: 'Case_Status', type: 'string' },
            { name: 'CASE_STATUS_Name', type: 'string' },
            { name: 'CASE_STATUS_Name_TH', type: 'string' },
            { name: 'Case_UrgentType', type: 'string' },
            { name: 'UG_Type_Name', type: 'string' },
            { name: 'UrgentTime', type: 'string' },
            { name: 'Case_TechID', type: 'string' },
            { name: 'Patient_Doctor', type: 'string' },
            { name: 'Case_DoctorID', type: 'string' },
            { name: 'DocFullName', type: 'string' },
            { name: 'Patient_HN', type: 'string' },
            { name: 'Patient_Name', type: 'string' },
            { name: 'Patient_LastName', type: 'string' },
            { name: 'FullName', type: 'string' },
            { name: 'Patient_CitizenID', type: 'string' },
            { name: 'Patient_Birthday', type: 'string' },
            { name: 'Patient_Age', type: 'string' },
            { name: 'Patient_Sex', type: 'string' },
            { name: 'Patient_Sex_TH', type: 'string' },
            { name: 'TreatmentRights_ID', type: 'string' },
            { name: 'TreatmentRights_Name', type: 'string' },
            { name: 'Patient_Doctor', type: 'string' },
            { name: 'BodyPartExamined', type: 'string' },
            { name: 'Modality', type: 'string' },
            { name: 'Manufacturer', type: 'string' },
            { name: 'ProtocolName', type: 'string' },
            { name: 'SeriesDescription', type: 'string' },
            { name: 'PerformedProcedureStepDescription', type: 'string' },
            { name: 'StationName', type: 'string' },
            { name: 'Case_DocRespone', type: 'string' },
            { name: 'Order_ID', type: 'string' },
            { name: 'Order_Detail', type: 'string' },
            { name: 'Order_Unit', type: 'string' },
            { name: 'Order_Price', type: 'number' },
            { name: 'Order_DF', type: 'number' },
            { name: 'Case_DateUpdate', type: 'string' },
            { name: 'Case_DateUpdates', type: 'date' },
            { name: 'Case_DateInsert', type: 'string' }
        ],
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    try {
        $("#gridPatient").jqxGrid({ source: dataAdapter });
        $('#gridPatient').jqxGrid('clearselection');
        console.log('success to get data ');
    }
    catch {
        location.reload();
    }
}


function SRAD_SEC_FILE(CaseID) {
    var act = 'SRAD_SEC_FILE';
    var url = "sapi/api.class.php?action=" + act
    //ar CaseID = $("#vCaseID").val();
    var pData = {
        Case_ID: CaseID,
    };

    var source =
    {
        type: 'GET',
        datatype: "json",
        datafields: [
            { name: 'Result_CASE_ID', type: 'number' },
            { name: 'CASE_ID', type: 'number' },
            { name: 'Result_CASE_FileName', type: 'string' },
            { name: 'Result_CASE_Type', type: 'string' },
            { name: 'Result_CASE_Size', type: 'string' },
            { name: 'Result_Path_IMG', type: 'string' },
            { name: 'Result_CASE_DateUpdate', type: 'string' }
        ],
        url: url,
        data: pData
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridFileUpdate").jqxGrid({ source: dataAdapter });
}

function FromTypecheck(Case_Status) {

    if (User_TypeID == "2") {
        $('#frmSaveCase').hide();
        $('#frmRespone').hide();
        $('#pRespone').jqxInput({ disabled: true });

        $("#PMFileImage").hide();
        $("#DMFileImage").show();

        if (Case_Status == "2" || Case_Status == "3") {
            $('#frmAccept').hide();
            $('#frmCancelAccept').hide();
        }
        else {
            $('#frmAccept').show();
            $('#frmCancelAccept').show();
        }

        if (Case_Status == '2') {
            //$('#ViewCase').show();
            //$('#DownLoadCase').show();
            $('#frmRespone').show();
            $('#pRespone').jqxInput({ disabled: false });
        }
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
        $("#PMFileImage").show();
        $("#DMFileImage").hide();
    }

    if (Case_Status != "0") {
        $('#vMtypeDetail').hide();
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
    }

    if (User_TypeID == "3") {
        $('#frmRenewCase').show();
    }

}

function SRAD_UPDATE_CASE_DOC(CaseID, TechID, DoctorID, CaseStatus, Case_DocRespone) {
    var act = 'SRAD_UPDATE_CASE_DOC';
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        CaseID: CaseID,
        TechID: TechID,
        DoctorID: DoctorID,
        CaseStatus: CaseStatus,
        CaseDocRespone: Case_DocRespone
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            if (data.Response == 'success') {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {

                    ShowNoti(vMsg, "success");

                    if (CaseStatus == '1') {
                        $('#frmSaveCase').hide();
                    }

                    $("#DoctorID").val("");
                    $("#TechID").val("");
                    $("#vCaseID").val("");
                    $("#RightID").val("");
                    $("#sRights").html("");
                    $("#ManageCase").hide();
                    $("#GridCase").show();

                    gridCaseActive();
                }
                else {
                    ShowNoti(vResult, "danger");
                }
            }
        }
    });
}

////////////////////////////////// API ///////////////////////////////////

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function FromTypecheck(Case_Status) {

    $('#frmAccept').hide();
    $('#frmCancelAccept').hide();
    $("#PMFileImage").show();
    $("#DMFileImage").hide();

    if (Case_Status != "0") {
        $('#vMtypeDetail').hide();
    }
    else {
        $('#frmAccept').hide();
        $('#frmCancelAccept').hide();
    }
}

function scrollToTop() {
    //$('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
};

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}



