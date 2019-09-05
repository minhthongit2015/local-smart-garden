
const endPoint = 'http://localhost:5000/api/v1';
const user = `${endPoint}/user`;
const garden = `${endPoint}/garden`;
const ai = `${endPoint}/ai`;

const API = {
  endPoint,
  session: `${endPoint}/sessions`,
  user: {
    getSession: `${user}/get-session`
  },
  garden: {
    environment: `${garden}/environment`,
    auth: `${garden}/auth`
  },
  ai: {
    checkUpdate: `${ai}/check-update`,
    download: `${ai}/download`
  }
};

const Debug = {
  CLOUD: 'cloud:',
  cloud: {
    DB: 'cloud:db:'
  },
  API: 'cloud:api:',
  api: {
    USER: 'cloud:api:user:'
  },
  ROUTING: 'cloud:routing:',
  WEBSOCKET: 'cloud:websocket:',
  ws: {
    CORE: 'cloud:websocket:core:',
    ROUTING: 'cloud:websocket:routing:',
    SETUP_ROUTING: 'cloud:websocket:setup-routing:'
  }
};


module.exports = {
  API,
  Debug
};
