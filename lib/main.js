// Firefox version of Reddit+

// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var localFiles = {
  "button.png" : self.data.url("button.png"),
  "button-close.png" : self.data.url("button-close.png")
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
    worker.port.on('inject_script', function(scriptSource) {
      var script = [];
      script.push('var head = document.getElementsByTagName("head")[0];');
      script.push('var script = document.createElement("script");');
      script.push('script.type = "text/javascript";');
      script.push('script.src = "' + scriptSource + '";');
      script.push('head.appendChild(script);');
      tabs.activeTab.attach({
        contentScript: script.join("")
      });
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