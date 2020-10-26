/* main.js */
//const $ = require('jquery');
window.$ = window.jQuery = require('jquery');
//require('jquery-ui-browserify');
//$.mobile = require('jquery-mobile');

/////////////////// jqwidgets ////////////////////////////
require('./JavaScriptFile/jquery-3.5.1.min.js');
require('./JavaScriptFile/jqwidgets/jqx-all.js');
//require('./JavaScriptFile/jquery-1.11.1.min.js');

//////////////////////////////////////////////////////////////

require('./JavaScriptFile/jquery.cookie.js');
require('./JavaScriptFile/jquery-ex.js');
require('./JavaScriptFile/bootstrap.bundle.js');
//require('./JavaScriptFile/sb-admin-2.js');
require('./JavaScriptFile/sb-admin-2.min.js');
//require('./JavaScriptFile/fontawesome.js');
require('./JavaScriptFile/FontAweSomeFree5/js/all.js');
//require('./JavaScriptFile/FontAweSomeFree5/js/all.js');
//require('./JavaScriptFile/Sidebar.js');
require('./JavaScriptFile/uploadFile.js');
require('./JavaScriptFile/Utility.js');
//require('./JavaScriptFile/ContentHeader.js');

///////////////// Custom for user /////////////////

// const logout = require('./JavaScriptFile/logout.js')($);
// const login = require('./JavaScriptFile/login.js')($);
// const home = require('./mod/home.js')($);
// const cases = require('./mod/case.js')($);
// const doctor = require('./mod/doctor.js')($);
// const hospital = require('./mod/hospital.js')($);
// const urgent = require('./mod/urgent.js')($);
// const apiconnector = require('./mod/apiconnect.js')($);

/*
ต
*/

window.jQuery.cachedScript = function (url, options) {
	// Allow user to set any option except for dataType, cache, and url
	options = $.extend(options || {}, {
		dataType: "script",
		cache: true,
		url: url
	});

	// Use $.ajax() since it is more flexible than $.getScript
	// Return the jqXHR object so we can chain callbacks
	return jQuery.ajax(options);
};

window.jQuery.postCORS = function (url, data, func) {
	if (func == undefined) func = function () { };
	return $.ajax({
		type: 'POST',
		url: url,
		data: data,
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded',
		xhrFields: { withCredentials: true },
		success: function (res) { func(res) },
		error: function (err) {
			func({ err })
		}
	});
};

const cookieName = "redconnext";
const getUserTypeAPI = "https://localhost:4443/api/usertypes/options";
const postRegister = "https://localhost:4443/api/users";
const UserLogin = "https://localhost:4443/api/login";

var cookie, upwd, noti, wsm, wsl;

$(document).ready(function () {
	// var checktoken = false;
	$.ajaxSetup({headers: {'authorization': window.localStorage.getItem('token'),}});
	console.log('page on ready ...');
	$('#header').load('FormPHP/header.html', function () { });
	$('#footer').load('FormPHP/footer.html', function () { });
	var theme = 'energyblue';
	var User_UserID;
	var UserNameID;
	var User_FirstName;
	var User_LastName;
	var User_Type;
	var User_Status;
	var User_Phone;
	var User_LindID;
	var User_TypeID;
	var vTotalCase;
	var vTotalHos;
	var vNewCase;
	var vWaitAccept;
	var User_RadiantPath;
	
	initPage();

});

function initPage() {
	// var cookieValue = $.cookie(cookieName);
	// console.log('cookieValue = ' + cookieValue);
	var token = window.localStorage.getItem('token');
	console.log('token = ' + token);
	if (token) {
		//cookie = JSON.parse(cookieValue);
		// if (cookie && token) {
		// 	doLoadMainPage();
		// } else {
		// 	doLoadLogin();
		// }
		doLoadMainPage();
	} else {
		doLoadLogin();
	}
}
function doLoadMainPage() {
	//// TypeID 
	// User_TypeID = 1; //Admin
	// User_TypeID = 2; //Technician
	// User_TypeID = 3; //Accountant
	// User_TypeID = 4; //Radiologist
	// User_TypeID = 5; //RefferalDocter
	// User_TypeID = 6; //DepartmentPublicComputer
	// User_TypeID = 7; //Patient
	var function_name = "doLoadMainPage";
	console.log("function_name : " + function_name + " => start");
	//let paths = window.location.pathname.split('/');
	User_TypeID = window.localStorage.getItem('usertypeId');
	User_ID = window.localStorage.getItem('userinfoId');
	UserNameID = window.localStorage.getItem('username');

	console.log("User_TypeID = ", User_TypeID);
	
	//getUserinformation(UserNameID);
	
	let promise_getUserinformation = getUserinformation(UserNameID);
	promise_getUserinformation.then( (data) => {
		console.log("Success in promise_getUserinformation ");
	}).catch(function (error) {
		console.log("Error in promise_getUserinformation = " + error );
	}).finally(function () {
		console.log("Finally in promise_getUserinformation ");
	});


	if (User_TypeID == 1) {
		// Admin
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Admin");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			// $('#CaseContent').load('FormPHP/case_history.html', function () {
			// 	require('./JavaScriptFile/widgets/CaseHistory.js');
			// });

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
			
				require('./JavaScriptFile/Sidebar.js');
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				$('#RegisterPage').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/Register.html', function () {
						require("./JavaScriptFile/widgets/ManageUser.js");
					});
				});

				$('#MainMenu2').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/CaseHistory.html', function () {
						require("./JavaScriptFile/widgets/CaseHistory.js");
					});
				});

				$('#ManageHospitalPage').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/Hospital_Admin.html', function () {
						require("./JavaScriptFile/widgets/Hospital_Admin.js");
					});
					// $('#CaseContent').load('FormPHP/setting/hospital/form/main.html', function () {
					// 	require("./JavaScriptFile/setting/hospital/bundle.js");
					// });
				});

				$('#OrderListPage').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/OrderList.html', function () {
						require("./JavaScriptFile/widgets/OrderList.js");
					});
				});

				$('#MTechProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
						//getUserInfo(User_ID);
					});
				});

				$('#MTechHospital').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/Hospital.html', function () {
						require("./JavaScriptFile/widgets/Hospital.js");
					});
				});

				$('#RadiologistProfile').on('click', function () {
					//$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile_doctor.html', function () {
						require("./JavaScriptFile/widgets/profile_doctor.js");
					});
				});

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});

				//$('#UserName').html(User_FirstName);
				//$('#LastName').html(User_LastName);
				//$('#UserType').html(User_Type);
				
			});

		});

	} else if (User_TypeID == 2 ) {
		//Technician
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID  + " => Technician");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			$('#CaseContent').load('FormPHP/CaseActiveTech.html', function () {
				require('./JavaScriptFile/widgets/CaseActiveTech.js');
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				require('./JavaScriptFile/Sidebar.js');
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				SideBarLink();

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});
				//$('#UserName').html(User_FirstName);
				//$('#LastName').html(User_LastName);
				//$('#UserType').html(User_Type);
			});

		});
		
	} else if (User_TypeID == 3) {
		//Accountant
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Accountant");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			$('#CaseContent').load('FormPHP/Account.html', function () {
				require('./JavaScriptFile/widgets/Account.js');
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				require('./JavaScriptFile/Sidebar.js');

				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				SideBarLink();

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});
				//$('#UserName').html(User_FirstName);
				//$('#LastName').html(User_LastName);
				//$('#UserType').html(User_Type);
			});

		});
	} else if (User_TypeID == 4) {
		//Radiologist
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Radiologist");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			$('#CaseContent').load('FormPHP/CaseActiveDoctor.html', function () {
				require('./JavaScriptFile/widgets/CaseActiveDoctor.js');
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				require('./JavaScriptFile/Sidebar.js');
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				SideBarLink();

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});
				//$('#UserName').html(User_FirstName);
				//$('#LastName').html(User_LastName);
				//$('#UserType').html(User_Type);
			});

		});

	} else if (User_TypeID == 5) {
		//RefferalDocter
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => RefferalDocter");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			$('#CaseContent').load('FormPHP/CaseActiveDoctor.html', function () {
				require('./JavaScriptFile/widgets/CaseActiveDoctor.js');
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				require('./JavaScriptFile/Sidebar.js');
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				SideBarLink();

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});
				
				//$('#UserName').html(User_FirstName);
				//$('#LastName').html(User_LastName);
				//$('#UserType').html(User_Type);
			});

		});

	} else if (User_TypeID == 6) {
		//DepartmentPublicComputer
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => DepartmentPublicComputer");

			$('#ContentHeader').load('FormPHP/ContentHeader.html', function () {
				require('./JavaScriptFile/ContentHeader.js');
			});

			$('#CaseContent').load('FormPHP/CaseHistory.html', function () {
				require('./JavaScriptFile/widgets/CaseHistory.js');
			});

			$('#SideBar').load('FormPHP/Sidebar.html', function () {
				require('./JavaScriptFile/Sidebar.js');
				$('#MessageNotification').load('FormPHP/MessageNotification.html', function () { });

				SideBarLink();

			});

			$('#Topbar').load('FormPHP/TopBar.html', function () {
				$("#LogOut").click(function () {
					console.log("#LogOut is click");
					doUserLogout();
				});

				$('#TopBarProfile').on('click', function () {
					$("#ContentHeader").hide();
					$('#CaseContent').load('FormPHP/profile.html', function () {
						require("./JavaScriptFile/widgets/profile.js");
					});
				});
				// $('#UserName').html(User_FirstName);
				// $('#LastName').html(User_LastName);
				// $('#UserType').html(User_Type);
			});

		});
	} else if (User_TypeID == 7) {
		//Patient
		$('#app').load('FormPHP/main.html', function () {

			console.log("User_TypeID = " + User_TypeID + " => Patient");

		});
	}
	
	console.log("function_name : " + function_name + " => end");
}

function doCallLoginApi(user) {
	return new Promise(function (resolve, reject) {
		const loginApiName = 'chk_login';
		const body = { username: user.username, password: user.password, };
		var realUrl = UserLogin;
		var params = { method: 'post', body: body, url: realUrl, apiname: loginApiName };

		console.log('apiName', loginApiName);
		console.log('body', body);
		console.log('realUrl', realUrl);
		console.log('params', params);

		APIUserLogin().then((response) => {
			console.log('response', response);
			resolve(response);
		}).catch((err) => {
			console.log(JSON.stringify(err));
		});
	});
}

function doLogin() {
	var function_name = "doLogin";
	console.log("function_name : " + function_name + " => start");
	var username = $("#pUserName").val();
	var password = $("#pPassword").val();

	console.log("Username=" + username, " password=" + password);
	// Checking for blank fields.
	if (username == '' || password == '' ) {
		$('input[type="text"],input[type="password"]').css("border", "2px solid red");
		$('input[type="text"],input[type="password"]').css("box-shadow", "0 0 3px red");
		$('#login-msg').html('<p>กรุณาใส่ UserName และ Password</p>');
		$('#login-msg').show();
	} else {
		let user = { username: username, password: password };
		console.log(user);
		doCallLoginApi(user).then((response) => {
			var resBody = JSON.parse(response.res.body);
			//var resBody = JSON.parse(response); <= ใช้ในกรณีเรียก API แบบ Direct

			console.log('resBody : ' + resBody);
			if (resBody.success == false) {
				$('input[type="text"]').css({ "border": "2px solid red", "box-shadow": "0 0 3px red" });
				$('input[type="password"]').css({ "border": "2px solid #00F5FF", "box-shadow": "0 0 5px #00F5FF" });
				$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
				$('#login-msg').show();
			} else {
				//Save resBody to cookie.
				console.log("Function: " + function_name + " resBody = "+ resBody);
				window.localStorage.setItem('token', resBody);
				$.cookie('token', JSON.stringify(resBody), { expires: 1 });
				//upwd = password;
				console.log('Save Token Success!');
				doLoadMainPage();
			}
		});
	}
	console.log("function_name : " + function_name + " => end");
}
function doRequestLogin(params) {
	var function_name = "doRequestLogin";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = UserLogin ;
		$.post(url, params, function (data) {
			resolve(data);
		}).fail(function (error) {
			
			console.log(JSON.stringify(error));
			reject(error);
		});
		console.log("function_name : " + function_name + " => end");
	});
}

function APIUserLogin() {
	return new Promise(function (resolve, reject) {
		var function_name = "APIUserLogin";
		console.log("function_name : " + function_name + " => start");
		let username = $('#pUserName').val();
		let password = $('#pPassword').val();
		let params = { username: username, password: password };

		if (username) {
			let password = $('#pPassword').val();
			let params = { username: username, password: password };
			doRequestLogin(params).then((resp) => {
				console.log("resp = " +  JSON.stringify(resp) );
				if (resp.status.code === 200) {
					//window.localStorage.setItem('token', resp.token);
					setTimeout(() => {
						console.log('resp.status.code = ' + resp.status.code);
						//window.location.href = resp.url;
						// if (resp.success == 'failed') {
						// 	//window.location.href = resp.url;
						// 	$('input[type="text"]').css({ "border": "2px solid red", "box-shadow": "0 0 3px red" });
						// 	$('input[type="password"]').css({ "border": "2px solid red", "box-shadow": "0 0 5px red" });
						// 	$('#login-msg').html('<p>Username or Password incorrect. Please try with other username and password again.</p>');
						// 	$('#login-msg').show();
						// }
						if (resp.success == true) {
							window.localStorage.setItem('token', resp.token);
							window.localStorage.setItem('hospitalId', resp.data.hospitalId);
							window.localStorage.setItem('userinfoId', resp.data.userinfoId);
							window.localStorage.setItem('username', resp.data.username);
							window.localStorage.setItem('userstatusId', resp.data.userstatusId);
							window.localStorage.setItem('usertypeId', resp.data.usertypeId);
							// $.cookie('token', JSON.stringify(resp.token), { expires: 1 });
							// upwd = password;
							// alert('resp.login === success');
							// $('#dialog').load('FormPHP/main.html', function () {});
							doLoadMainPage();
						}
					}, 500);
				} else if (resp.status.code === 210) {
					alert('Sorry, your accout have some problem.');
					setTimeout(() => {
						location.reload();
						console.log('resp.status.code = ' + resp.status.code);
					}, 500);
				} else {
					alert('Wrong Email and Password.');
					$('#pUserName').focus();
				}
			});
		} else {
			alert('Email not Empty allow.');
			$('#pUserName').focus();
		}

		console.log("function_name : " + function_name + " => end");
	});

}

function doLoadLogin() {
	$('#app').load('FormPHP/login.html', function () {
		$("#vLogin").click(function () {
			console.log("#vLogin is click");
			doLogin();
		});
		$("#pPassword").on('keypress', function (e) {
			if (e.which == 13) {
				doLogin();
			};
		});
	});
}

function doUserLogout() {
	const logoutApiName = 'logout';
	$.removeCookie('token');
	window.localStorage.removeItem('token');
	doLoadLogin();
}



function doShowHome() {
	$(".row").hide();
	$(".mainfull").show();
	$(".mainfull").empty();
	home.doLoadSummaryDoctor(cookie.username);
}

function doShowCase() {
	$(".row").hide();
	$(".mainfull").show();
	$(".mainfull").empty();
	cases.doLoadCasePage(cookie.username);
}

function doShowMainDoctor() {
	$(".row").show();
	$(".mainfull").hide();
	$(".submenu").empty();
	$(".submenu").show();
	$(".main").empty();
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="DoctorData-Cmd">ข้อมูลแพทย์</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="DoctorSchedule-Cmd">ตารางเวร</a></div>'));
	$("#DoctorData-Cmd").click(function () {
		$(".main").empty();
		$('body').loading('start');
		home.doCallSummaryDoctor(cookie.username).then((response) => {
			let drList = JSON.parse(response.res.body);
			doctor.doShowAllDoctor(drList, cookie.username, cookie.org[0].id);
			$('body').loading('stop');
		})
	});
	$("#DoctorSchedule-Cmd").click(function () {
		alert('#DoctorSchedule');
		$(".main").empty();
	});
	$("#DoctorData-Cmd").trigger("click");
}

function doShowMainHotpital() {
	$(".row").show();
	$(".mainfull").hide();
	$(".submenu").empty();
	$(".submenu").show();
	$(".main").empty();
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="HotpitalData-Cmd">ข้อมูลโรงพยาบาล</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="ReportForm-Cmd">Set Report Form</a></div>'));
	$(".submenu").append($('<div class="sub-menu-item"><a href="#" id="UrgentLevel-Cmd">Urgent Level</a></div>'));
	$("#HotpitalData-Cmd").click(function () {
		$(".main").empty();
		$('body').loading('start');
		home.doCallHospitalData(cookie.username).then((response) => {
			let hospData = JSON.parse(response.res.body);
			hospital.doShowHospitalData(hospData);
			$('body').loading('stop');
		});
	});
	$("#ReportForm-Cmd").click(function () {
		$(".main").empty();
		$('body').loading('start');
		$('head').append('<script src="lib/jquery-ui.min.js"></script>');
		$('head').append('<link rel="stylesheet" href="lib/jquery-ui.min.css" type="text/css" />');
		$('body').loading('start');
		$(".main").load('FormPHP/design.html', function (oo) {

			$('body').loading('stop');
		});
	});

	$("#UrgentLevel-Cmd").click(function () {
		$(".main").empty();
		$('body').loading('start');
		home.doCallUrgentData(cookie.username).then((response) => {
			let urgentData = JSON.parse(response.res.body);
			urgent.doShowUrgentData(urgentData.data, cookie.username);
			$('body').loading('stop');
		});
	});
	$("#HotpitalData-Cmd").trigger("click");
}

function doShowSetting() {
	$("#dialog").load('FormPHP/setting-dialog.html', function () {
		$(".modal-footer").css('text-align', 'center');
		$("#SaveSetting-Cmd").click(function () {
			doSaveSetting();
		});
	});
}

function doShowUserProfile() {
	$("#dialog").load('FormPHP/dialog.html', function () {
		$("#UserStaus").text(cookie.curr_status);
		$("#OrgName").text(cookie.org[0].name);
		$("#OrgName").text(cookie.org[0].name);
		$("#PositionName").val(cookie.org[0].position);
		$("#Username").text(cookie.username);
		$("#Password").val(upwd);
		$("#Name").val(cookie.name);
		$("#Telno").val(cookie.tel);
		$("#Email").val(cookie.email);
		$("#LineId").val(cookie.LineId);
		$("#Comment").val(cookie.comment);
		$(".modal-footer").css('text-align', 'center');
		$("#SaveUserProfile-Cmd").click(function () {
			doSaveUserProfile();
		});
	});
}

function doSaveUserProfile() {
	/*
	let positionName = $("#PositionName").val();
	let password = $("#Password").val();
	let name = $("#Name").val();
	let telno = $("#Telno").val();
	let email = $("#Email").val();
	let lineId = $("#LineId").val();
	let comment = $("#Comment").val();
	*/
	alert('Now have not support yet.');
	$("#myModal").css("display", "none");
}

function doSaveSetting() {
	alert('Now have not support yet.');
}

function doConnectWebsocketMaster(username) {
	const hostname = window.location.hostname;
	const port = window.location.port;
	const paths = window.location.pathname.split('/');
	const rootname = paths[1];

	let wsUrl = 'wss://' + hostname + ':' + port + '/' + rootname + '/' + username + '?type=test';
	wsm = new WebSocket(wsUrl);
	wsm.onopen = function () {
		console.log('Master Websocket is connected to the signaling server')
	};

	wsm.onmessage = function (msgEvt) {
		let data = JSON.parse(msgEvt.data);
		console.log(data);
		if (data.type == 'test') {
			$.notify(data.message, "success");
		} else if (data.type == 'trigger') {
			let message = { type: 'trigger', dcmname: data.dcmname };
			wsl.send(JSON.stringify(message));
			$.notify('The system will be start store dicom to your local.', "success");
		} else if (data.type == 'notify') {
			$.notify(data.message, "warnning");
		}
	};

	wsm.onclose = function (event) {
		console.log("Master WebSocket is closed now. with  event:=> ", event);
	};

	wsm.onerror = function (err) {
		console.log("Master WS Got error", err);
	};
}

function doConnectWebsocketLocal(username) {
	let wsUrl = 'ws://localhost:3000/webapp/' + username + '?type=test';
	wsl = new WebSocket(wsUrl);
	wsl.onopen = function () {
		console.log('Local Websocket is connected to the signaling server')
	};

	wsl.onmessage = function (msgEvt) {
		let data = JSON.parse(msgEvt.data);
		console.log(data);
		if (data.type == 'test') {
			$.notify(data.message, "success");
		} else if (data.type == 'result') {
			$.notify(data.message, "success");
		} else if (data.type == 'notify') {
			$.notify(data.message, "warnning");
		}
	};

	wsl.onclose = function (event) {
		console.log("Local WebSocket is closed now. with  event:=> ", event);
	};

	wsl.onerror = function (err) {
		console.log("Local WS Got error", err);
	};
}

function doGetCookie() {
	return cookie;
}

function getUserinformation(username){
	var function_name = "getUserinformation";
	console.log("function_name : " + function_name + " => start");
	return new Promise(function (resolve, reject) {
		var url = "https://localhost:4443/api/users/searchusername/" + username;
		$.get(url, "", function (data) {
			//resolve(data);
			console.log("data = ", data);
			if(data.status.code === 200){

				User_UserID = data.result[0].id;
				User_FirstName = data.result[0].userinfo.User_NameEN;
				User_LastName = data.result[0].userinfo.User_LastNameEN;
				User_Type = data.result[0].usertype.UserType_Name;
				User_Status = data.result[0].userstatus.UserStatus_Name;
				User_Phone = data.result[0].userinfo.User_Phone;
				User_LindID = data.result[0].userinfo.User_LineID;
				User_RadiantPath = data.result[0].userinfo.User_PathRadiant;
				User_Hospital_ID = data.result[0].hospitalId;
				User_Hospital_Name = data.result[0].hospital.Hos_Name;

				setTimeout( function() {
					$('#UserName').html(User_FirstName);
					$('#LastName').html(User_LastName);
					$('#UserType').html(User_Type);
				}, 1000);
				resolve(data);
				
			}else{
				console.log("Error Can't get Data in function: "+function_name);
			}
		}).fail(function (error) {
			console.log(JSON.stringify(error));
			reject(error);
		});

		console.log("function_name : " + function_name + " => end");
	});
}

function SideBarLink(){

	$('#RegisterPage').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/Register.html', function () {
			require("./JavaScriptFile/widgets/ManageUser.js");
		});
	});

	$('#MainMenu2').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/CaseHistory.html', function () {
			require("./JavaScriptFile/widgets/CaseHistory.js");
		});
	});

	$('#ManageHospitalPage').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/Hospital_Admin.html', function () {
			require("./JavaScriptFile/widgets/Hospital_Admin.js");
		});
	});

	$('#OrderListPage').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/OrderList.html', function () {
			require("./JavaScriptFile/widgets/OrderList.js");
		});
	});

	$('#MTechProfile').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/profile.html', function () {
			require("./JavaScriptFile/widgets/profile.js");
			//getUserInfo(User_ID);
		});
	});

	$('#MTechHospital').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/Hospital.html', function () {
			require("./JavaScriptFile/widgets/Hospital.js");
		});
	});

	$('#RadiologistProfile').on('click', function () {
		$("#ContentHeader").hide();
		$('#CaseContent').load('FormPHP/profile_doctor.html', function () {
			require("./JavaScriptFile/widgets/profile_doctor.js");
		});
	});

}

module.exports = {
	doGetCookie
}
