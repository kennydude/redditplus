chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
	var script = [];
	var scriptSource = request.script;
	script.push('var head = document.getElementsByTagName("head")[0];');
	script.push('var script = document.createElement("script");');
	script.push('script.type = "text/javascript";');
	script.push('script.src = "' + scriptSource + '";');
	script.push('head.appendChild(script);');
	chrome.tabs.executeScript(null, { code: script.join('') });
});