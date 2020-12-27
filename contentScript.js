chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type == "title and url") {
    var title = document.getElementsByTagName("title")[0];

    sendResponse(title.textContent);
  }
});
