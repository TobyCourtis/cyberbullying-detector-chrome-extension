const request = require('request');
const serverURL = "https://127.0.0.1:8080/"; // change to given server URL

'use strict';

// code here is for the popup - popup.js file
// bundled into bundle_popup.js


document.addEventListener('DOMContentLoaded', function() {
    var automatic_button = document.getElementById("auto_button");
    chrome.storage.local.get(['is_active'], function(result) {
        if (result.is_active == undefined){
            automatic_button.value = "Press to activate automatic content blocking (inactive)";
        } else if (result.is_active == true) {
            automatic_button.value = "Press to activate automatic content blocking (active)";
        } else if (result.is_active == false) {
            automatic_button.value = "Press to activate automatic content blocking (inactive)";
        }
    });
    var link = document.getElementById("submission_button");
    link.addEventListener('click', function() {
        var sentence = document.getElementById("textClassify").value;
        get_classification(sentence);
    });
    automatic_button.addEventListener('click', function() {
        // chrome storage save as true
        chrome.storage.local.get(['is_active'], function(result) {
            if (result.is_active == undefined){
                var value = true;
                chrome.storage.local.set({is_active: value}, function() {
                  console.log("Value did not exist and has been set to: " + value);
                });
                // automatic_button needs to be active
                automatic_button.value = "Press to activate automatic content blocking (active)";
            } else if (result.is_active == true) {
                var value = false;
                chrome.storage.local.set({is_active: value}, function() {
                  console.log('New value saved to: ' + value);
                });
                automatic_button.value = "Press to activate automatic content blocking (inactive)";
            } else if (result.is_active == false) {
                var value = true;
                chrome.storage.local.set({is_active: value}, function() {
                  console.log('New value saved to: ' + value);
                });
                automatic_button.value = "Press to activate automatic content blocking (active)";
            }
        });
    });
});



function get_classification(message){
    var jsonVariable = {"classify_text" : message};
    request({
        url: serverURL + 'classify_js',
        method: 'POST',
        json: jsonVariable
    }, function(err, resp, body){
            if(err){
                console.log('Error has occured');
                console.log(err);
            }
            var text = JSON.stringify(body);
            var obj = JSON.parse(text);
            var string = obj.classification;
            document.getElementById('classification_returned').innerHTML = string;
            document.getElementById('submission_button').blur();
            document.getElementById('textClassify').focus();
            return string;
        }
   );
};
