function get_file(file){
    return chrome.extension.getURL("data/"  + file);
}
var get_xhr = $.get;
