const jwt = require("jsonwebtoken");

const adminPermission = (req, res, next) => {
    const token =
        req?.cookies?.accessToken ||
        req?.headers?.authorization?.split(" ")[1] ||
        null;

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET, {
                algorithms: ["HS256"],
            });

            next();
        } catch (err) {
            res.status(401).send("Unauthorized");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
};

module.exports = { adminPermission };