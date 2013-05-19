function get_file(file){
    return self.options[file];
}

function get_xhr(url, cback){
	console.log("XHR");
	var cc = function(r){
		console.log("XHR back");
		cback(r);
		self.port.removeListener("do_xhr", cc);
	};
	self.port.on("do_xhr", cc);
	self.port.emit("do_xhr", url);
};
