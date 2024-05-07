import './style.css'

const testBtn = document.querySelector('[data-test]');
if (testBtn) {
  testBtn.addEventListener('click', async () => {
    const resp = await window.fetch('http://localhost:3000/')
    console.log(await resp.json());
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => {
      if (reg.active) {
        console.log('service worker registered');
      }
    })
    .catch((err) => console.error(err));
} else {
  console.log('not in nav')
}