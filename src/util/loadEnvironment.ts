import { variablesLocal, variablesRemote } from '../env.js';

type EnvironmentVariables = Record<string, string>;

const addEnvironmentVariables = (vars: EnvironmentVariables) => {
  for (const [name, val] of Object.entries(vars)) {
    process.env[name] = val;
  }
}

const loadEnvironment = (env: string) => {
  if (env === 'development') {
      addEnvironmentVariables(variablesLocal);
  }

  else {
    addEnvironmentVariables(variablesRemote);
}
  
}

export default (loadEnvironment)