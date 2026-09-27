const { nativeToken } = require('@midnight-ntwrk/ledger-v8');

async function check(addr) {
  // Query unshielded UTXOs via indexer
  const res = await fetch('https://indexer.preview.midnight.network/api/v4/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `subscription {
        unshieldedTransactions(address: "${addr}") {
          id
        }
      }`
    })
  });
  console.log(`Address: ${addr}`);
}

async function main() {
  await check('mn_addr_preview1g46qj0948v5skhp9naufza0wmggredhp8reu30efhq69yevd86wsx4yg6e');
  await check('mn_addr_preview1cz0v50wv5qdzhaz4hhnfs6cnzruxmt558hgjj0xarv98k5nzxtjqc3tews');
}

main().catch(console.error);
