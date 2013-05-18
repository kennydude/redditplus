function inject_script(script){
    self.port.emit("inject_script", script);
}
function get_file(file){
    return self.options[file];
}