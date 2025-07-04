class Forbidden extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 403
        this.statusCode = statusCode
    }

  }
  export default Forbidden;