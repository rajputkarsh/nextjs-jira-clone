
export const HTTP_STATUS = {
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    MESSAGE: 'Something went wrong. Please try again'
  },
  OK: {
    STATUS: 200,
    MESSAGE: '',
  }
} as const;

export const AUTH_COOKIE = 'pm_session';