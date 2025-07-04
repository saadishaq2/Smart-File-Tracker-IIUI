class BadRequest extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 400
        this.statusCode = statusCode
    }

  }
  export default BadRequest;