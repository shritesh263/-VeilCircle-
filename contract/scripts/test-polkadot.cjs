const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  console.log('Connecting to wss://rpc.preview.midnight.network ...');
  const provider = new WsProvider('wss://rpc.preview.midnight.network');
  try {
    const api = await ApiPromise.create({ provider, throwOnConnect: true });
    console.log('Connected! Genesis hash:', api.genesisHash.toHex());
    await api.disconnect();
  } catch (err) {
    console.error('Connection error:', err);
    await provider.disconnect();
  }
}

main().catch(console.error);
