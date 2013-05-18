function inject_script(script){
    chrome.runtime.sendMessage({ "script" : script });
}
function get_file(file){
    return chrome.extension.getURL("data/"  + file);
}
