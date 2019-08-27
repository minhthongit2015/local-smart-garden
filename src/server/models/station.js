
module.exports = class Station {
  get id() { return this.info.id; }

  constructor(manager, stationInfo = {}, socket = null) {
    this.manager = manager;
    this.info = stationInfo;
    this.socket = socket;
    this.dirty = false;
    this.state = {};
    this.plant = {
      days: 20.5
    };
  }

  updateSocket(newSocket) {
    this.socket = newSocket;
  }

  updateState(newState) {
    let hasChange = false;
    Object.keys(newState).forEach(key => {
      hasChange = !hasChange && this.state[key] !== newState[key];
      this.state[key] = newState[key];
    });
    return hasChange;
  }

  setState(newState) {
    let hasChange = false;
    if (!newState) return false;
    Object.keys(newState).forEach(key => {
      if (this.state[key] !== undefined && this.state[key] !== newState[key]) {
        hasChange = true;
        this.state[key] = newState[key];
      }
    });
    this.dirty = hasChange;
    return hasChange;
  }

  syncState() {
    // eslint-disable-next-line no-useless-return
    if (!this.dirty) return;
  }
};