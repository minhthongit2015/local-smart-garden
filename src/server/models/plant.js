


module.exports = class Plant {
  get name() { return this.info.name; }

  get owner() { return this.info.owner; }

  get days() { return this.info.days; }

  constructor(info, station) {
    this.info = info;
    this.station = station;
  }
};
