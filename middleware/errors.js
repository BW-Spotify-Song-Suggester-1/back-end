const messageDictionary = {
  // Schema Validation Errors
  notAcceptableValue: {
    message: "The passed parameter value is not acceptable",
    code: 400,
  },
  invalidId: {
    message: "ID parameter is not valid",
    code: 400,
  },
  incompleteData: {
    message: "Please provide the required data",
    code: 400,
  },
  // No Result Errors
  userIdNotFound: {
    message: "User with this ID not found",
    code: 404,
  },
  itemNotFound: {
    message: "Object not found",
    code: 404,
  },
  // Database Errors
  dbCreateError: {
    message: "There was an error while trying to Save to DB",
    code: 500,
  },
  dbRetrieveError: {
    message: "There was an error while trying to Retrieve record from DB",
    code: 500,
  },
  dbUpdateError: {
    message: "There was an error while trying to Update record in DB",
    code: 500,
  },
  dbDeleteError: {
    message: "There was an error while trying to Delete record from DB",
    code: 500,
  },
  // Authentication Errors
  invalidToken: {
    message: "Invalid token",
    code: 401,
  },
  notAuthenticated: {
    message: "You must first authenticate yourself",
    code: 401,
  },
  invalidCredentials: {
    message: "Your username and/or password are incorrect",
    code: 401,
  },
  // "Not Implemented" Errors
  notImplemented: {
    message: "Not yet implemented",
    code: 501,
  },
}

function errorHandler(err, req, res, next) {
  // do some loging: error + request

  // ensure error has values;
  const error = {
    error: {
      ...err,
      system: (err.err) ? err.err.toString() : undefined,
    },
    request: {
      method: (req.method.length > 0) ? req.method : undefined,
      url: (req.url.length > 0) ? req.url : undefined,
      query: (req.query.length > 0) ? req.query : undefined,
      params: (req.params.length > 0) ? req.params : undefined,
    }
  }
  delete error.error.err

  const status = err.code || res.statusCode
  res.status(status || 500).json(error);
  // next();
}

module.exports = {
  errorHandler,
  messageDictionary
}
