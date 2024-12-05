
export const HTTP_STATUS = {
  OK: {
    STATUS: 200,
    MESSAGE: '',
  },
  UNAUTHORISED: {
    STATUS: 401,
    MESSAGE: 'Unauthorised',
  },
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    MESSAGE: 'Something went wrong. Please try again'
  },
} as const;

export const AUTH_COOKIE = 'pm_session';