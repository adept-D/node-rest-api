import ApiError from "../exceptions/ApiError.js";
import TokenService from "../service/TokenService.js";


export default function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return next(ApiError.UnAuthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnAuthorizedError());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiError.UnAuthorizedError());
        }

        req.user = userData;

        next();
    } catch (e) {
        return next(ApiError.UnAuthorizedError());
    }
}