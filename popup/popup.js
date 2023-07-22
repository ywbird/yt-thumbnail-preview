const iconBigger = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`;
const iconSmaller = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`;

const iconAlt1 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53l3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68a.5.5 0 0 1-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z"/></svg>`;
const iconAlt2 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14L6 17h12l-3.86-5.14z"/></svg>`;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];

  if (!activeTab.url.startsWith('https://www.youtube.com/watch')) {
    const main = document.querySelector('main');
    main.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('notice');
    div.innerHTML =
      '<span>This extension is only for Youtube watch page.</span><svg class="notice-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
    main.appendChild(div);
  }

  const img = document.querySelector('.thumbnail');
  img.setAttribute('alt', 'Thumbnail');

  const activeTabUrl = new URL(activeTab.url); // or do whatever you need

  const params = new URLSearchParams(activeTabUrl.search);

  let thumbnailUrl = `https://img.youtube.com/vi/${params.get('v')}/maxresdefault.jpg`;

  img.style['background-image'] = `url('${thumbnailUrl}')`;

  const menuDownload = document.querySelector('.menu-btn-download');
  menuDownload.addEventListener('click', () => {
    const date = new Date();
    download(thumbnailUrl, `thumbnail-${date.yyyymmdd()}.jpg`);
  });

  let alt = true;

  const menuAlt = document.querySelector('.menu-btn-alternative');
  menuAlt.addEventListener('click', () => {
    if (alt) {
      thumbnailUrl = `https://img.youtube.com/vi/${params.get('v')}/0.jpg`;
      img.style['background-image'] = `url('${thumbnailUrl}')`;
      menuAlt.innerHTML = iconAlt1;
      alt = false;
    } else {
      thumbnailUrl = `https://img.youtube.com/vi/${params.get('v')}/maxresdefault.jpg`;
      img.style['background-image'] = `url('${thumbnailUrl}')`;
      menuAlt.innerHTML = iconAlt2;
      alt = true;
    }
  });

  const menuOpen = document.querySelector('.menu-btn-open');
  menuOpen.addEventListener('click', () => {
    chrome.tabs.create({ url: thumbnailUrl });
  });

  let resize = 'small';

  const menuResize = document.querySelector('.menu-btn-size');
  menuResize.addEventListener('click', () => {
    if (resize === 'small') {
      document.documentElement.setAttribute('style', '--resize-factor: 4.5');
      menuResize.innerHTML = iconSmaller;
      resize = 'big';
    } else {
      document.documentElement.setAttribute('style', '--resize-factor: 2');
      menuResize.innerHTML = iconBigger;
      resize = 'small';
    }
  });
});

Date.prototype.yyyymmdd = function () {
  const mm = this.getMonth() + 1; // getMonth() is zero-based
  const dd = this.getDate();
  const hh = this.getHours();
  const min = this.getMinutes();
  const sec = this.getSeconds();

  return [
    this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
    (hh > 9 ? '' : '0') + hh,
    (min > 9 ? '' : '0') + min,
    (sec > 9 ? '' : '0') + sec,
  ].join('');
};

function download(url, filename) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(console.error);
}
