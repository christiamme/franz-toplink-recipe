const { remote } = require('electron');
const path = require('path');

const webContents = remote.getCurrentWebContents();
const { session } = webContents;

window.addEventListener('load', async () => {
  const titleEl = document.querySelector('.window-title');
  if (titleEl && titleEl.innerHTML.includes('Google Chrome 36+')) {
    window.location.reload();
  }
});

window.addEventListener('beforeunload', async () => {
  try {
    session.flushStorageData();
    session.clearStorageData({
      storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });

    const registrations = await window.navigator.serviceWorker.getRegistrations();

    registrations.forEach((r) => {
      r.unregister();
      console.log('ServiceWorker unregistered');
    });
  } catch (err) {
    console.err(err);
  }
});

module.exports = (Franz) => {
  function getMessages() {
    let direct = 0;
    let indirect = 0;
    const FranzData = document.querySelector('#NavBar-ItemLinkIcon').dataset;
    if (FranzData) {
      direct = FranzData.direct;
      indirect = FranzData.indirect;
    }

    Franz.setBadge(direct, indirect);
  }

  Franz.loop(getMessages);
  
  /****
  const getMessages = function getMessages() {
    const elements = document.querySelectorAll('.menu-item__badge'); // const elements = document.querySelectorAll('.menu-item__badge, .unread');
    let count = 0;

    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) {
        count += 1;
      }
    }

    Franz.setBadge(count);
  };

  Franz.injectCSS(path.join(__dirname, 'service.css'));
  Franz.loop(getMessages);
  ****/
  
};
