const { WsProvider } = require('@polkadot/api');

const provider = new WsProvider('wss://rpc.preview.midnight.network');
provider.on('connected', () => console.log('CONNECTED!'));
provider.on('disconnected', () => console.log('DISCONNECTED!'));
provider.on('error', (err) => console.error('ERROR:', err));

setTimeout(() => {
  provider.disconnect();
  process.exit(0);
}, 5000);
