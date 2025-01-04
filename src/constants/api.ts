
export const HTTP_STATUS = {
  OK: {
    STATUS: 200,
    MESSAGE: "",
  },
  BAD_REQUEST: {
    STATUS: 400,
    MESSAGE: "Bad Request",
  },
  UNAUTHORISED: {
    STATUS: 401,
    MESSAGE: "Unauthorised",
  },
  CONFLICT: {
    STATUS: 409,
    MESSAGE: "Conflict",
  },
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    MESSAGE: "Something went wrong. Please try again",
  },
} as const;

export const AUTH_COOKIE = 'pm_session';