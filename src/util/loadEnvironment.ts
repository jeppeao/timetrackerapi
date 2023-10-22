type EnvironmentVariables = Record<string, string>;

const addEnvironmentVariables = (vars: EnvironmentVariables) => {
  for (const [name, val] of Object.entries(vars)) {
    process.env[name] = val;
  }
}

const loadEnvironment = async (env: string) => {
  if (env === 'development') {
    await import('./../env_local.js').then(mod => {
      addEnvironmentVariables(mod.variables);
    })
  }
}

export default (loadEnvironment)