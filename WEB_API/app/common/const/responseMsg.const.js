module.exports = {
  NOT_FOUND: 'Requested resource not found.',
  VALIDATION_FAILED: 'Invalid request params.',
  REQUEST_SUCCESS: 'Request successfully!',
  REQUEST_FAILED: 'Something went wrong, please try again later.',
  AUTH: {
    EMAIL: {
      AVAILABLE: 'Email is available!',
      UNAVAILABLE: 'Email is not available.',
      FAIL_TO_SELECT: 'Having issue using selected email.',
    },
    LOGIN: {
      SUCCESS: 'Logged in successfully!',
      FAILED: 'Invalid email or password.',
      INACTIVE_USER: 'User account is inactive.',
      REFRESH_TOKEN_FAILED: 'Failed to request new session.',
      UNAUTHORIZED: 'Token invalid.',
      TOKEN_REQUIRED: 'Token is required.',
      TIME_OUT: 'Request has expired.',
    },
    LOGOUT: {
      SUCCESS: 'Logged out successfully!',
    },
    CHANGE_PASSWORD: {
      SUCCESS: 'Password updated successfully!',
      FAILED: 'Failed to update password.',
    },
    FORGOT_PASSWORD: {
      INVALID_EMAIL: 'Account not found.',
      SUCCESS: 'Your request has successfully!',
      FAILED: 'Failed to forgot password.',
    },
  },
  PROFILE: {
    UPDATE_SUCCESS: 'Profile updated successfully!',
    UPDATE_FAILED: 'Failed to update profile.',
  },
  CRUD: {
    CREATE_SUCCESS: 'Create data successfully.',
    CREATE_FAILED: 'Create data failed.',
    UPDATE_SUCCESS: 'Update data successfully.',
    UPDATE_FAILED: 'Update data failed.',
    DELETE_SUCCESS: 'Delete data successfully.',
  },
  USER: {
    VERIFICATION_SUCCESS: 'Account verification successfully!',
    VERIFICATION_FAILED: 'Account verification failed.',
    CREATE_SUCCESS: 'Create user success.',
    CREATE_FAILED: 'Create user failed.',
    UPDATE_SUCCESS: 'Update user success.',
    UPDATE_FAILED: 'Update user failed.',
    DELETE_SUCCESS: 'Delete user success.',
    UPDATE_PASSWORD_SUCCESS: 'Update password success.',
    GENERATE_USERNAME_SUCCESS: 'Generate username success.',
    OLD_PASSWORD_WRONG: 'Mật khẩu cũ không chính xác.',
  },
  USER_GROUP: {
    CREATE_SUCCESS: 'Create user group success.',
    CREATE_FAILED: 'Create user group failed.',
    UPDATE_SUCCESS: 'Update user group success.',
    UPDATE_FAILED: 'Update user group failed.',
    DELETE_SUCCESS: 'Delete user group success.',
    CHANGE_STATUS_SUCCESS: 'Change status user group success.',
    CHECK_NAME_FAILED: 'Tên nhóm người dùng đã tồn tại.',
  },
  USERGROUP_FUNCTION: {
    SAVE_SYS_USERGROUP_FUNCTION_SUCCESS:
      'Save SYS_USERGROUP_FUNCTION is success',
    SAVE_SYS_USERGROUP_FUNCTION_FAILED: 'Save SYS_USERGROUP_FUNCTION is failed',
    DELETE_SYS_USERGROUP_FUNCTION_FAILED:
      'Delete SYS_USERGROUP_FUNCTION is failed',
  },
  FUNCTION: {
    CREATE_SUCCESS: 'Create function success.',
    CREATE_FAILED: 'Create function failed.',
    UPDATE_SUCCESS: 'Update function success.',
    UPDATE_FAILED: 'Update function failed.',
    DELETE_SUCCESS: 'Delete function success.',
    CHANGE_STATUS_SUCCESS: 'Change status function success.',
    CHECK_ALIAS_FAILED: 'Mã hiệu quyền đã tồn tại.',
    CHECK_NAME_FAILED: 'Tên quyền đã tồn tại.',
  },
  FUNCTIONGROUP: {
    CREATE_SUCCESS: 'Create function group success.',
    CREATE_FAILED: 'Create function group failed.',
    UPDATE_SUCCESS: 'Update function group success.',
    UPDATE_FAILED: 'Update function group failed.',
    DELETE_SUCCESS: 'Delete function group success.',
    CHANGE_STATUS_SUCCESS: 'Change status function group success.',
    CHECK_NAME_FAILED: 'Tên nhóm quyền đã tồn tại.',
  },
  MENU: {
    CREATE_SUCCESS: 'Create menu success.',
    CREATE_FAILED: 'Create menu failed.',
    UPDATE_SUCCESS: 'Update menu success.',
    UPDATE_FAILED: 'Update menu failed.',
    DELETE_SUCCESS: 'Delete menu success.',
    CHANGE_STATUS_SUCCESS: 'Change status menu success.',
  },
};
