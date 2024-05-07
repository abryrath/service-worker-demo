/** NOT USED FOR ANYTHING */
/// <reference lib="WebWorker" />

export type {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', () => {
  console.log('install');
})

self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  console.log(`[sw] detected url: ${url}`);
})