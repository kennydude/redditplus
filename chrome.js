function inject_script(script){
    chrome.runtime.sendMessage({ "script" : script });
}
