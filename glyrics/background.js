
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('gaana.com') > -1 || tab.url.indexOf('grooveshark.com') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};


function addLyrics(tab) {
  chrome.tabs.executeScript(null,{file: "content_script.js"});
  chrome.tabs.insertCSS(null,{file: "lyrics.css"});
}

function iconClicked(tab){
  console.log(tab.id+' '+tab);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {message: "ShowLyrics"});
});
}

//chrome.pageAction.onClicked.addListener(addLyrics);
chrome.pageAction.onClicked.addListener(iconClicked);

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

