class InternalServerError extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 500
        this.statusCode = statusCode
    }

  }
  export default InternalServerError;