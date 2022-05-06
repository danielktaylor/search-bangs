const pattern = '*://www.google.com/search*'
const lookup = {}
const noQueryURL = {}

fetch('https://duckduckgo.com/bang.js')
  .then(data => data.json())
  .then(json => {
    json.forEach(entry => {
      noQueryURL[entry.t] = entry.d
      lookup[entry.t] = entry.u
    })
  })
  .catch(e => console.error(e))

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
  if (lookup[bang] === undefined) {
    // Unknown bang
    return {
      cancel: false
    }
  }
  
  let newURL = lookup[bang]
  let searchTerms = query.replace("!".concat(bang),"")
  if (searchTerms.trim() === '') {
    // Bare bang with no search terms
    newURL = "https://" + noQueryURL[bang]
  }
  
  return {
    redirectUrl: newURL.replace('{{{s}}}', encodeURIComponent(searchTerms))
  }
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: [pattern], types: ['main_frame'] },
  ['blocking']
)
