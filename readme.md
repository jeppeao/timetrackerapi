To run app after download:
1. navigate to directory
2. run "npm install"
3. run "openssl req -nodes -new -x509 -keyout server.key -out server.cert"
4. add env.js file to src directory (see below)
5. install redis
6. run "npm start"

example env.js file:
"""
const variablesLocal = {
  PORT: '8443',
}

const variablesRemote = {
  PORT: '443'
}

export {
  variablesLocal,
  variablesRemote
};
"""

env.js must contain definitions of variables: PORT