

const HOST = '';
const API = `${HOST}/api/v1`;
const USER = `${API}/user`;
const GARDENS = `${API}/gardens`;
const STATIONS = `${GARDENS}/stations`;
const AI = `${API}/ai-central`;
const MAP = `${API}/map`;
const MAP_ENTITIES = `${MAP}/entities`;
const DATASET = `${AI}/datasets`;
const EXPERIMENT = `${AI}/experiments`;

const apiEndpoints = {
  API,
  user: {
    SIGN_IN: `${USER}/signin`,
    SIGN_OUT: `${USER}/signout`,
    GET_SESSION: `${USER}/get-session`
  },
  GARDENS,
  gardens: {
    AUTH: `${GARDENS}/auth`,
    STATIONS,
    stations: {
      STATE: id => `${STATIONS}/${id}/state`
    }
  },
  AI,
  ai: {
    CHECK_UPDATE: `${AI}/check-update`,
    DOWNLOAD: `${AI}/download`,
    DATASET,
    datasets: {
      ITEM: id => `${DATASET}/${id}`
    },
    EXPERIMENT,
    experiments: {
      ITEM: id => `${EXPERIMENT}/${id}`,
      BUILD: id => `${EXPERIMENT}/${id}/build`
    }
  },
  MAP,
  map: {
    OBJECTS: MAP_ENTITIES,
    entities: {
      LIST: `${MAP_ENTITIES}/list`
    }
  }
};

module.exports = {
  apiEndpoints
};
