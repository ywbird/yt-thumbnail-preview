chrome.runtime.onMessage.addListener((req) => {
  if (req.scheme === 'dark') {
    chrome.action.setIcon({
      path: {
        128: 'images/icon-128-light.png',
        48: 'images/icon-48-light.png',
        32: 'images/icon-32-light.png',
        16: 'images/icon-16-light.png',
      },
    });
  } else {
    chrome.action.setIcon({
      path: {
        128: 'images/icon-128.png',
        48: 'images/icon-48.png',
        32: 'images/icon-32.png',
        16: 'images/icon-16.png',
      },
    });
  }
});
