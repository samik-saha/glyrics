chrome.app.runtime.onLaunched.addListener(launchApp);

chrome.runtime.onMessageExternal.addListener(function(request, sender,
		sendResponse) {
	if (request.msgType === "LaunchApp") {
		console.log("Request received to launch app from extension");
		launchApp();
	}
	if (request.msgType === "Version") {
		sendResponse({version: 1.2});
	}
});

function launchApp() {
	chrome.app.window.create('window.html', {
		'bounds' : {
			width: 360,
		    height: 540
		},
		'id':'glyrics-app'
	});
}