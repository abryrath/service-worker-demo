self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  console.log(`[sw] detected url: ${url}`);
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        return new Response(JSON.stringify({
          hello: 'world'
        }), { headers: { 'Content-Type': 'application/json'}})
      })
  );
    // new Promise({
    //   hello: 'world'
    // }))
})