var exec = require('cordova/exec');
exports.scanDNI = function(arg0, success, error) {
    exec(success, error, "DniScanner", "scanDNI", [arg0]);
};
exports.resetUsingNFC = function(arg0, success, error) {
    exec(success, error, "DniScanner", "resetUsingNFC", [arg0]);
};