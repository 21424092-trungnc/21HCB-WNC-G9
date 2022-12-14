const database = require('../../models');
const UserClass = require('../user/user.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const stringHelper = require('../../common/helpers/string.helper');
const mssql = require('../../models/mssql');
const logger = require('../../common/classes/logger.class');
const API_CONST = require('../../common/const/api.const');
const ServiceResponse = require('../../common/responses/service.response');
const config = require('../../../config/config');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const cache = require('../../common/classes/cache.class');
const _ = require('lodash');

const getListUser = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);

    const query = `${PROCEDURE_NAME.SYS_USER_GETLIST} 
      @PageSize=:PageSize,
      @PageIndex=:PageIndex,
      @KEYWORD=:KEYWORD`;
    const users = await database.sequelize.query(query, {
      replacements: {
        PageSize: limit,
        PageIndex: page,
        KEYWORD: apiHelper.getQueryParam(req, 'search'),
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      data: UserClass.list(users),
      page: page,
      limit: limit,
      total: apiHelper.getTotalData(users),
    };
  } catch (e) {
    logger.error(e, {
      function: 'userService.getListUser',
    });

    return [];
  }
};

const createUser = async (bodyParams = {}) => {
  try {
    const userid = await createUserOrUpdate(bodyParams);
    removeCacheOptions();
    return userid;
  } catch (e) {
    logger.error(e, {
      function: 'userService.createUser',
    });

    return null;
  }
};

const updateUser = async (bodyParams) => {
  try {
    const userid = await createUserOrUpdate(bodyParams);
    removeCacheOptions();
    return userid;
  } catch (e) {
    logger.error(e, {
      function: 'userService.updateUser',
    });

    return null;
  }
};

const createUserOrUpdate = async (bodyParams) => {
  const params = bodyParams;

  let data = {
    USERNAME: params.user_name || '',
    FIRSTNAME: params.first_name || '',
    LASTNAME: params.last_name || '',
    FULLNAME: `${params.first_name} ${params.last_name}`,
    GENDER: params.gender || '',
    BIRTHDAY: params.birthday || '',
    EMAIL: params.email || '',
    PHONENUMBER: params.phone_number || '',
    ADDRESS: params.address || '',
    CREATEDUSER: params.auth_id,
  };

  let query = `${PROCEDURE_NAME.SYS_USER_CREATEORUPDATE} 
        @USERNAME=:USERNAME,
        @FIRSTNAME=:FIRSTNAME,
        @LASTNAME=:LASTNAME,
        @FULLNAME=:FULLNAME,
        @GENDER=:GENDER,
        @BIRTHDAY=:BIRTHDAY,
        @EMAIL=:EMAIL,
        @PHONENUMBER=:PHONENUMBER,
        @ADDRESS=:ADDRESS,
        @CREATEDUSER=:CREATEDUSER`;
  if (params.user_id) {
    data['USERID'] = params.user_id;
    query += ',@USERID=:USERID';
  }
  if (params.password) {
    data['PASSWORD'] = stringHelper.hashPassword(params.password);
    query += ',@PASSWORD=:PASSWORD';
  }

  //
  let userGroups = '';
  if (Array.isArray(params.user_groups)) {
    userGroups = params.user_groups.join('|');
  }

  let transaction;
  try {
    // get transaction
    transaction = await database.sequelize.transaction();

    const result = await database.sequelize.query(query, {
      replacements: data,
      type: database.QueryTypes.INSERT,
      transaction: transaction,
    });
    if (!result) {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    params.user_id = result[0][0].RESULT;
    if (params.user_id === '-1') {
      if (transaction) {
        await transaction.rollback();
      }
      return null;
    }
    await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_USERGROUP_Delete} @USERID=:USERID`,
      {
        replacements: {
          USERID: params.user_id,
        },
        type: database.QueryTypes.DELETE,
        transaction: transaction,
      },
    );

    await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_USERGROUP_Create} @USERID=:USERID, @USERGROUPID=:USERGROUPID`,
      {
        replacements: {
          USERID: params.user_id,
          USERGROUPID: userGroups,
        },
        type: database.QueryTypes.INSERT,
        transaction: transaction,
      },
    );

    // commit
    await transaction.commit();
    return params.user_id;
  } catch (err) {
    console.log('err.message', err.message);
    // Rollback transaction only if the transaction object is defined
    if (transaction) {
      await transaction.rollback();
    }
    return null;
  }
};

const detailUser = async (userId) => {
  try {
    let user = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_GETUSERBYID} @USERID=:USERID`,
      {
        replacements: {
          USERID: userId,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (user.length) {
      user = UserClass.detail(user[0]);
      user.isAdministrator = user.user_name === config.adminUserName ? 1 : 0;

      return user;
    }

    return null;
  } catch (e) {
    logger.error(e, {
      function: 'userService.detailUser',
    });

    return null;
  }
};

const findByUserName = async (userName) => {
  try {
    const user = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_FINDBYUSERNAME} @UserName=:UserName`,
      {
        replacements: {
          UserName: userName,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (user.length) {
      return UserClass.detail(user[0]);
    }

    return null;
  } catch (error) {
    console.error('userService.findByUserName', error);
    return null;
  }
};

const deleteUser = async (userId, req) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_DELETE} @USERID=:USERID,@UPDATEDUSER=:UPDATEDUSER`,
      {
        replacements: {
          USERID: userId,
          UPDATEDUSER: apiHelper.getAuthId(req),
        },
        type: database.QueryTypes.UPDATE,
      },
    );
    removeCacheOptions();
    return true;
  } catch (error) {
    console.error('userService.deleteUser', error);
    return false;
  }
};

const changePasswordUser = async (userId, password, authId) => {
  try {
    await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_CHANGEPASSWORD} @USERID=:USERID,@PASSWORD=:PASSWORD,@UPDATEDUSER=:UPDATEDUSER`,
      {
        replacements: {
          USERID: userId,
          PASSWORD: stringHelper.hashPassword(password),
          UPDATEDUSER: authId,
        },
        type: database.QueryTypes.UPDATE,
      },
    );

    return true;
  } catch (error) {
    console.error('userService.changePasswordUser', error);
    return false;
  }
};

const checkPassword = async (userId) => {
  try {
    const data = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_CHECKPASSWORD} @USERID=:USERID`,
      {
        replacements: {
          USERID: userId,
        },
        type: database.QueryTypes.SELECT,
      },
    );
    return data[0].PASSWORD;
  } catch (error) {
    console.error('userService.checkPassword', error);
    return '';
  }
};

const generateUsername = async () => {
  try {
    const user = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_MAX}`,
      {
        replacements: {},
        type: database.QueryTypes.SELECT,
      },
    );

    let data = UserClass.generateUsername(user[0]);
    return data;
  } catch (error) {
    console.error('userService.generateUsername', error);
    return true;
  }
};

const logUserLogin = async (data = {}) => {
  try {
    const pool = await mssql.pool;
    await pool
      .request()
      .input('USERPROFILEID', apiHelper.getValueFromObject(data, 'user_id'))
      .input('USERNAME', apiHelper.getValueFromObject(data, 'user_name'))
      .input('ISACTIVE', API_CONST.ISACTIVE.ACTIVE)
      .input('CREATEDUSER', apiHelper.getValueFromObject(data, 'user_id'))
      .execute(PROCEDURE_NAME.SYS_USER_LOGIN_LOG_CREATE);

    return new ServiceResponse(true);
  } catch (e) {
    logger.error(e, {
      function: 'userService.logUserLogin',
    });

    return new ServiceResponse(true);
  }
};

const removeCacheOptions = () => {
  return cacheHelper.removeByKey(CACHE_CONST.SYS_USER_OPTIONS);
};

const findByEmail = async (email) => {
  try {
    const user = await database.sequelize.query(
      `${PROCEDURE_NAME.SYS_USER_FINDBYEMAIL} @EMAIL=:EMAIL`,
      {
        replacements: {
          EMAIL: email,
        },
        type: database.QueryTypes.SELECT,
      },
    );

    if (user.length) {
      return UserClass.detail(user[0]);
    }

    return null;
  } catch (error) {
    console.error('userService.findByEmail', error);
    return null;
  }
};

const getOptionsAll = async (queryParams = {}) => {
  try {
    const ids = apiHelper.getValueFromObject(queryParams, 'ids', []);
    const isActive = apiHelper.getFilterBoolean(queryParams, 'is_active');
    const parentId = apiHelper.getValueFromObject(queryParams, 'parent_id');
    const function_alias = apiHelper.getValueFromObject(
      queryParams,
      'function_alias',
    );
    const data = await cache.wrap(CACHE_CONST.SYS_USER_OPTIONS, () => {
      return getOptions();
    });
    let dataUser = [];
    if (function_alias) {
      dataUser = await getByFunctionAlias(function_alias).filter((item) => {
        return item.USERID;
      });
    }
    const idsFilter = ids.filter((item) => {
      return item;
    });
    const dataFilter = _.filter(data, (item) => {
      let isFilter = true;
      if (
        Number(isActive) !== API_CONST.ISACTIVE.ALL &&
        Boolean(Number(isActive)) !== item.ISACTIVE
      ) {
        isFilter = false;
      }
      if (idsFilter.length && !idsFilter.includes(item.USERID.toString())) {
        isFilter = false;
      }
      if (parentId && Number(parentId) !== item.PARENTID) {
        isFilter = false;
      }
      if (function_alias && !dataUser.includes(item.USERID.toString())) {
        isFilter = false;
      }
      if (isFilter) {
        return item;
      }
      return null;
    });

    return new ServiceResponse(true, '', UserClass.options(dataFilter));
  } catch (e) {
    logger.error(e, { function: 'userService.getOptionsAll' });

    return new ServiceResponse(true, '', []);
  }
};

const getOptions = async (req) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_USER_GETOPTIONS} 
      @IsActive=:IsActive`;
    const users = await database.sequelize.query(query, {
      replacements: {
        IsActive: API_CONST.ISACTIVE.ALL,
      },
      type: database.QueryTypes.SELECT,
    });

    return users;
  } catch (e) {
    logger.error(e, {
      function: 'userService.getOptions',
    });

    return [];
  }
};

const getByFunctionAlias = async (FunctionAlias) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_USER_GETBYFUNCTIONALIAS} 
      @FUNCTIONALIAS=:FUNCTIONALIAS`;
    const users = await database.sequelize.query(query, {
      replacements: {
        FUNCTIONALIAS: FunctionAlias,
      },
      type: database.QueryTypes.SELECT,
    });

    return users;
  } catch (e) {
    logger.error(e, {
      function: 'userService.getOptions',
    });

    return [];
  }
};

module.exports = {
  getListUser,
  createUser,
  detailUser,
  updateUser,
  deleteUser,
  checkPassword,
  changePasswordUser,
  findByUserName,
  generateUsername,
  logUserLogin,
  findByEmail,
  getOptionsAll,
};
