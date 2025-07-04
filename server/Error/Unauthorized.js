class Unauthorized extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 401
        this.statusCode = statusCode
    }

  }
  export default Unauthorized;