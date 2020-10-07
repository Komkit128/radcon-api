const Sequelize = require('sequelize');

const RadUserTypeDef = {
			UserType_Name :  {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			UserType_DESC :  {
				type: Sequelize.STRING,
			}
		};
const RadUserStatusDef = {
			UserStatus_Name :  {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			UserStatus_DESC :  {
				type: Sequelize.STRING,
			}
		};
//UserType_ID
//UserStatus_ID
//UserInfo_ID
//Hos_ID
const RadUserDef = {
			username  :  {
				type: Sequelize.STRING(80),
				unique: true,
				allowNull: false
			},
			password  :  {
				type: Sequelize.STRING,
				get() {
					return () => this.getDataValue('password')
				}
			},
			salt: {
				type: Sequelize.STRING,
				get() {
					return() => this.getDataValue('salt')
				}
			}
		};

const RadUserInfoDef = {
			User_NameEN :  {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			User_LastNameEN :  {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			User_NameTH :  {
				type: Sequelize.STRING(80)
			},
			User_LastNameTH :  {
				type: Sequelize.STRING(80)
			},
			User_Email :  {
				type: Sequelize.STRING(60)
			},
			User_Phone :  {
				type: Sequelize.STRING(40),
				allowNull: false
			},
			User_LineID :  {
				type: Sequelize.STRING(80)
			},
			User_PathRadiant : {
				type: Sequelize.STRING
			}
		};

const RadHospitalDef = {
			Hos_Name : {
				type: Sequelize.STRING(150),
				allowNull: false
			},
			Hos_Address : {
				type: Sequelize.STRING,
				allowNull: false
			},
			Hos_Tel : {
				type: Sequelize.STRING(80)
			},
			Hos_WebUrl : {
				type: Sequelize.STRING(80)
			},
			Hos_Contact : {
				type: Sequelize.STRING
			},
			Hos_Remark : {
				type: Sequelize.STRING
			},
			Hos_RootPathUri: {
				type: Sequelize.STRING(70),
				unique: true,
				allowNull: false
			}
		};

//Hos_ID
const RadOrthancDef = {
			Orthanc_Local : {
				type: Sequelize.JSON,
				allowNull: false
			},
			Orthanc_Cloud: {
				type: Sequelize.JSON,
				allowNull: false
			},
			Orthanc_Remark: {
				type: Sequelize.STRING
			}
		};

//Hos_ID
const RadUrgentTypeDef = {
			UGType_Name : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			UGType_Day : {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			UGType_Hour : {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			UGType_Minute : {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		};

//Hos_ID
const RadCliameRightsDef = {
			CR_Name : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			CR_Value : {
				type: Sequelize.FLOAT,
				allowNull: false
			}
		};

//Hos_ID
const RadCaseStatusDef = {
			CS_Name_EN: {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			CS_Name_TH: {
				type: Sequelize.STRING(80)
			},
			CS_DESC: {
				type: Sequelize.STRING
			},
		};

//Hos_ID
const RadPatientDef = {
			Patient_HN : {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			Patient_NameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Patient_LastNameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Patient_NameEN : {
				type: Sequelize.STRING(80)
			},
			Patient_LastNameEN : {
				type: Sequelize.STRING(80)
			},
			Patient_CitizenID : {
				type: Sequelize.STRING(20)
			},
			Patient_Birthday : {
				type: Sequelize.STRING(30),
			},
			Patient_Age : {
				type: Sequelize.INTEGER,
			},
			Patient_Sex : {
				type: Sequelize.STRING(1),
				allowNull: false
			},
			Patient_Tel : {
				type: Sequelize.STRING(30)
			},
			Patient_Address : {
				type: Sequelize.STRING
			},
			Patient_YYYYMM : {
				type: Sequelize.STRING(6)
			}
		};

//Hos_ID
const RadRefferalDoctorDef = {
			Dr_NameEN : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_LastNameEN : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_NameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_LastNameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_Tel : {
				type: Sequelize.STRING(30)
			},
			Dr_Email : {
				type: Sequelize.STRING(30)
			},
			Dr_LineID : {
				type: Sequelize.STRING(30)
			}
		};

//Hos_ID
const RadRadiologistDef = {
			Dr_NameEN : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_LastNameEN : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_NameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_LastNameTH : {
				type: Sequelize.STRING(80),
				allowNull: false
			},
			Dr_Tel : {
				type: Sequelize.STRING(30)
			},
			Dr_Email : {
				type: Sequelize.STRING(30)
			},
			Dr_LineID : {
				type: Sequelize.STRING(30)
			}
		};

//Ortanc_ID
const RadDicomTransferLogDef = {
			DicomTags : {
				type: Sequelize.JSON,
				allowNull: false
			}
		};

//Hos_ID
//Case_ParentID
//Case_CSID
//Case_UGTypeID
//Case_UserID
//Case_RadRefferalDoctor
//Case_CRID
//Case_RadRadiologist
//DicomTransfer_ID
const RadCaseDef = {
      Case_OrthancStudyID : {
				type: Sequelize.UUID,
				allowNull: false
			},
			Case_DESC : {
				type: Sequelize.TEXT
			},
			Case_BodyPart : {
				type: Sequelize.STRING(150)
			},
			Case_Modality : {
				type: Sequelize.STRING(40)
			},
			Case_Manufacturer : {
				type: Sequelize.STRING(120)
			},
			Case_ProtocolName : {
				type: Sequelize.STRING(130)
			},
			Case_SeriesDescription : {
				type: Sequelize.STRING(130)
			},
			Case_StationName : {
				type: Sequelize.STRING(130)
			},
			Case_PatientHRLink : {
				type: Sequelize.JSON,
			}
		};

//RadRadiologist_ID
//Case_ID
const RadRadiologistResponseDef = {
			Response_Text : {
				type: Sequelize.TEXT
			}

		};

module.exports = {
	RadUserTypeDef,
	RadUserStatusDef,
	RadUserDef,
	RadUserInfoDef,
	RadHospitalDef,
	RadOrthancDef,
	RadUrgentTypeDef,
	RadCliameRightsDef,
	RadCaseStatusDef,
	RadPatientDef,
	RadRefferalDoctorDef,
	RadRadiologistDef,
	RadDicomTransferLogDef,
	RadCaseDef,
	RadRadiologistResponseDef
}
