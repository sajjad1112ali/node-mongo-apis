const jwt = require('jsonwebtoken');
const config = require("config");
const functions = require('../global/functions');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send(functions.getResponse(0,'noTokenProvided', []));
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send(functions.getResponse(0,'invalidToken', []));
    }
};