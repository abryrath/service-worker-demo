import './style.css'

const testBtn = document.querySelector('[data-test]');
if (testBtn) {
  testBtn.addEventListener('click', async () => {
    const resp = await window.fetch('http://localhost:3000/')
    console.log(await resp.json());
  })
}

// #region service worker
function interceptRequest() {
  
}

const serviceWorkerCode = `self.addEventListener('install', () => {
  console.log('install');
});

self.addEventListener('fetch', function(event) { interceptRequest });
`

const serviceWorkerBlob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
const serviceWorkerBlobUrl = URL.createObjectURL(serviceWorkerBlob);

const registerServiceWorker = async (blobUrl: string) => {
  if ('serviceWorker' in navigator) {
      // navigator.serviceWorker.register(blobUrl)
      navigator.serviceWorker.register('./sw')
      .then((reg) => {
        if (reg.active) {
          console.log('service worker registered');
        }
      })
      .catch((err) => console.error(err));
  } else {
    console.log('not in nav')
  }
}

registerServiceWorker(serviceWorkerBlobUrl);
// #endregion service worker