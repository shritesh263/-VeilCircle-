const fs = require('fs');

async function main() {
  const res = await fetch('https://indexer.preview.midnight.network/api/v4/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        __type(name: "Subscription") {
          fields {
            name
            args {
              name
            }
          }
        }
      }`
    })
  });
  const json = await res.json();
  const fields = json.data.__type.fields.filter(f => f.name.includes('dust') || f.name.includes('transaction') || f.name.includes('unshielded'));
  console.log(JSON.stringify(fields, null, 2));
}

main().catch(console.error);
