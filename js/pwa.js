// Service Worker Registration & PWA Install Helper
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Repostisur Service Worker registrado con éxito:', reg.scope))
      .catch((err) => console.log('Error registrando Service Worker:', err));
  });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwaInstallBanner = document.getElementById('pwa-install-banner');
  if (pwaInstallBanner) {
    pwaInstallBanner.classList.remove('hidden');
  }
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la PWA');
      }
      deferredPrompt = null;
      const pwaInstallBanner = document.getElementById('pwa-install-banner');
      if (pwaInstallBanner) pwaInstallBanner.classList.add('hidden');
    });
  }
}
