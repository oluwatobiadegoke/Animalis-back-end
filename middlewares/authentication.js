const jwt = require("jsonwebtoken");
const StatusCodes = require("http-status-codes")

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || "";
    try {
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: "Please login first."});
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId = verify.userId,
            username = verify.username
        }
        next();
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: error.toString()});
    }
};

module.exports = verifyToken;
