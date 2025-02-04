chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message) {
    sendResponse({ message: request.message });
  }
});
