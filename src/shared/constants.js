
const WS_EVENTS = {
  connection: 'connection',
  disconnect: 'disconnect',
  message: 'message',
  environment: 'environment',

  cloudConnect: 'connect', // For Socket.IO-Client

  garden2Cloud: 'garden2cloud',
  mobile2Cloud: 'mobile2cloud',
  
  // Command send to stations in the local garden
  command: 'command'
};

module.exports = {
  WS_EVENTS
};
