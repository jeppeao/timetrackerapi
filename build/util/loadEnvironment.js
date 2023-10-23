import { variablesLocal, variablesRemote } from '../env.js';
const addEnvironmentVariables = (vars) => {
    for (const [name, val] of Object.entries(vars)) {
        process.env[name] = val;
    }
};
const loadEnvironment = (env) => {
    if (env === 'development') {
        addEnvironmentVariables(variablesLocal);
    }
    else {
        addEnvironmentVariables(variablesRemote);
    }
};
export default (loadEnvironment);
