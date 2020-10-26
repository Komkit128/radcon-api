$(document).ready(function () {
    var theme = 'energyblue';
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});

    //getUser(vUserID);
    $("#gridHospital").jqxDataTable(
        {
            width: '100%',
            height: 265,
            pageable: true,
            pagerButtonsCount: 5,
            columnsResize: true,
            //filterable: true,
            //showstatusbar: true,
            autoShowLoadElement: false,
            theme: theme,
            columns: [
                { text: 'โรงพยาบาล', datafield: 'Hos_Name', align: 'center', minwidth: 100 }
                /*{ text: 'Hospital ID', datafield: 'Hos_OrthancID', align: 'center', width: 200}*/
            ]
        });

    $("#SaveUser").click(function functionName() {
        var UserID = $('#vUser_ID').val();
        UpdateUser(UserID);
    });

    $("#CancelUser").click(function functionName() {
        window.open('index.php', '_self');
    });

    $("#ChangePassword").click(function () {
        ChangePassword();
    });

    $("#TopBarProfile").click(function() {
        getUserInfo(User_UserID);
    });


    getUserInfo(User_UserID);
    gridHospital(User_UserID);

});

function gridHospital() {
    let function_name = 'gridHospital';
    let getUserTypeAPI = "https://localhost:4443/api/hospital/options";
    let params = [];
    return new Promise(function (resolve, reject) {
        console.log("function_name : " + function_name + " => start");
        var url = getUserTypeAPI;
        $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
        $.get(url, params, function (data) {
            var new_data = JSON.stringify(data);
            length = data["Options"].length;
            var databases = new Array();
            console.log("data = " + JSON.stringify(data["Options"][0].DisplayText));
            for (var i = 0; i < length; i++) {
                var row = {};
                row.Hos_Name = JSON.stringify(data["Options"][i].DisplayText);
                databases[i] = row;
            }
            var source =
            {
                localdata: databases,
                datatype: "array"
            };

            console.log("source = ", source);

            var dataAdapter = new $.jqx.dataAdapter(source);
            $("#gridHospital").jqxGrid({ source: dataAdapter });
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });

        console.log("function_name : " + function_name + " => end");

    });
}

// function getUser(UserID) {
//     var act = 'RadRegister';
//     var url = "sapi/api.class.php?action=" + act
//     var pData = {
//         UserID: UserID,
//         SQL_Action: 'SEI'
//     };

//     $.ajax({
//         type: "POST",
//         url: url,
//         dataType: "json",
//         data: pData,
//         success: function (data) {
//             if (data.Response == 'success') {
//                 var vUser_ID = data.data[0].User_ID;
//                 var vUser_UserName = data.data[0].User_UserName;
//                 var vUser_Password = data.data[0].User_Password;
//                 var vUser_Name = data.data[0].User_Name;
//                 var vUser_LastName = data.data[0].User_LastName;
//                 var vUser_Email = data.data[0].User_Email;
//                 var vUser_Phone = data.data[0].User_Phone;
//                 var vUser_LineID = data.data[0].User_LineID;
//                 var vUser_LineID_Code = data.data[0].User_LineID_Code;
//                 var vUserType_ID = data.data[0].UserType_ID;
//                 var vUser_Auth = data.data[0].User_Auth;
//                 var vUser_PathRadiant = data.data[0].User_PathRadiant;
//                 var vUser_Active = data.data[0].User_Active;

//                 $('#vUser_ID').val(vUser_ID);
//                 $('#vUser_UserName').val(vUser_UserName);
//                 $('#vUser_Password').val(vUser_Password);
//                 $('#vUser_Name').val(vUser_Name);
//                 $('#vUser_LastName').val(vUser_LastName);
//                 $('#vUser_Email').val(vUser_Email);
//                 $('#vUser_Phone').val(vUser_Phone);
//                 $('#vUser_LineID').val(vUser_LineID);
//                 $('#vUser_LineID_Code').val(vUser_LineID_Code);
//                 $('#vUser_PathRadiant').val(vUser_PathRadiant);
//                 $('#vUserType_ID').val(vUserType_ID);
//                 $('#vUser_Auth').val(vUser_Auth);
//                 $('#vUser_Active').val(vUser_Active);
//             }
//             else {
//                 var vResult = data.Response;
//                 ShowNoti(vResult, "danger");
//             }
//         }
//     });
// }

function getUserInfo(User_UserID){
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "getUserInfo";
    var params = "";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = "https://localhost:4443/api/users/" + User_UserID ;
		$.get(url, params, function (data) {
			//resolve(data);
            //console.log("data = ", data);
            console.log("data = ", data.user[0]);
            information = data.user[0];
            $("#vUser_ID").val(information.id);
            $("#vUser_InfoID").val(information.userinfo.id);
            $("#vUserType_ID").val(information.usertypeId);
            $('#vUser_UserName').val(information.username);
            $('#vUser_Password').val(information.userinfo.username);
            $('#vUser_Name_EN').val(information.userinfo.User_NameEN);
            $('#vUser_LastName_EN').val(information.userinfo.User_LastNameEN);
            $('#vUser_Name_TH').val(information.userinfo.User_NameTH);
            $('#vUser_LastName_TH').val(information.userinfo.User_LastNameTH);
            $('#vUser_Email').val(information.userinfo.User_Email);
            $('#vUser_Phone').val(information.userinfo.User_Phone);
            $('#vUser_LineID').val(information.userinfo.User_LineID);
            $('#vUser_HospitalID').val(information.hospitalId);
            //$('#vUser_LineID_Code').val(information.username);
            $('#vUser_PathRadiant').val(information.userinfo.User_PathRadiant);
            //$('#vUser_Auth').val(information.username);
            $('#vUser_Active').val(information.userstatus.UserStatus_Name);
            console.log("function_name : " + function_name + " => Success in get data");
		}).fail(function (error) {
			console.log(JSON.stringify(error));
			reject(error);
		});
		console.log("function_name : " + function_name + " => end");
	});
}

function UpdateUser(UserID) {
    $.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
    var function_name = "UpdateUser";
    var params = "";
	console.log("function_name : " + function_name + " => start");
    return new Promise(function (resolve, reject) {
        var url = "https://localhost:4443/api/user/update" ;
        var vUser_ID = UserID;
        var vUser_InfoID = $("#vUser_InfoID").val();
        var vUser_UserName = $('#vUser_UserName').val();
        var vUser_Name_EN = $('#vUser_Name_EN').val();
        var vUser_LastName_EN = $('#vUser_LastName_EN').val();
        var vUser_Name_TH = $('#vUser_Name_TH').val();
        var vUser_LastName_TH = $('#vUser_LastName_TH').val();
        var vUser_Email = $('#vUser_Email').val();
        var vUser_Phone = $('#vUser_Phone').val();
        var vUser_LineID = $('#vUser_LineID').val();
        var vUser_LineID_Code = $('#vUser_LineID_Code').val();
        var vUserType_ID = $('#vUserType_ID').val();
        var vUser_Auth = $('#vUser_Auth').val();
        var vUser_PathRadiant = $('#vUser_PathRadiant').val();
        var vUser_Active = $('#vUser_Active').val();
        var vUser_HospitalID = $('#vUser_HospitalID').val();

        console.log("vUser_ID = " + vUser_ID);
        console.log("vUser_InfoID = " + vUser_InfoID);
        console.log("vUser_UserName = " + vUser_UserName);
        console.log("vUser_Name_EN = " + vUser_Name_EN);
        console.log("vUser_LastName_EN = " + vUser_LastName_EN);
        console.log("vUser_Name_TH = " + vUser_Name_TH);
        console.log("vUser_LastName_TH = " + vUser_LastName_TH);
        console.log("vUser_Email = " + vUser_Email);
        console.log("vUser_Phone = " + vUser_Phone);
        console.log("vUser_LineID = " + vUser_LineID);
        console.log("vUserType_ID = " + vUserType_ID);
        console.log("vUser_PathRadiant = " + vUser_PathRadiant);
        console.log("vUser_HospitalID = " + vUser_HospitalID);

        var params = {
            id: vUser_InfoID,
            User_NameEN: vUser_Name_EN,
            User_LastNameEN: vUser_LastName_EN,
            User_NameTH: vUser_Name_TH,
            User_LastNameTH: vUser_LastName_TH,
            User_Email: vUser_Email,
            User_Phone: vUser_Phone,
            User_LineID: vUser_LineID,
            User_PathRadiant: vUser_PathRadiant,
            usertypeId: vUserType_ID,
            hospitalId: vUser_HospitalID,
            username: vUser_UserName,
            //password: vUser_Password,
        };

		$.post(url, params, function (data) {
            console.log("data = " + JSON.stringify(data) );
            if(data.Result == "OK"){
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลสำเร็จ");
                getUserInfo(vUser_ID);
            }else{
                $("#NotificatedChangeInfoUser").text("เปลี่ยนข้อมูลไม่สำเร็จ กรุณาตรวจสอบใหม่");
            }
        }).fail(function (error) {
            console.log(JSON.stringify(error));
            reject(error);
        });
        console.log("function_name : " + function_name + " => end");
    });
}

function ShowNoti(Msg, Type) {
    $("#MessageNoti").html(Msg);
    $("#Notification").jqxNotification({ template: Type });
    $("#Notification").jqxNotification("open");
}

function ChangePassword(){
    var vUser_ID = $('#vUser_ID').val();
    var vUser_UserName = $('#vUser_UserName').val();
    var vUser_Password = $('#vUser_Password').val();
    var OldPassword = $('#OldPassword').val();
    var NewPassword = $('#NewPassword').val();
    var ReTryNewPassword = $('#ReTryNewPassword').val();
    var function_name = "ChangePassword";
    $.ajaxSetup({ headers: { 'authorization': window.localStorage.getItem('token'), } });
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
        var url = "https://localhost:4443/api/users/changepassword" ;
        console.log("NewPassword = " + NewPassword);
        console.log("ReTryNewPassword = " + ReTryNewPassword);

        if(NewPassword === ReTryNewPassword){
            var params = {
                password: NewPassword
            };
            
            $.ajax({
                type: 'PUT',
                url: url, 
                data: params,  
                success: function (data){
                    resolve(data);
                    console.log("data = ", data);
                    if(data.status.code === 200){
                        $("#NewPassword").css("border", "1px solid #d1d3e2");
                        $("#ReTryNewPassword").css("border", "1px solid #d1d3e2");
                        $("#NotificatedChangePassword").text("เปลี่ยนรหัสผ่านสำเร็จ");
                    }else{
                        $("#NotificatedChangePassword").text("เปลี่ยนรหัสผ่านไม่สำเร็จ");
                        $("#NotificatedChangePassword").css("color", "red");
                    }   
                }
            }).fail(function (error) {
                console.log(JSON.stringify(error));
                reject(error);
            });

        }else{
            $("#NewPassword").css("border", "1px solid red");
            $("#ReTryNewPassword").css("border", "1px solid red");
            $("#NotificatedChangePassword").text("รหัสผ่านใหม่ไม่ตรงกัน");
        }

        
		console.log("function_name : " + function_name + " => end");
	});
}

module.exports = {
	getUserInfo
}