import * as dbApi from './../db/database_api.js';
import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 4;
const verifyCredentials = async (username, pass) => {
    if (!username || !pass) {
        return false;
    }
    try {
        const { user_name, password } = await dbApi.getUser(username);
        const passwordCheck = await bcrypt.compare(pass, password);
        if (!passwordCheck) {
            return false;
        }
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
const login = async (req, res, next) => {
    const { username, password } = req.body;
    const verified = await verifyCredentials(username, password);
    if (verified === true) {
        req.session.user = `${username}`;
        return res.status(200).send(`${username} logged in`);
    }
    else {
        return res.status(401).send(`Error: Access denied`);
    }
};
const logout = async (req, res, next) => {
    try {
        req.session.destroy(function (err) {
            return res.status(200).send();
        });
    }
    catch (error) {
        return res.status(500).send(error);
    }
    ;
};
const userExists = async (username) => {
    const user = await dbApi.getUser(username);
    return !!user;
};
const registerUser = async (username, password) => {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const body = {
        user: username,
        password: hash
    };
    const result = await dbApi.createUser(body);
    return result ? true : false;
};
const register = async (req, res, next) => {
    const { username, password } = req.body;
    const nameTaken = await userExists(username);
    if (nameTaken) {
        return res.status(409).send('Error: Username Taken');
    }
    const registered = await registerUser(username, password);
    if (registered) {
        return res.status(200).send(`User registered: ${username}`);
    }
    else {
        return res.status(409).send(`Error: new user could not be created`);
    }
};
const isAuthenticatedUser = (req, res, next) => {
    if (req.session.user && req.session.user === req.body.username) {
        console.log("userAuthenticated");
        next();
    }
    else {
        console.log('user not looged in');
        return res.status(401).send("Error: User not logged in");
    }
};
const isValidUsername = async (req, res, next) => {
    const { username } = req.body;
    const isValid = await userExists(username);
    return isValid;
};
export { isAuthenticatedUser, isValidUsername, login, logout, register };
