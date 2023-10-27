import * as dbApi from './../db/database_api.js';
import * as bcrypt from 'bcrypt';
const SALT_ROUNDS = 4;
const userAuthenticated = async (userName, pass) => {
    if (!userName || !pass) {
        return false;
    }
    try {
        const { user_name, password } = await dbApi.getUser(userName);
        const passwordCheck = await bcrypt.compare(pass, password);
        // const passwordCheck = pass === password;
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
    if (await userAuthenticated(userName, password) === true) {
        req.session.user = `${userName}`;
    }
    next();
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
    next();
};
const userExists = async (userName) => {
    const user = await dbApi.getUser(userName);
    return !!user;
};
const registerUser = async (userName, password) => {
    const nameTaken = await userExists(userName);
    if (!nameTaken) {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const body = {
            user: userName,
            password: hash
        };
        const result = await dbApi.createUser(body);
        if (result) {
            return true;
        }
    }
    return false;
};
const register = async (req, res, next) => {
    const { userName, password } = req.body;
    registerUser(userName, password);
};
const useAuthentication = (req, res, next) => {
    const { userName, password } = req.body;
    const user = req.session.user;
    next();
};
export { useAuthentication, login, logout, register };
