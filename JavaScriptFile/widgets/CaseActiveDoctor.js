$(document).ready(function () {

    /////////////////// New Code to not back page to login /////////////////////////
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
        //alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
        window.history.pushState(null, "", window.location.href);
        if ($("#gridCaseActive").is(":hidden")) {
            $("#GridCase").show();
            $("#ManageCase").hide();
        }
        scrollToTop();
    };
    /////////////////// New Code to not back page to login /////////////////////////

    

    vTotalCase = $("#sTotalCase").html();
    vNewCase = $("#sNewCase").html();
    vWaitAccept = $("#AWaitAccept").html();
    vAccepted = $("#AAccepted").html();
    LoopLoad(vTotalCase, vNewCase);
    $("#ManageCase").hide();
    $("#vMtypeDetail").hide();

    var Case_ID;
    var Case_Status;
    var Case_TechID;
    var Case_OrthancID;

    var cellsrenderer = function (
        row,
        columnfield,
        value,
        defaulthtml,
        columnproperties,
        rowdata
    ) {
        Editrow = row;
        var offset = $("#gridCaseActive").offset();

        var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
        var STATUS_Name = dataRecord.CASE_STATUS_Name;
        var STATUS_Name_TH = dataRecord.CASE_STATUS_Name_TH;

        if (STATUS_Name == "New Case") {
            return (
                '<span class="text-danger center">&nbsp;<B>' +
                STATUS_Name_TH +
                "</B></span>"
            );
        } else if (STATUS_Name == "Wait Accept") {
            return (
                '<span class="text-warning center">&nbsp;<B>' +
                STATUS_Name_TH +
                "</B></span>"
            );
        } else if (STATUS_Name == "Accepted") {
            return (
                '<span class="text-info center">&nbsp;<B>' +
                STATUS_Name_TH +
                "</B></span>"
            );
        } else if (STATUS_Name == "Doctor Response") {
            return (
                '<span class="text-success center">&nbsp;<B>' +
                STATUS_Name_TH +
                "</B></span>"
            );
        }
    };

    var Timecount = function (row, value) {
        Editrow = row;
        var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
        var Case_DateUpdate = dataRecord.Case_DateUpdate;
        var UrgentTime = dataRecord.UrgentTime;
        var CaseID = dataRecord.Case_ID;
        var TechID = dataRecord.Case_TechID;
        var Case_Status = dataRecord.Case_Status;

        const d = Date.parse(Case_DateUpdate);
        const millis = Date.now();

        var total = millis - d;
        var date = millisToMinutesAndSeconds(total);
        var ChkExpire = millisToMinutes(total);

        if (total > parseInt(UrgentTime)) {
            //ChkExpire = '<span class="text-danger center"><B>Expire</B></span>';

            if (Case_Status == "1") {
                ChkExpire = '<span class="text-danger center"><B>Expire</B></span>';
                SRAD_UPDATE_CASE_DOC(CaseID, TechID, "0", "0", "");
            } else {
                ChkExpire =
                    '<span class="text-primary center"><B>' + "Stop" + "</B></span>";
            }
        } else {
            if (Case_Status == "1") {
                ChkExpire =
                    '<span class="text-primary center"><B>' +
                    String(date) +
                    "</B></span>";
            } else {
                ChkExpire =
                    '<span class="text-primary center"><B>' + "Stop" + "</B></span>";
            }
        }

        return ChkExpire;
    };

    function millisToMinutesAndSeconds(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    function millisToMinutes(millis) {
        var minutes = Math.floor(millis / 60000);
        return minutes;
    }

    setInterval(function () {
        $("#gridCaseActive").jqxGrid("refresh");
    }, 1000 * 1);

    setInterval(function () {
        if (typeof Case_ID == "undefined") {
            location.reload(true);
        }
    }, 1000 * (60 * 30));

    setInterval(function () {
        var Case_Status = $("#CaseStatus").val();
        AutoSaverespone(Case_Status);
    }, 1000 * 30);

    ///////////////// Tooltips Header Column /////////////////////////////
    var tooltiprenderer = function (element) {
        $(element).parent().jqxTooltip({ position: 'top', content: "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง" });
    };
    ///////////////// Tooltips Header Column /////////////////////////////

    $("#gridCaseActive").jqxGrid({
        width: "100%",
        height: 550,
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
        scrollmode: "logical",
        autoShowLoadElement: false,
        pagesizeoptions: ["10", "20", "50", "100", "500"],
        theme: theme,
        columns: [{
                text: "#",
                datafield: "Row",
                align: "center",
                cellsalign: "center",
                width: 35,
            },
            {
                text: "Accept",
                datafield: "Accept",
                align: "center",
                columntype: "button",
                //columntype: 'text',
                cellsalign: "center",
                width: 60,
                rendered: tooltiprenderer,
                //cellclassname: 'btnAccept',
                cellsrenderer: function (row) {
                    //alert("this row is " + row+1);
                    Editrow = row;
                    var rowId = row.boundindex;
                    var rowData = $("#gridCaseActive").jqxGrid("getrowdata", rowId);
                    var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                    var Case_Status = dataRecord.Case_Status;
                    if (Case_Status == "1") {
                        //return '<input type="button" onclick="accepts_case(event)" class="btn btn-success btn-sm" id="btn-' + id  + '" value="Reject"/>' ;
                        return "Accept";
                    } else {
                        //return '<input type="button" onclick="accepts_case(event)" class="btn btn-success btn-sm" id="btn-Rejects-' + rowId + '" value="View"/>';
                        return "View";
                    }
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridCaseActive").offset();

                    var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                    var CaseID = dataRecord.Case_ID;
                    var TechID = dataRecord.Case_TechID;
                    var Case_Status = dataRecord.Case_Status;
                    var Hos_Name = dataRecord.Hos_Name;
                    var Patient_Name = dataRecord.Patient_Name;
                    var TechUID = dataRecord.TechUID;
                    var DocFullName = dataRecord.DocFullName;
                    var Modality = dataRecord.Modality;
                    var Description = dataRecord.Case_StudyDESC;
                    var ProtocolName = dataRecord.ProtocolName;

                    if (Case_Status == "1") {
                        SRAD_UPDATE_CASE_DOC(CaseID, TechID, vUserID, "2", "");

                        let vMsgLine =
                            "แพทย์รังสีตอบรับเคส" +
                            "<br>" +
                            "แพทย์รังสี : " +
                            DocFullName +
                            "<br>" +
                            "โรงพยาบาล : " +
                            Hos_Name +
                            "<br>" +
                            "คนไข้ : " +
                            Patient_Name +
                            "<br>" +
                            "Modality : " +
                            Modality +
                            "<br>" +
                            "Description : " +
                            Description +
                            "<br>" +
                            "Protocol : " +
                            ProtocolName;

                        LineNotiMsg(TechUID, vMsgLine);
                    } else {
                        ShowNoti("Already Accepted", "success");

                        var dataRecord = $("#gridCaseActive").jqxGrid(
                            "getrowdata",
                            Editrow
                        );
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
                        var Case_DoctorID = dataRecord.Case_DoctorID;
                        var Patient_XDoc = dataRecord.DocFullName;
                        var UG_Type_Name = dataRecord.UG_Type_Name;
                        var Case_UrgentType = dataRecord.Case_UrgentType;
                        var Patient_Doctor = dataRecord.Patient_Doctor;
                        var ProtocolName = dataRecord.ProtocolName;
                        var Modality = dataRecord.Modality;
                        var Case_DocRespone = dataRecord.Case_DocRespone;
                        var TechUID = dataRecord.TechUID;
                        Case_TechID = dataRecord.Case_TechID;
                        Case_Status = dataRecord.Case_Status;
                        Case_OrthancID = dataRecord.Case_OrthancID;

                        $("#ManageCase").show();

                        $("#ManageCase").focus();
                        $("#PHos").html(Hos_Name);
                        $("#PName").html(FullName);
                        $("#HCase").html(Case_StudyDESC);
                        $("#HProtocol").html(ProtocolName);
                        $("#HModality").html(Modality);
                        $("#vDStatus").html(CASE_STATUS_Name);
                        $("#sUrgentType").html(UG_Type_Name);
                        $("#sRights").html(TreatmentRights_Name);

                        $("#vCaseID").val(Case_ID);
                        $("#RightID").val(TreatmentRights_ID);
                        $("#UrgentTypeID").val(Case_UrgentType);
                        $("#TechID").val(Case_TechID);
                        $("#TechUID").val(TechUID);
                        $("#pRespone").val(Case_DocRespone);
                        $("#CaseStatus").val(Case_Status);

                        $("#vHN").html(Patient_HN);
                        $("#vSex").html(Patient_Sex);
                        $("#vAge").html(Patient_Age);
                        $("#vCitizenID").html(Patient_CitizenID);
                        $("#vPatientDoctor").html(Patient_Doctor);
                        $("#vCitizenID").html(Patient_CitizenID);

                        $("#vDocFullName").val(Patient_XDoc);

                        //$('#ViewCase').hide();
                        //$('#DownLoadCase').hide();

                        CheckCaseStatus(Case_Status);
                        FromTypecheck(Case_Status);
                        SRAD_SEC_FILE(Case_ID);
                        gridTemplate(Case_DoctorID);
                        scrollToTop();
                        gridCasePatient(Patient_HN);
                        //if(vTypeID == "2"){

                        ///////////////////// Add Tooltips /////////////////////////
                        setTimeout( function() {
                            $("#row00gridCasePatient").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
                            $("#row00gridCasePatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                            $("#row00gridCasePatient").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
                        }, 3000); 
                        ///////////////////// Add Tooltips /////////////////////////


                        $("#GridCase").hide();
                        $("#HospitalDisPlay").hide();
                        $("#CaseActiveDisPlay").hide();
                    }
                },
            },
            {
                text: "Reject",
                datafield: "Reject",
                align: "center",
                columntype: "button",
                //columntype: 'text',
                cellsalign: "center",
                width: 60,
                rendered: tooltiprenderer,
                cellclassname: "btnReject",
                cellsrenderer: function (row) {
                    //alert("this row is " + row+1);
                    Editrow = row;
                    var rowId = row.boundindex;
                    var rowData = $("#gridCaseActive").jqxGrid("getrowdata", rowId);
                    var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                    var Case_Status = dataRecord.Case_Status;

                    if (Case_Status == "1") {
                        //return '<input type="button" onclick="rejects_case(event)" class="btn btn-danger btn-sm" id="btn-' + id + '" value="Reject"/>';
                        return "Reject";
                    } else {
                        //return '<input type="button" class="btn btn-light btn-sm" style="display:none" id="btn-Rejects-' + rowId + '" value=""/>';
                        $(".btnReject input").eq(row).css("display", "none");
                        return " ";
                    }
                },

                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridCaseActive").offset();

                    var dataRecord = $("#gridCaseActive").jqxGrid("getrowdata", Editrow);
                    var CaseID = dataRecord.Case_ID;
                    var TechID = dataRecord.Case_TechID;
                    var Case_Status = dataRecord.Case_Status;
                    var Hos_Name = dataRecord.Hos_Name;
                    var Patient_Name = dataRecord.Patient_Name;
                    var TechUID = dataRecord.TechUID;
                    var DocFullName = dataRecord.DocFullName;
                    var Modality = dataRecord.Modality;
                    var Description = dataRecord.Case_StudyDESC;
                    var ProtocolName = dataRecord.ProtocolName;

                    if (Case_Status == "1") {
                        if (confirm("Do you want to reject case?")) {
                            let vMsgLine =
                                "แพทย์รังสีปฏิเสธเคส" +
                                "<br>" +
                                "แพทย์รังสี : " +
                                DocFullName +
                                "<br>" +
                                "โรงพยาบาล : " +
                                Hos_Name +
                                "<br>" +
                                "คนไข้ : " +
                                Patient_Name +
                                "<br>" +
                                "Modality : " +
                                Modality +
                                "<br>" +
                                "Description : " +
                                Description +
                                "<br>" +
                                "Protocol : " +
                                ProtocolName;

                            LineNotiMsg(TechUID, vMsgLine);
                            SRAD_UPDATE_CASE_DOC(CaseID, TechID, "0", "0", "");
                        }
                    } else {
                        ShowNoti("Already Accepted", "warning");
                    }
                },
            },
            {
                text: "Time",
                datafield: "Case_DateUpdate",
                align: "center",
                cellsalign: "center",
                width: 70,
                rendered: tooltiprenderer,
                cellsrenderer: Timecount,
            },
            {
                text: "สถานะ",
                datafield: "CASE_STATUS_Name",
                align: "center",
                cellsalign: "center",
                filtertype: "checkedlist",
                cellsrenderer: cellsrenderer,
                rendered: tooltiprenderer,
                width: 100,
            },
            {
                text: "วันที่",
                datafield: "Case_DateUpdates",
                align: "center",
                cellsalign: "center",
                cellsformat: "dd MMM yyyy HH:mm:ss",
                filtertype: "range",
                rendered: tooltiprenderer,
                width: 90,
            },
            {
                text: "โรงพยาบาล",
                datafield: "Hos_Name",
                align: "center",
                filtertype: "checkedlist",
                rendered: tooltiprenderer,
                width: 180,
            },
            {
                text: "#HN",
                datafield: "Patient_HN",
                rendered: tooltiprenderer,
                align: "center",
                width: 100,
            },
            {
                text: "ผู้รับการตรวจ",
                datafield: "FullName",
                align: "center",
                rendered: tooltiprenderer,
                width: 250,
            },
            {
                text: "เพศ",
                datafield: "Patient_Sex_TH",
                align: "center",
                cellsalign: "center",
                filtertype: "checkedlist",
                rendered: tooltiprenderer,
                width: 50,
            },
            {
                text: "อายุ",
                datafield: "Patient_Age",
                align: "center",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 50,
            },
            // {
            //     text: "รหัส",
            //     datafield: "Order_ID",
            //     align: "center",
            //     cellsalign: "center",
            //     width: 80,
            // },
            // {
            //     text: "รายการ",
            //     datafield: "Order_Detail",
            //     align: "center",
            //     minwidth: 200,
            // },
            {
                text: "ราคา",
                datafield: "Order_Price",
                align: "center",
                cellsalign: "right",
                width: 70,
                rendered: tooltiprenderer,
                cellsformat: "c0",
            },
            {
                text: "DF แพทย์",
                datafield: "Order_DF",
                align: "center",
                cellsalign: "right",
                width: 80,
                rendered: tooltiprenderer,
                cellsformat: "c0",
            },
            {
                text: "Urgency",
                datafield: "UG_Type_Name",
                align: "center",
                cellsalign: "center",
                filtertype: "checkedlist",
                rendered: tooltiprenderer,
                width: 100,
            },
            {
                text: "Description",
                datafield: "Case_StudyDESC",
                align: "center",
                rendered: tooltiprenderer,
                width: 120,
            },
            {
                text: "Protocol",
                datafield: "ProtocolName",
                align: "center",
                rendered: tooltiprenderer,
                minwidth: 180,
            },
            {
                text: "Modality",
                datafield: "Modality",
                align: "center",
                width: 70,
                rendered: tooltiprenderer,
                filtertype: "checkedlist",
            },
        ],
    });
    gridCaseActive();


    /////////////////////////////// New Custom Column /////////////////////////////////////

    var listSource = [{
        label: 'Row',
        value: 'Row',
        checked: true
    },
    {
        label: 'Accept',
        value: 'Accept',
        checked: true
    },
    {
        label: 'Reject',
        value: 'Reject',
        checked: true
    },
    {
        label: 'Time',
        value: 'Case_DateUpdate',
        checked: true
    },
    {
        label: 'สถานะ',
        value: 'CASE_STATUS_Name',
        checked: true
    },
    {
        label: 'วันที่',
        value: 'Case_DateUpdates',
        checked: true
    },
    {
        label: 'โรงพยาบาล',
        value: 'Hos_Name',
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
    // {
    //     label: 'รหัส',
    //     value: 'Order_ID',
    //     checked: true
    // },
    // {
    //     label: 'รายการ',
    //     value: 'Order_Detail',
    //     checked: true
    // },
    {
        label: 'ราคา',
        value: 'Order_Price',
        checked: true
    },
    {
        label: 'DF แพทย์',
        value: 'Order_DF',
        checked: true
    },
    {
        label: 'Urgency',
        value: 'UG_Type_Name',
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


    ////////////////////////////////////////////////////////////////////////////////////////////

    // $("#AcceptCase").on('click', function () {
    //     $("#ManageCase").hide();
    //     scrollToTop();

    //     if (Case_Status == '1') {
    //         SRAD_UPDATE_CASE_DOC(Case_ID, Case_TechID, vUserID, '2', '');
    //     } else {
    //         ShowNoti("Already Accepted", "warning");
    //     }

    // });

    

    $("#CancelCase").on("click", function () {
        var CaseStatus = $("#CaseStatus").val();
        AutoSaverespone(CaseStatus);
        gridCaseActive();

        $("#ManageCase").hide();
        scrollToTop();
        $("#DoctorID").val("");
        $("#TechID").val("");
        $("#vCaseID").val("");
        $("#RightID").val("");
        $("#sRights").html("");
        $("#GridCase").show();
        $("#HospitalDisPlay").show();
        $("#CaseActiveDisPlay").show();
    });
    $("#Respone").on("click", function () {
        var CaseID = $("#vCaseID").val();
        var TechID = $("#TechID").val();
        var DoctorID = $("#DoctorID").val();
        var txtRespone = $("#pRespone").val();
        var vTechUID = $("#TechUID").val();
        var vDocFullName = $("#vDocFullName").val();
        var vHosName = $("#PHos").html();
        var Patient_Name = $("#PName").html();
        var Modality = $("#HModality").html();
        var Description = $("#HCase").html();
        var ProtocolName = $("#HProtocol").html();
        let vMsgLine =
            "แพทย์รังสีส่งผลอ่าน" +
            "<br>" +
            "แพทย์รังสี : " +
            vDocFullName +
            "<br>" +
            "โรงพยาบาล : " +
            vHosName +
            "<br>" +
            "คนไข้ : " +
            Patient_Name +
            "<br>" +
            "Modality : " +
            Modality +
            "<br>" +
            "Description : " +
            Description +
            "<br>" +
            "Protocol : " +
            ProtocolName;

        LineNotiMsg(vTechUID, vMsgLine);
        SRAD_UPDATE_CASE_DOC(CaseID, TechID, vUserID, "3", txtRespone);
    });
    $("#ViewCase").on("click", function () {
        var url =
            "http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=" +
            Case_OrthancID;
        openInNewTab(url);
    });
    $("#DownLoadCase").on("click", function () {
        var url =
            "http://Radconnext:R@dconnext@103.91.189.94:8042/patients/" +
            Case_OrthancID +
            "/archive";
        openInNewTab(url);
    });

    $("#gridFileUpdate").jqxGrid({
        width: "100%",
        height: 185,
        //pageable: true,
        //pagerButtonsCount: 10,
        columnsResize: true,
        altrows: true,
        scrollmode: "logical",
        //autoheight: true,
        //showstatusbar: true,
        theme: theme,
        columns: [{
                text: "View",
                datafield: "View",
                columntype: "button",
                cellsalign: "center",
                width: 50,
                cellsrenderer: function () {
                    return "Load";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridFileUpdate").offset();

                    var dataRecord = $("#gridFileUpdate").jqxGrid("getrowdata", Editrow);
                    var vImage = dataRecord.Result_Path_IMG;

                    var url = vImage;
                    document.getElementById("vShowImg").src = url;
                    openInNewTab(url);
                },
            },
            {
                text: "ไฟล์",
                datafield: "Result_CASE_FileName",
                align: "center",
                minwidth: 50,
            },
            {
                text: "วันที่",
                datafield: "Result_CASE_DateUpdate",
                align: "center",
                width: 150,
            },
        ],
    });

    $("#gridFileUpdate").on("rowselect", function (event) {
        var vImage = event.args.row.Result_Path_IMG;
        var url = vImage;
        document.getElementById("vShowImg").src = url;
    });

    
    $("#AWaitAccept").change(function functionName() {
        if (vTypeID == "2") {
            ShowNoti("You have a new case wait accept.", "warning");
        }
    });

    //console.log(vRadiantPaht);
    $("#RadiantPaht").val(vRadiantPaht);
    $("#Radiant").click(function functionName() {
        var RDA = $("#RadiantPaht").val();
        var url = "radiant://?n=f&v=" + RDA + "\\" + Case_OrthancID + ".zip";
        console.log(url);
        window.open(url, "_top");
    });

    $("#TemplateTab").on("click", function() {
        if( $("#gridTemplate").height() > 40 ){
            $("#gridTemplate").height(30);
        }else{
            $("#gridTemplate").height(320);
        }
    });

    $("#gridTemplate").jqxGrid({
        width: "100%",
        height: 320,
        sortable: true,
        filterable: true,   
        //showfilterrow: true,
        //showstatusbar: true,
        autoShowLoadElement: false,
        theme: theme,
        columns: [{
            text: "Template",
            datafield: "Template_Code",
            align: "center",
            minwidth: 100,
        }, ],
    });

    $("#gridTemplate").on("rowselect", function (event) {
        let pRow = event.args.row;
        var Template_Text = pRow.Template_Text;
        var Template_Code = pRow.Template_Code;

        var vText = $("#pRespone").val();
        if (vText == "") {
            $("#pRespone").val(Template_Text);
        } else {
            $("#pRespone").val(vText + "\n\n" + Template_Text);
        }
        ShowNoti("เพิ่ม " + Template_Code + " เสร็จสิ้น", "warning");
    });

    // $("#pRespone").on("click", function () {
    //     $("#gridTemplate").jqxGrid("clearselection");
    // });

    /// Assign Height 10Sep2563 ////

    $("#HistoryTab").on("click", function() {
        if ( $("#gridCasePatient").height() > 400 ){
            $("#gridCasePatient").jqxGrid({ height: 250 }); 
        }else{
            $("#gridCasePatient").jqxGrid({ height: 500 }); 
        }
    });

    

    ////////////////////////// New Editor //////////////////////////////////////
    $('#pRespone').jqxEditor({
        height: 320,
        width: "100%",
        tools: 'bold | italic | underline | left | center | right | outdent | indent | size | ul | ol | zoom | datetime | print | template | clear',
        createCommand: function (name) {
            switch (name) {
                case "clear":
                    return {
                        type: 'button',
                        tooltip: 'Clear',
                        init: function (widget) {
                            widget.jqxButton({ width: 80 });
                            widget.html("<span style='line-height: 24px;'>Clear</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#pRespone').val('');
                        }
                    };
                case "size":
                    return {
                        init: function (widget) {
                            widget.jqxDropDownList({
                                source: [
                                    { label: "VerySmall (10)", value: "x-small" },
                                    { label: "Small (14)", value: "medium" },
                                    { label: "Normal (18)", value: "large" },
                                    { label: "Large (24)", value: "x-large" }
                                ]
                            });
                        }
                    };
                case "datetime":
                    return {
                        type: 'list',
                        tooltip: "Insert Date/Time",
                        init: function (widget) {
                            widget.jqxDropDownList({ placeHolder: "Time&Date", width: 160, source: ['Insert Time', 'Insert Date'], autoDropDownHeight: true });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                            widget.jqxDropDownList('clearSelection');
                        },
                        action: function (widget, editor) {
                            var widgetValue = widget.val();
                            var date = new Date();
                            // return object with command and value members.
                            return { command: "inserthtml", value: widgetValue == "Insert Time" ? date.getHours() + ":" + date.getMinutes() : date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() };
                        }
                    };
                case "template":
                    return{
                        type: 'button',
                        tooltip: 'เปิดหรือปิดเทมเพลต',
                        init: function (widget) {
                            widget.jqxButton({ width: 100 });
                            widget.html("<span style='line-height: 24px;'>Template</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            if( $("#gridTemplate").height() > 40 ){
                                $("#gridTemplate").height(30);
                            }else{
                                $("#gridTemplate").height(320);
                            }
                        }
                    };
                case "zoom":
                    // var current_height = 318;
                    // var current_width = 1022.5; //$('#pRespone').width(); 
                    // var new_height;
                    // var new_width;
                    return{
                        type: 'list',
                        tooltip: "ขยายขนาด",
                        init: function (widget) {
                            widget.jqxDropDownList({
                                placeHolder: "Zoom",
                                width: 100,
                                autoDropDownHeight: true,
                                source: [
                                    { label: "100%", value: 1 },
                                    { label: "150%", value: 1.5 },
                                    { label: "200%", value: 2.0 },
                                    { label: "300%", value: 3.0 }
                                ]
                            });
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            var widgetValue = widget.val();
                            //console.log(widgetValue);
                            editor.css("zoom", widgetValue);
                        }
                    };
                case "print":
                    return {
                        type: 'button',
                        tooltip: 'Print',
                        init: function (widget) {
                            widget.jqxButton({ width: 50 });
                            widget.html("<span style='line-height: 23px;'>Print</span>");
                        },
                        refresh: function (widget, style) {
                            // do something here when the selection is changed.
                        },
                        action: function (widget, editor) {
                            // return nothing and perform a custom action.
                            $('#pRespone').jqxEditor('print');
                        }
                    };
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////

    $("#gridCasePatient").jqxGrid({
        width: "100%",
        height: 250, //// Default 550
        sortable: true,
        altrows: true,
        filterable: true,
        showfilterrow: true,
        //showstatusbar: true,
        //statusbarheight: 24,
        //showaggregates: true,
        autorowheight: true,
        columnsresize: true,
        columnsreorder: true,
        pageable: true,
        pagesize: 10,
        scrollmode: "logical",
        autoShowLoadElement: false,
        pagesizeoptions: ["10", "20", "50", "100", "500"],
        theme: theme,
        columns: [{
                text: "#",
                datafield: "Row",
                align: "center",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 35,
            },
            {
                text: "สถานะ",
                datafield: "CASE_STATUS_Name",
                align: "center",
                cellsalign: "center",
                filtertype: "checkedlist",
                cellsrenderer: cellsrenderer,
                rendered: tooltiprenderer,
                width: 100,
            },
            {
                text: "วันที่",
                datafield: "Case_DateUpdates",
                align: "center",
                cellsalign: "center",
                cellsformat: "dd MMM yyyy HH:mm:ss",
                filtertype: "range",
                rendered: tooltiprenderer,
                width: 90,
            },
            {
                text: "โรงพยาบาล",
                datafield: "Hos_Name",
                align: "center",
                filtertype: "checkedlist",
                rendered: tooltiprenderer,
                width: 180,
            },
            {
                text: "#HN",
                datafield: "Patient_HN",
                align: "center",
                rendered: tooltiprenderer,
                width: 100,
            },
            {
                text: "ผู้รับการตรวจ",
                datafield: "FullName",
                align: "center",
                rendered: tooltiprenderer,
                width: 250,
            },
            {
                text: "เพศ",
                datafield: "Patient_Sex_TH",
                align: "center",
                cellsalign: "center",
                filtertype: "checkedlist",
                rendered: tooltiprenderer,
                width: 50,
            },
            {
                text: "อายุ",
                datafield: "Patient_Age",
                align: "center",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 50,
            },
            {
                text: "รหัส",
                datafield: "Order_ID",
                align: "center",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 80,
            },
            {
                text: "รายการ",
                datafield: "Order_Detail",
                align: "center",
                rendered: tooltiprenderer,
                minwidth: 200,
            },
            //{ text: 'ราคา', datafield: 'Order_Price', align: 'center', cellsalign: 'right', width: 70, cellsformat: 'c0'},
            //{ text: 'DF แพทย์', datafield: 'Order_DF', align: 'center', cellsalign: 'right', width: 80, cellsformat: 'c0'},
            //{ text: 'Urgency', datafield: 'UG_Type_Name', align: 'center', cellsalign: 'center', filtertype: 'checkedlist', width: 100},
            {
                text: "Description",
                datafield: "Case_StudyDESC",
                align: "center",
                rendered: tooltiprenderer,
                width: 120,
            },
            {
                text: "Protocol",
                datafield: "ProtocolName",
                align: "center",
                rendered: tooltiprenderer,
                minwidth: 180,
            },
            {
                text: "Modality",
                datafield: "Modality",
                align: "center",
                width: 70,
                rendered: tooltiprenderer,
                filtertype: "checkedlist",
            },
            {
                text: "เปิดภาพ",
                datafield: "View",
                align: "center",
                columntype: "button",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 60,
                cellsrenderer: function (row) {
                    return "เปิดภาพ";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridCasePatient").offset();

                    var dataRecord = $("#gridCasePatient").jqxGrid("getrowdata", Editrow);
                    var Case_OrthancID = dataRecord.Case_OrthancID;

                    var url =
                        "http://Radconnext:R@dconnext@103.91.189.94:8042/osimis-viewer/app/index.html?study=" +
                        Case_OrthancID;
                    openInNewTab(url);
                },
            },
            {
                text: "โหลด",
                datafield: "Load",
                align: "center",
                columntype: "button",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 60,
                cellsrenderer: function (row) {
                    return "โหลด";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridCasePatient").offset();

                    var dataRecord = $("#gridCasePatient").jqxGrid("getrowdata", Editrow);
                    var Case_OrthancID = dataRecord.Case_OrthancID;

                    var url =
                        "http://Radconnext:R@dconnext@103.91.189.94:8042/patients/" +
                        Case_OrthancID +
                        "/archive";
                    openInNewTab(url);
                },
            },
            {
                text: "ผลอ่าน",
                datafield: "DocResp",
                align: "center",
                columntype: "button",
                cellsalign: "center",
                rendered: tooltiprenderer,
                width: 60,
                cellsrenderer: function (row) {
                    return "ผลอ่าน";
                },
                buttonclick: function (row) {
                    Editrow = row;
                    var offset = $("#gridCasePatient").offset();

                    var dataRecord = $("#gridCasePatient").jqxGrid("getrowdata", Editrow);
                    var CaseID = dataRecord.Case_ID;

                    var url = "sapi/rad_report.php?CaseID=" + CaseID;
                    openInNewTab(url);
                },
            },
        ],
    });

    setTimeout( function() {
        /////////////////// New Code jqxTooltip //////////////////////////////////////////////////
        $("#ViewCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เปิดภาพ' });
        $("#Radiant").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Radiant' });
        $("#DownLoadCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ดาวน์โหลด' });
        $("#AcceptCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'รับอ่านผล' });
        $("#Reject").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ปฏิเสษ' });
        $("#Respone").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ส่งผลอ่าน' });
        $("#CancelCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ออก' });
        $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
        $("#HistoryTab").jqxTooltip({ showDelay: 1000, position: 'top', content: 'คลิกเพื่อแสดงประวัติการตรวจทั้งหมด' });
        $("#TemplateTab").jqxTooltip({ showDelay: 1000, position: 'top', content: 'คลิกเพื่อซ่อนหรือแสดงเทมเพลตทั้งหมด' });

        // $("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
        $("#row00gridCaseActive").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(12).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(15).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        $("#row00gridCaseActive").children().eq(16).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        

        // $("#row00gridCasePatient").children().eq(2).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
        // $("#row00gridCasePatient").children().eq(4).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(9).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        // $("#row00gridCasePatient").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
        

    }, 3000);
    
});

// $("#gridActiveCase").ready( function() {
//     /////////////////// New Code jqxTooltip //////////////////////////////////////////////////
//     $("#ViewCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'เปิดภาพ' });
//     $("#Radiant").jqxTooltip({ showDelay: 1000, position: 'top', content: 'Radiant' });
//     $("#DownLoadCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ดาวน์โหลด' });
//     $("#AcceptCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'รับอ่านผล' });
//     $("#Reject").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ปฏิเสษ' });
//     $("#Respone").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ส่งผลอ่าน' });
//     $("#CancelCase").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ออก' });
//     $("#openButton").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ตั้งค่าการแสดง column' });
//     $("#PatientHistoryTab").jqxTooltip({ showDelay: 1000, position: 'top', content: 'คลิกเพื่อแสดงประวัติการตรวจทั้งหมด' });
//     //$("#columntablegridCaseActive").jqxTooltip({ showDelay: 1000, position: 'top', content: 'ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง' });
//     // $("#row00gridCaseActive").children().eq(5).jqxTooltip({ showDelay: 1000, position: 'top', content: 'เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง' });
//     // $("#row00gridCaseActive").children().eq(7).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(8).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(10).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(11).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(12).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(15).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     // $("#row00gridCaseActive").children().eq(16).jqxTooltip({ showDelay: 1000, position: 'top', content: 'ใส่ค่าที่ต้องการค้นหา' });
//     $("#columntablegridCaseActive").attr("title", "ลากเพื่อย้ายตำแหน่งหรือลากขอบเพื่อปรับความกว้าง");
//     $("#row00gridCaseActive").children().eq(5).attr("title", "เลือกวันที่เริ่มต้นและวันที่สุดท้ายที่ต้องการให้แสดง");
//     $("#row00gridCaseActive").children().eq(7).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(8).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(10).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(11).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(12).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(15).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     $("#row00gridCaseActive").children().eq(16).attr("title", "ใส่ค่าที่ต้องการค้นหา");
//     //////////////////////////////////////////////////////////////////////////////////
// });

function LoopLoad(vTotalCase) {
    setInterval(function () {
        GetTotalCase();
        var ChkRe = false;
        var ChkvTotalCase = $("#sTotalCase").html();
        var ChkvNewCase = $("#sNewCase").html();
        var ChkvWaitAccept = $("#AWaitAccept").html();
        var ChkvAccepted = $("#AResponed").html();

        if (vTotalCase != ChkvTotalCase) {
            ChkRe = true;
            try {
                gridCaseActive();
            } catch {
                location.reload();
            }
        }

        if (vNewCase != ChkvNewCase && !ChkRe) {
            gridCaseActive();
        }

        if (vWaitAccept != ChkvWaitAccept && !ChkRe) {
            gridCaseActive();
        }

        if (vAccepted != ChkvAccepted && !ChkRe) {
            gridCaseActive();
        }

        vTotalCase = $("#sTotalCase").html();
        vNewCase = $("#sNewCase").html();
        vWaitAccept = $("#AWaitAccept").html();
        vAccepted = $("#AResponed").html();
    }, 1000 * 3);
}

function CheckCaseStatus(Case_Status) {
    if (Case_Status != "0" && (vTypeID == "3" || vTypeID == "1")) {
        $("#frmSaveCase").hide();
    } else {
        $("#frmSaveCase").show();
    }
}

function scrollToTop() {
    //$('#gridCaseActive').jqxGrid('clearselection');
    window.scrollTo(0, 0);
}

function openInNewTab(url) {
    var win = window.open(url, "_blank");
    win.focus();
}

function gridCaseActive() {
    var act = "SRAD_GET_CASE";
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        User_ID: vUserID,
        Type: vType,
    };

    var source = {
        type: "GET",
        datatype: "json",
        datafields: [{
                name: "Row",
                type: "number",
            },
            {
                name: "Case_ID",
                type: "string",
            },
            {
                name: "Hos_ID",
                type: "string",
            },
            {
                name: "Hos_OrthancID",
                type: "string",
            },
            {
                name: "Hos_Name",
                type: "string",
            },
            {
                name: "Case_OrthancID",
                type: "string",
            },
            {
                name: "Case_ParentPatient",
                type: "string",
            },
            {
                name: "Case_StudyDESC",
                type: "string",
            },
            {
                name: "Case_Status",
                type: "string",
            },
            {
                name: "CASE_STATUS_Name",
                type: "string",
            },
            {
                name: "CASE_STATUS_Name_TH",
                type: "string",
            },
            {
                name: "Case_UrgentType",
                type: "string",
            },
            {
                name: "UG_Type_Name",
                type: "string",
            },
            {
                name: "UrgentTime",
                type: "string",
            },
            {
                name: "Case_TechID",
                type: "string",
            },
            {
                name: "Case_DoctorID",
                type: "string",
            },
            {
                name: "DocFullName",
                type: "string",
            },
            {
                name: "Patient_HN",
                type: "string",
            },
            {
                name: "Patient_Name",
                type: "string",
            },
            {
                name: "Patient_LastName",
                type: "string",
            },
            {
                name: "FullName",
                type: "string",
            },
            {
                name: "Patient_CitizenID",
                type: "string",
            },
            {
                name: "Patient_Birthday",
                type: "string",
            },
            {
                name: "Patient_Age",
                type: "string",
            },
            {
                name: "Patient_Sex",
                type: "string",
            },
            {
                name: "Patient_Sex_TH",
                type: "string",
            },
            {
                name: "TreatmentRights_ID",
                type: "string",
            },
            {
                name: "TreatmentRights_Name",
                type: "string",
            },
            {
                name: "Patient_Doctor",
                type: "string",
            },
            {
                name: "BodyPartExamined",
                type: "string",
            },
            {
                name: "Modality",
                type: "string",
            },
            {
                name: "Manufacturer",
                type: "string",
            },
            {
                name: "ProtocolName",
                type: "string",
            },
            {
                name: "SeriesDescription",
                type: "string",
            },
            {
                name: "PerformedProcedureStepDescription",
                type: "string",
            },
            {
                name: "StationName",
                type: "string",
            },
            {
                name: "Order_ID",
                type: "string",
            },
            {
                name: "Order_Detail",
                type: "string",
            },
            {
                name: "Order_Unit",
                type: "string",
            },
            {
                name: "Order_Price",
                type: "number",
            },
            {
                name: "Order_DF",
                type: "number",
            },
            {
                name: "Case_DocRespone",
                type: "string",
            },
            {
                name: "Case_DateUpdate",
                type: "string",
            },
            {
                name: "Case_DateUpdates",
                type: "date",
            },
            {
                name: "Case_DateInsert",
                type: "string",
            },
        ],
        url: url,
        data: pData,
    };
    var dataAdapter = new $.jqx.dataAdapter(source);

    /*try{
        $('#gridCaseActive').jqxGrid('clearselection');
      }
      catch{
        location.reload();
      }*/

    try {
        $("#gridCaseActive").jqxGrid({
            source: dataAdapter,
        });
        $("#gridCaseActive").jqxGrid("clearselection");
    } catch {
        location.reload();
    }
}

function gridCasePatient(PatientHN) {
    var act = "SRAD_GET_CASE_PATIENT";
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        Patient_HN: PatientHN,
        Type: vType,
    };

    var source = {
        type: "GET",
        datatype: "json",
        datafields: [{
                name: "Row",
                type: "number",
            },
            {
                name: "Case_ID",
                type: "string",
            },
            {
                name: "Hos_ID",
                type: "string",
            },
            {
                name: "Hos_OrthancID",
                type: "string",
            },
            {
                name: "Hos_Name",
                type: "string",
            },
            {
                name: "Case_OrthancID",
                type: "string",
            },
            {
                name: "Case_ParentPatient",
                type: "string",
            },
            {
                name: "Case_StudyDESC",
                type: "string",
            },
            {
                name: "Case_Status",
                type: "string",
            },
            {
                name: "CASE_STATUS_Name",
                type: "string",
            },
            {
                name: "CASE_STATUS_Name_TH",
                type: "string",
            },
            {
                name: "Case_UrgentType",
                type: "string",
            },
            {
                name: "UG_Type_Name",
                type: "string",
            },
            {
                name: "UrgentTime",
                type: "string",
            },
            {
                name: "Case_TechID",
                type: "string",
            },
            {
                name: "Case_DoctorID",
                type: "string",
            },
            {
                name: "DocFullName",
                type: "string",
            },
            {
                name: "Patient_HN",
                type: "string",
            },
            {
                name: "Patient_Name",
                type: "string",
            },
            {
                name: "Patient_LastName",
                type: "string",
            },
            {
                name: "FullName",
                type: "string",
            },
            {
                name: "Patient_CitizenID",
                type: "string",
            },
            {
                name: "Patient_Birthday",
                type: "string",
            },
            {
                name: "Patient_Age",
                type: "string",
            },
            {
                name: "Patient_Sex",
                type: "string",
            },
            {
                name: "Patient_Sex_TH",
                type: "string",
            },
            {
                name: "TreatmentRights_ID",
                type: "string",
            },
            {
                name: "TreatmentRights_Name",
                type: "string",
            },
            {
                name: "Patient_Doctor",
                type: "string",
            },
            {
                name: "BodyPartExamined",
                type: "string",
            },
            {
                name: "Modality",
                type: "string",
            },
            {
                name: "Manufacturer",
                type: "string",
            },
            {
                name: "ProtocolName",
                type: "string",
            },
            {
                name: "SeriesDescription",
                type: "string",
            },
            {
                name: "PerformedProcedureStepDescription",
                type: "string",
            },
            {
                name: "StationName",
                type: "string",
            },
            {
                name: "Order_ID",
                type: "string",
            },
            {
                name: "Order_Detail",
                type: "string",
            },
            {
                name: "Order_Unit",
                type: "string",
            },
            {
                name: "Order_Price",
                type: "number",
            },
            {
                name: "Order_DF",
                type: "number",
            },
            {
                name: "Case_DocRespone",
                type: "string",
            },
            {
                name: "Case_DateUpdate",
                type: "string",
            },
            {
                name: "Case_DateUpdates",
                type: "date",
            },
            {
                name: "Case_DateInsert",
                type: "string",
            },
        ],
        url: url,
        data: pData,
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridCasePatient").jqxGrid({
        source: dataAdapter,
    });
}

function gridTemplate(UserID) {
    var act = "SRAD_MSG_TEMPLATE";
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        User_ID: UserID,
        SQL_ACTION: "SEC",
    };

    var source = {
        type: "POST",
        datatype: "json",
        datafields: [{
                name: "Template_ID",
                type: "string",
            },
            {
                name: "Template_Code",
                type: "string",
            },
            {
                name: "User_ID",
                type: "string",
            },
            {
                name: "Template_Text",
                type: "string",
            },
        ],
        id: "id",
        url: url,
        data: pData,
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridTemplate").jqxGrid({
        source: dataAdapter,
    });
}

function SRAD_SEC_FILE(CaseID) {
    var act = "SRAD_SEC_FILE";
    var url = "sapi/api.class.php?action=" + act;
    //ar CaseID = $("#vCaseID").val();
    var pData = {
        Case_ID: CaseID,
    };

    var source = {
        type: "GET",
        datatype: "json",
        datafields: [{
                name: "Result_CASE_ID",
                type: "number",
            },
            {
                name: "CASE_ID",
                type: "number",
            },
            {
                name: "Result_CASE_FileName",
                type: "string",
            },
            {
                name: "Result_CASE_Type",
                type: "string",
            },
            {
                name: "Result_CASE_Size",
                type: "string",
            },
            {
                name: "Result_Path_IMG",
                type: "string",
            },
            {
                name: "Result_CASE_DateUpdate",
                type: "string",
            },
        ],
        url: url,
        data: pData,
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#gridFileUpdate").jqxGrid({
        source: dataAdapter,
    });
}

function SRAD_UPDATE_CASE_DOC(
    CaseID,
    TechID,
    DoctorID,
    CaseStatus,
    Case_DocRespone
) {
    var act = "SRAD_UPDATE_CASE_DOC";
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        CaseID: CaseID,
        TechID: TechID,
        DoctorID: DoctorID,
        CaseStatus: CaseStatus,
        CaseDocRespone: Case_DocRespone,
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            if (data.Response == "success") {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti(vMsg, "success");

                    if (CaseStatus == "1") {
                        $("#frmSaveCase").hide();
                    }

                    $("#DoctorID").val("");
                    $("#TechID").val("");
                    $("#vCaseID").val("");
                    $("#RightID").val("");
                    $("#sRights").html("");
                    $("#ManageCase").hide();
                    $("#GridCase").show();
                    $("#HospitalDisPlay").show();
                    $("#CaseActiveDisPlay").show();
                    let vModality = $("#HModality").html();
                    let vHCase = $("#HCase").html();
                    let vHProtocol = $("#HProtocol").html();
                    let vHHopital = $("#PHos").html();
                    let vUrgentType = $("#sUrgentType").html();
                    let vPatientName = $("#vName").val() + " " + $("#vLName").val();
                    let vCaseID = $("#vCaseID").html();

                    let vDocUID = $("#vDoc_UID").val();
                    let vMsgLine =
                        "แพทย์รังสีตอบผล" +
                        "<br>" +
                        "แพทย์รังสี : " +
                        DocFullName +
                        "<br>" +
                        "โรงพยาบาล : " +
                        Hos_Name +
                        "<br>" +
                        "คนไข้ : " +
                        Patient_Name +
                        "<br>" +
                        "Modality : " +
                        Modality +
                        "<br>" +
                        "Description : " +
                        Description +
                        "<br>" +
                        "Protocol : " +
                        ProtocolName;

                    LineNotiMsg(vDocUID, vMsgLine);

                    gridCaseActive();
                } else {
                    ShowNoti(vResult, "danger");
                }
            }
        },
    });
}

function SRAD_UPDATE_CASE_DOC_AUTO(
    CaseID,
    TechID,
    DoctorID,
    CaseStatus,
    Case_DocRespone
) {
    var act = "SRAD_UPDATE_CASE_DOC";
    var url = "sapi/api.class.php?action=" + act;
    var pData = {
        CaseID: CaseID,
        TechID: TechID,
        DoctorID: DoctorID,
        CaseStatus: CaseStatus,
        CaseDocRespone: Case_DocRespone,
    };

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        data: pData,
        success: function (data) {
            if (data.Response == "success") {
                var vResult = data.data[0].Result;
                var vMsg = data.data[0].Msg;

                if (vResult == "Success") {
                    ShowNoti("Auto Save", "success");
                } else {
                    ShowNoti(vResult, "danger");
                }
            }
        },
    });
}

function FromTypecheck(Case_Status) {
    if (vTypeID == "2") {
        $("#frmSaveCase").hide();
        $("#frmRespone").hide();
        $("#pRespone").jqxEditor({
            disabled: true,
        });

        $("#PMFileImage").hide();
        $("#DMFileImage").show();

        if (Case_Status == "2" || Case_Status == "3") {
            $("#frmAccept").hide();
            $("#frmCancelAccept").hide();
        } else {
            $("#frmAccept").show();
            $("#frmCancelAccept").show();
        }

        if (Case_Status == "2") {
            //$('#ViewCase').show();
            //$('#DownLoadCase').show();
            $("#frmRespone").show();
            $("#pRespone").jqxEditor({
                disabled: false,
            });
        }
    } else {
        $("#frmAccept").hide();
        $("#frmCancelAccept").hide();
        $("#PMFileImage").show();
        $("#DMFileImage").hide();
    }

    if (Case_Status != "0") {
        $("#vMtypeDetail").hide();
    } else {
        $("#frmAccept").hide();
        $("#frmCancelAccept").hide();
    }
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({
        height: "75px",
        width: "200px",
        template: Type,
        autoOpen: true,
        autoClose: true,
    });
    $("#Notification").jqxNotification("open");
}

$("#UploadImage").click(function () {
    //$('#UploadImage').jqxInput({disabled: true });
    var _file = document.getElementById("vFileImage");
    var CaseID = $("#vCaseID").val();
    var data = new FormData();
    data.append("filUpload", _file.files[0]);

    var act = "SRAD_Upload";
    $.ajax({
        url: "sapi/api.img.class.php?action=" + act + "&Case_ID=" + CaseID,
        data: data,
        type: "POST",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            var vResponse = data.Response;
            var vMsg = data.data[0].Msg;
            if (vResponse == "success") {
                ShowNoti(vMsg, vResponse);
                $("#vFileImage").val("");
                SRAD_SEC_FILE(CaseID);
            } else {
                ShowNoti(vMsg, "warning");
                $("#vFileImage").val("");
            }
        },
    });
});

function AutoSaverespone(Case_Status) {
    var CaseID = $("#vCaseID").val();
    var TechID = $("#TechID").val();
    var DoctorID = $("#DoctorID").val();
    var txtRespone = $("#pRespone").val();

    if (CaseID != "" && Case_Status == "2") {
        SRAD_UPDATE_CASE_DOC_AUTO(CaseID, TechID, vUserID, "2", txtRespone);
    }
}