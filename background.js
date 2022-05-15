const pattern = '*://www.google.com/search*'
let lookup = {}
let noQueryURL = {}
let extensionVersion = browser.runtime.getManifest().version

// The bang.js file doesn't tell us which URL's
// expect the search terms to NOT be URL encoded,
// So we have to hardcode this...
const noUrlEncode = ["wayback"]

function overrides() {
  // Overrides
  // bang.js doesn't always match DDG behavior :(
  noQueryURL["gm"] = "maps.google.com"
  lookup["gm"] = "https://maps.google.com/maps?hl=en&q={{{s}}}"
}

function loadBangJs() {
  console.log("RELOADING BANG JS")

  // If this ever gets ported to Chrome, might need a polyfill:
  // https://github.com/mozilla/webextension-polyfill
  fetch('https://duckduckgo.com/bang.js')
    .then(data => data.json())
    .then(json => {
      json.forEach(entry => {
        noQueryURL[entry.t] = entry.d
        lookup[entry.t] = entry.u
      })
      
      overrides()

      browser.storage.local.set({
        lookup: JSON.stringify(lookup),
        noQueryURL: JSON.stringify(noQueryURL),
        extensionVersion: extensionVersion
      })          
    })
    .catch(e => console.error(e))
}

function onError(error) {
  loadBangJs()
}

function onGot(item) {
  // Load bang.js file if the cache doesn't exist _or_ there has been an extension update
  if (item === undefined || item.lookup === undefined || item.noQueryURL === undefined || item.extensionVersion != extensionVersion) {
    loadBangJs()
    return
  }

  lookup = JSON.parse(item.lookup)
  noQueryURL = JSON.parse(item.noQueryURL)
}

// Fetch bang.js from localstorage or DDG
let cached = browser.storage.local.get(["lookup", "noQueryURL", "extensionVersion"]);
cached.then(onGot, onError);

function redirect (requestDetails) {
  const url = new URL(requestDetails.url)
  const params = new URLSearchParams(url.search)
  const query = params.get('q')
  if (query === null) return { cancel: false }
  
  let firstBangIdx = query.indexOf("!")
  if (firstBangIdx === -1) {
    // No bang found
    return {
      cancel: false
    }
  }
  
  let bang = query.substring(firstBangIdx+1,).split(" ")[0]
  if (lookup[bang.toLowerCase()] === undefined) {
    // Unknown bang
    return {
      cancel: false
    }
  }
  
  let newURL = lookup[bang.toLowerCase()]
  let searchTerms = query.replace("!".concat(bang),"")
  if (searchTerms.trim() === '') {
    // Bare bang with no search terms
    newURL = "https://" + noQueryURL[bang.toLowerCase()]
  }
  
  if (noUrlEncode.includes(bang.toLowerCase())) {
    return {
      redirectUrl: newURL.replace('{{{s}}}', searchTerms.trimStart().trim())
    }
  }
  
  return {
    redirectUrl: newURL.replace('{{{s}}}', encodeURIComponent(searchTerms.trimStart().trim()))
  }
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: [pattern], types: ['main_frame'] },
  ['blocking']
)
