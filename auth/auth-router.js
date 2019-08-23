const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../database/usersModel');
const { verifyNewUser, verifyUserInput } = require('./authenticate-middleware');

const router = require('express').Router();
router.use('/', verifyUserInput);

router.post('/register', verifyNewUser, async (req, res, next) => {
    try {
        let user = req.body;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash;
        const newUser = await Users.add(user);
        res.status(201).json(newUser);
    } catch (err) {
        next({ err, stat: 500, message: 'Could not register user.' });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        let storedUser = await Users.findByUsername(username);
        if (storedUser && bcrypt.compareSync(storedUser.password, password)) {
            const token = generateToken(storedUser);
            res.status(200).json({
                message: `Welcome ${storedUser.username}!`,
                token,
            });
        } else next({ stat: 401, message: 'Invalid credentials.' });
    } catch (err) {
        next({ err, stat: 500, message: 'Could not login user.' });
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: '1h',
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
