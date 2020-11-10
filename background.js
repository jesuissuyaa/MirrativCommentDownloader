chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('moved to ' + changeInfo.url)
        chrome.tabs.sendMessage(tabId, {
            message: 'navigated',
            url: changeInfo.url
        })
    }
})