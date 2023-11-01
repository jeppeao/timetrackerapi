import * as dbApi from './../db/database_api.js';
import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 4;
const verifyCredentials = async (userName, pass) => {
    if (!userName || !pass) {
        return false;
    }
    try {
        const { user_name, password } = await dbApi.getUser(userName);
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
    const { userName, password } = req.body;
    const verified = await verifyCredentials(userName, password);
    if (verified === true) {
        req.session.user = `${userName}`;
        return res.status(200).send(`${userName} logged in`);
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
const userExists = async (userName) => {
    const user = await dbApi.getUser(userName);
    return !!user;
};
const registerUser = async (userName, password) => {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const body = {
        user: userName,
        password: hash
    };
    const result = await dbApi.createUser(body);
    return result ? true : false;
};
const register = async (req, res, next) => {
    const { userName, password } = req.body;
    const nameTaken = await userExists(userName);
    if (nameTaken) {
        return res.status(409).send('Error: Username Taken');
    }
    const registered = await registerUser(userName, password);
    if (registered) {
        return res.status(200).send(`User registered: ${userName}`);
    }
    else {
        return res.status(409).send(`Error: new user could not be created`);
    }
};
const isAuthenticatedUser = (req, res, next) => {
    if (req.session.user && req.session.user === req.body.userName) {
        console.log("userAuthenticated");
        next();
    }
    else {
        console.log('user not looged in');
        return res.status(401).send("Error: User not logged in");
    }
};
const isValidUsername = async (req, res, next) => {
    const { userName } = req.body;
    const isValid = await userExists(userName);
    return isValid;
};
export { isAuthenticatedUser, isValidUsername, login, logout, register };
