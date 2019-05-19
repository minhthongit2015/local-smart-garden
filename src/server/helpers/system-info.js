
const os = require('os');

module.exports = class SystemInfo {
  static listInterfaces() {
    return os.networkInterfaces();
  }

  static listAllLocalIP() {
    const localIPs = [];
    const interfaces = SystemInfo.listInterfaces();
    Object.keys(interfaces).forEach(interfaceName => {
      interfaces[interfaceName].forEach((iface) => {
        if (iface.family !== 'IPv4' || iface.internal !== false) {
          return;
        }
        localIPs.push(iface.address);
      });
    });

    return localIPs;
  }

  static getFirstLocalIP() {
    return SystemInfo.listAllLocalIP()[0];
  }

  static showServerPorts(port, serverDebug) {
    const interfaces = SystemInfo.listInterfaces();
    serverDebug('[Server running at] > _');
    Object.keys(interfaces).forEach(interfaceName => {
      let alias = 0;
      interfaces[interfaceName].forEach((iface) => {
        if (iface.family !== 'IPv4' || iface.internal !== false) {
          return;
        }
        if (alias >= 1) {
          serverDebug('  + ', `(${interfaceName}/${alias}) ${iface.address}:${port}`);
        } else {
          serverDebug('  + ', `(${interfaceName}) ${iface.address}:${port}`);
        }
        alias += 1;
      });
    });

  }
};