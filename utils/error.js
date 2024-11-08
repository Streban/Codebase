const createSuccessResponse = require("./createSuccessResponse");

// const console = require("./log");
const handleNotFound = (req, res, next) => {
  res.status(404).json({ message: "Api not found", errorCode: 404 });
};

const handleError = (err, req, res, next) => {
  if (!err) {
    return next(); // No error, continue to next middleware
  }

  console.log(err);

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    // Error is already an ApiError, use its status code and message
    return res.status(err.statusCode).json(createSuccessResponse({error: true, message: err.message}));
  } else if (err.code === 11000) {
    // Handle MongoDB duplicate key error
    const message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, Already Exists, please use another value.`;
    const apiError = ApiError.DuplicateFieldError(message);
    return res.status(apiError.statusCode).json(createSuccessResponse({error: true, message: apiError.message}));
  }

  // For errors not specifically handled, return a generic server error
  const apiError = new ApiError(500, 'An unexpected error occurred');
  return res.status(apiError.statusCode).json(createSuccessResponse({error: true, message: apiError.message}));
};

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // To identify if the error is operational and handled
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message) {
    return new ApiError(400, message);
  }

  static DuplicateFieldError(message) {
    return new ApiError(409, message); // 409 Conflict can be appropriate for duplicate errors
  }
}


module.exports = {
  handleNotFound,
  handleError,
  ApiError
};
