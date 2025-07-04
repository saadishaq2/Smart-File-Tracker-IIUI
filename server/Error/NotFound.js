class NotFound extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 404
        this.statusCode = statusCode
    }

  }
  export default NotFound;