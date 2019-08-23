const jwt = require('jsonwebtoken');
const secrets = require('./secrets');
const Users = require('../database/usersModel');

module.exports = {
    restricted,
    verifyNewUser,
    verifyUserInput,
};

async function verifyNewUser(req, res, next) {
    const { username, password } = req.body;
    try {
        const storedUser = await Users.findByUsername(username);
        if (storedUser && username === storedUser.username) {
            next({
                stat: 401,
                message: 'Username is already in use, please choose another.',
            });
        } else next();
    } catch (err) {
        next({ err, stat: 500, message: 'Could not register user. ' });
    }
}

function verifyUserInput(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password)
        next({ stat: 400, message: 'Please include a username and password.' });
    else next();
}

function restricted(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) next({ stat: 401, message: 'Invalid credentials.' });
            else {
                req.jwtToken = decodedToken;
                next();
            }
        });
    } else {
        next({ stat: 400, message: 'You are not logged in.' });
    }
}
