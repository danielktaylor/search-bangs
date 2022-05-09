# Firefox Search Bangs

[![Firefox Add-On version](https://img.shields.io/amo/v/search-bangs?colorA=35383d)](https://addons.mozilla.org/en-US/firefox/addon/search-bangs/)

[![Firefox Add-On link](./images/firefox.png)](https://addons.mozilla.org/en-US/firefox/addon/search-bangs/)

This is a Firefox extension to add support for DuckDuckGo-style search bangs when Google.com is set as your default search engine. If you want it to work on other search engines, let me know.

Examples:

* `!tw Elon Musk` ⮕ Search Twitter for "Elon Musk"
* `New York!gm` ⮕ Search Google Maps for "New York"
* `!a Harry Potter` ⮕ Search Amazon for "Harry Potter"
* `!w` ⮕ Go to the Wikipedia homepage
* `!ddg news` ⮕ Search DuckDuckGo for "news"

Learn more about bangs at [DuckDuckGo](https://duckduckgo.com/bang).

## Why?

The *easiest* way to use search bangs is to set your search engine to DuckDuckGo!

But there are a few reasons you might want to use this extension, instead:

* You prefer Google's search results
* You've tried similar Firefox extensions and found them to be missing features:
     - Don't support standalone bangs (e.g. `!w`)
     - Don't support capitalized bangs (e.g. `!W`)
     - Don't support bangs that aren't at the beginning of the search (e.g. `New York !gm`)
     - Etc...

## Found a bug?

Please file an [issue](https://github.com/danielktaylor/search-bangs/issues).

Any behavioral differences from the way DuckDuckGo works are considered bugs.

Note that the first time you install the extension, the bang definitions file is downloaded from DuckDuckGo and cached. If you'd like to redownload it, clear the extensions storage (or just reinstall the extension).
