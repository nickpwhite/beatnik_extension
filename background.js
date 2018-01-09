const webRequest = typeof browser !== 'undefined' ? browser.webRequest : chrome.webRequest;

const excludeRegex = /https:\/\/beatnik-app\.herokuapp\.com|https:\/\/play\.google\.com/
const redirectUrls = ["*://itunes.apple.com/us/album/*", "*://play.google.com/music/m*", "*://soundcloud.com/*", "*://open.spotify.com/*"];

let tabId;

function redirect(requestDetails) {
  const origin = typeof browser !== 'undefined' ? requestDetails.originUrl : requestDetails.initiator;
  if (origin && origin.match(excludeRegex)) {
    tabId = requestDetails.tabId;
  }
  if (origin && !origin.match(excludeRegex) && tabId != requestDetails.tabId) {
    return {
      redirectUrl: `https://beatnik-app.herokuapp.com/convert?q=${requestDetails.url}`
    };
  }
}

webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: redirectUrls },
  ["blocking"]
);
