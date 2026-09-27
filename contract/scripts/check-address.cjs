async function main() {
  const addr = 'mn_addr_preview1g46qj0948v5skhp9naufza0wmggredhp8reu30efhq69yevd86wsx4yg6e';
  // Check explorer or indexer for address info
  const res = await fetch('https://indexer.preview.midnight.network/api/v4/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query {
        __type(name: "Query") {
          fields {
            name
            args {
              name
              type { name kind ofType { name kind } }
            }
          }
        }
      }`
    })
  });
  const json = await res.json();
  const fields = json.data.__type.fields;
  console.log('Query fields:', fields.map(f => f.name).join(', '));
}

main().catch(console.error);
