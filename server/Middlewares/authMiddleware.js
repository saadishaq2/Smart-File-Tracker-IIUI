import jwt from "jsonwebtoken"
import UnauthorizedError from '../Error/Unauthorized.js'
import BadRequestError from '../Error/BadRequest.js'

const auth = (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken.split(" ")[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
                if (err) {
                    next(new UnauthorizedError('unauthorized', 'E4001'))
                } else {
                    res.locals.userInfo = decodeToken;
                    next();
                }
            })
        } else {
            next(new BadRequestError('No token in the headers', 'E4000'))
        }
    } catch (err) {
        next(new UnauthorizedError(err && err.message ? err.message : 'unauthorized', 'E4001'))
    }
}
export default auth