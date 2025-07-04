class AlreadyExist extends Error {
    code
    statusCode
    constructor(message,statusCode) {
        super(message);
        this.code = 409
        this.statusCode = statusCode
    }

  }
export default AlreadyExist;