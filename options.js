const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

function saveOptions(e) {
  storage.sync.set({
    apple: document.querySelector('#apple').checked,
    gpm: document.querySelector('#gpm').checked,
    soundcloud: document.querySelector('#soundcloud').checked,
    spotify: document.querySelector('#spotify').checked
  });

  runtime.sendMessge("checkOptions");

  e.preventDefault();
}

function restoreOptions() {
  storage.sync.get({
    apple: true,
    gpm: true,
    soundcloud: true,
    spotify: true
  }, (values) => {
    document.querySelector('#apple').checked = values.apple;
    document.querySelector('#gpm').checked = values.gpm;
    document.querySelector('#soundcloud').checked = values.soundcloud;
    document.querySelector('#spotify').checked = values.spotify;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
