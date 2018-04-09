const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;
const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const webRequest = typeof browser !== 'undefined' ? browser.webRequest : chrome.webRequest;

const originExcludeRegex = /https:\/\/beatnik-app\.herokuapp\.com/
const redirectUrls = ["*://itunes.apple.com/us/album/*", "*://play.google.com/music/m*", "*://soundcloud.com/*", "*://open.spotify.com/album/*", "*://open.spotify.com/track/*"];

let urlIncludeRegex;

RegExp.escape = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function updateOptions() {
  storage.sync.get({
    apple: true,
    gpm: true,
    soundcloud: true,
    spotify: true
  }, (values) => {
    let urlIncludes = [];

    if (values.apple) {
      urlIncludes.push("https?://itunes.apple.com/us/album/");
    }
    if (values.gpm) {
      urlIncludes.push("https?://play.google.com/music/m/");
    }
    if (values.soundcloud) {
      urlIncludes.push("https?://soundcloud.com/");
    }
    if (values.spotify) {
      urlIncludes.push("https?://open.spotify.com/");
    }

    urlIncludeRegex = urlIncludes.length > 0 ? new RegExp(urlIncludes.join('|')) : /a^/;
  });
}


function redirect(requestDetails) {
  const origin = typeof browser !== 'undefined' ? requestDetails.originUrl : requestDetails.initiator;

  if (urlIncludeRegex.test(requestDetails.url) && (!originExcludeRegex.test(origin))) {
    return {
      redirectUrl: `https://beatnik-app.herokuapp.com/convert?q=${requestDetails.url}`
    };
  }
}

storage.onChanged.addListener(updateOptions)

webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: redirectUrls },
  ["blocking"]
);

updateOptions();
