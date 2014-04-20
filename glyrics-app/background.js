chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'width': 300,
      'height': 500
    },
	'alwaysOnTop':true
  });
});