module.exports = {
  // Procedure COMMON
  CBO_COMMON_GETALL: "CBO_COMMON_GetAll",

  // Procedure USERGROUP
  SYS_USERGROUP_GETLIST: "SYS_USERGROUP_GetList",
  SYS_USERGROUP_CREATEORUPDATE: "SYS_USERGROUP_CreateOrUpdate",
  SYS_USERGROUP_GETBYID: "SYS_USERGROUP_GetById",
  SYS_USERGROUP_DELETE: "SYS_USERGROUP_Delete",
  SYS_USERGROUP_UPDATESTATUS: "SYS_USERGROUP_UpdateStatus",
  SYS_USERGROUP_CHECKNAME: "SYS_USERGROUP_CheckName",

  // Procedure USER
  SYS_USER_FINDBYUSERNAME: "SYS_USER_FindByUsername",
  SYS_USER_FINDBYEMAIL: "SYS_USER_FindByEmail",
  SYS_USER_GETLIST: "SYS_USER_GetList",
  SYS_USER_GETOPTIONS: "SYS_USER_GetOptions",
  SYS_USER_GETBYFUNCTIONALIAS: "SYS_USER_GetByFunctionAlias",
  SYS_USER_CREATEORUPDATE: "SYS_USER_CreateOrUpdate",
  SYS_USER_GETUSERBYID: "SYS_USER_GetUserById",
  SYS_USER_DELETE: "SYS_USER_Delete",
  SYS_USER_CHANGEPASSWORD: "SYS_USER_ChangePassword",
  SYS_USER_CHECKPASSWORD: "SYS_USER_CheckPassword",
  SYS_USER_MAX: "SYS_USER_MAX",
  SYS_USER_LOGIN_LOG_CREATE: "SYS_USER_LOGIN_LOG_Create",

  // Function Group
  SYS_FUNCTIONGROUP_GETLIST: "SYS_FUNCTIONGROUP_GetList",
  SYS_FUNCTIONGROUP_CREATEORUPDATE: "SYS_FUNCTIONGROUP_CreateOrUpdate",
  SYS_FUNCTIONGROUP_GETBYID: "SYS_FUNCTIONGROUP_GetById",
  SYS_FUNCTIONGROUP_DELETE: "SYS_FUNCTIONGROUP_Delete",
  SYS_FUNCTIONGROUP_UPDATESTATUS: "SYS_FUNCTIONGROUP_UpdateStatus",
  SYS_FUNCTIONGROUP_CHECKNAME: "SYS_FUNCTIONGROUP_CheckName",

  // Procedure FUNCTION
  SYS_FUNCTION_GETLIST: "SYS_FUNCTION_GetList",
  SYS_FUNCTION_CREATEORUPDATE: "SYS_FUNCTION_CreateOrUpdate",
  SYS_FUNCTION_GETBYID: "SYS_FUNCTION_GetById",
  SYS_FUNCTION_DELETE: "SYS_FUNCTION_Delete",
  SYS_FUNCTION_UPDATESTATUS: "SYS_FUNCTION_UpdateStatus",
  SYS_FUNCTION_CHECKALIAS: "SYS_FUNCTION_CheckAlias",
  SYS_FUNCTION_CHECKNAME: "SYS_FUNCTION_CheckName",
  SYS_FUNCTION_GETLISTBYUSERGROUP: "SYS_FUNCTION_GetListByUserGroup",

  // Procedure MENU
  SYS_MENU_GETLIST: "SYS_MENU_GetList",
  SYS_MENU_CREATEORUPDATE: "SYS_MENU_CreateOrUpdate",
  SYS_MENU_GETBYID: "SYS_MENU_GetById",
  SYS_MENU_DELETE: "SYS_MENU_Delete",
  SYS_MENU_UPDATESTATUS: "SYS_MENU_UpdateStatus",
  SYS_MENU_GETBYUSERGROUP: "SYS_MENU_GetByUserGroup",
  SYS_MENU_GETBYCUSTOMER: "SYS_MENU_GetByCustomer",

  // Procedure USER_USERGROUP
  SYS_USER_USERGROUP_Delete: "SYS_USER_USERGROUP_Delete",
  SYS_USER_USERGROUP_Create: "SYS_USER_USERGROUP_Create",
  SYS_USER_GETPERMISSIONBYUSERGROUP: "SYS_USER_GetPermissionByUserGroup",

  // Procedure SYS_USERGROUP_FUNCTION
  SYS_USERGROUP_FUNCTION_DELETE: "SYS_USERGROUP_FUNCTION_Delete",
  SYS_USERGROUP_FUNCTION_DELETEBYFUCTIONGROUP:
    "SYS_USERGROUP_FUNCTION_DeleteByFunctionGroup",
  SYS_USERGROUP_FUNCTION_CREATE: "SYS_USERGROUP_FUNCTION_Create",
  SYS_USERGROUP_FUNCTION_GETLISTBYFUNCTIONGROUP:
    "SYS_USERGROUP_FUNCTION_GetListByFunctionGroup ",
  SYS_FUNCTION_GETLISTBYFUNCTIONGROUP: "SYS_FUNCTION_GetListByFunctionGroup",

  // Procedure SYS_ERROR
  SYS_ERROR_CREATE: "SYS_ERROR_Create",

  // Procedure CUSTOMER
  BANK_EMPLOYEE_TRANSACTION_HISTORY_CREATE:
    "BANK_EMPLOYEE_TRANSACTION_HISTORY_Create",
  BANK_PARTNER_GETBYID: "BANK_PARTNER_GETBYID",
  BANK_PARTNER_LOGIN_LOG_CREATE: "BANK_PARTNER_LOGIN_LOG_Create",
  BANK_TRANSACTION_HISTORY_CHECKOTP: "BANK_TRANSACTION_HISTORY_CheckOTP",
  BANK_TRANSACTION_HISTORY_CREATE: "BANK_TRANSACTION_HISTORY_Create",
  CUS_CUSTOMER_ACCOUNT_CHECKACCOUNTPAYMENT:
    "CUS_CUSTOMER_ACCOUNT_CheckAccountPayment",
  CUS_CUSTOMER_ACCOUNT_CHECKACCOUNTEXITS:
    "CUS_CUSTOMER_ACCOUNT_CheckAccountExits",
  CUS_CUSTOMER_ACCOUNT_CREATEORUPDATE: "CUS_CUSTOMER_ACCOUNT_CreateOrUpdate",
  CUS_CUSTOMER_ACCOUNT_RECEIVE_GETLIST: "CUS_CUSTOMER_ACCOUNT_RECEIVE_GetList",
  CUS_CUSTOMER_ACCOUNT_RECEIVE_CREATEORUPDATE:
    "CUS_CUSTOMER_ACCOUNT_RECEIVE_CreateOrUpdate",
  CUS_CUSTOMER_ACCOUNT_RECEIVE_DETAIL: "CUS_CUSTOMER_ACCOUNT_RECEIVE_Detail",
  CUS_CUSTOMER_ACCOUNT_RECEIVE_DELETE: "CUS_CUSTOMER_ACCOUNT_RECEIVE_Delete",
  CUS_CUSTOMER_ACCOUNT_RECEIVE_CHANGESTATUS: "CUS_CUSTOMER_ACCOUNT_RECEIVE_ChangeStatus",
  CUS_CUSTOMER_ACCOUNT_UPDATECURRENTBALANCE:
    "CUS_CUSTOMER_ACCOUNT_UpdateCurrentBalance",
  CUS_CUSTOMER_CREATEORUPDATE: "CUS_CUSTOMER_CreateOrUpdate",
  CUS_CUSTOMER_DELETE: "CUS_CUSTOMER_Delete",
  CUS_CUSTOMER_FINDBYEMAIL: "CUS_CUSTOMER_FindByEmail",
  CUS_CUSTOMER_FINDBYUSERNAME: "CUS_CUSTOMER_FindByUserName",
  CUS_CUSTOMER_GETCUSTOMERBYID: "CUS_CUSTOMER_GetCustomerById",
  CUS_CUSTOMER_GETINFOTRANFER: "CUS_CUSTOMER_GetInfoTranfer",
  CUS_CUSTOMER_GETLIST: "CUS_CUSTOMER_GetList",
  CUS_CUSTOMER_ACCOUNT_GETLIST: "CUS_CUSTOMER_ACCOUNT_GetList",
  CUS_CUSTOMER_GETMENUBYCUSTOMERID: "CUS_CUSTOMER_GetMenuByCustomerID",
  CUS_CUSTOMER_LOGIN_LOG_CREATE: "CUS_CUSTOMER_LOGIN_LOG_Create",
  CUS_CUSTOMER_MAX: "CUS_CUSTOMER_MAX",
};
