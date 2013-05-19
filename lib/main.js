// Firefox version of Reddit+

// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var Request = require("request").Request;

var localFiles = {
	"button.png" : self.data.url("button.png"),
	"button-close.png" : self.data.url("button-close.png"),
	"loading.gif" : self.data.url("loading.gif")
};

// Create a page mod
pageMod.PageMod({
	include: "*.reddit.com",
	contentScriptOptions : localFiles,
	contentScriptFile: [
		self.data.url('zepto.min.js'),
		self.data.url('magpopup.js'),
		self.data.url('firefox.js'),
		self.data.url('redditplus.js')
	],
	contentStyleFile: [
		self.data.url('redditplus.css'),
		self.data.url('magpopup.css')
	],
	onAttach: function(worker) {
		worker.port.on('do_xhr', function(url) {
			console.log("XHR");
			Request({
				url: url,
				onComplete: function (response) {
					console.log("XHR Back");
					worker.port.emit("do_xhr", response.text);
				}
			}).get();
		});
	}
});


// OLD
/*
var widgets = require("sdk/widget");

 
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    var scriptSource = "http://code.jquery.com/jquery.js";
    
  }
});
*/
