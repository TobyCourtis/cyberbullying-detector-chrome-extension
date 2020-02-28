const request = require('request');

const serverURL = "https://127.0.0.1:8080/"; // change to your given server URL

'use strict';

// code here is for the content.js (content script file)
// bundled into bundle_content.js

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        chrome.runtime.sendMessage(
            "Sending for tab refresh",
            function (response) {
                // console.log(response);
            }
        );
    }
});

var params = {
	subtree : true,
	childList: true,
	attributes: true
};

function callback(mutationList, the_observer) {
    if (window.location.hostname != "this.com"){
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length && mutation.addedNodes){
            Array.prototype.forEach.call(mutation.addedNodes, function (addedNode) {
                node_tree(addedNode);
            });
        }
      });
    }
}

function filterOfNodes(node, avoidRecurse) {

	// validate node
	if(!node || !node.parentElement){
		return NodeFilter.FILTER_REJECT;
	}

	// Ignore certain element types
	var ignoreElemTypes = ['SCRIPT', 'INPUT', 'TEXTAREA'];
	if(ignoreElemTypes.indexOf(node.parentElement.nodeName) !== -1) {
		return NodeFilter.FILTER_REJECT;
	}

	// validate that content is not editable
	if(node.isContentEditable) {
		return NodeFilter.FILTER_REJECT;
	}

	// check that content not hidden or none
	var hiddenDisp = ['hidden', 'none'];
	if(hiddenDisp.indexOf(window.getComputedStyle(node.parentElement).display) != -1) {
		return NodeFilter.FILTER_REJECT;
	}

	// filter for child nodes
	if(!avoidRecurse) {
		var hasAChild = Array.prototype.reduce.call(node.childNodes, function (bool, childElem) {
			var filtVal = filterOfNodes(childElem, true);
			var validChild = (filtVal === NodeFilter.FILTER_ACCEPT && childElem.childElementCount);
			return bool || validChild;
		}, false);
		if(hasAChild) {
			return NodeFilter.FILTER_SKIP;
		}
	}

	return NodeFilter.FILTER_ACCEPT;
}


function node_tree(start_node){
    var my_tree_walker = document.createTreeWalker(
        start_node,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: filterOfNodes
        },
        false
    );
    var nodeList = [];
    while(my_tree_walker.nextNode()) nodeList.push(my_tree_walker.currentNode);
    for (i = 0; i < nodeList.length; i++) {
        if (true){
            var text_content = nodeList[i].innerText;
            var nodeName = nodeList[i].nodeName;
            var nodeClass = nodeList[i].className;
            var role = nodeList[i].getAttribute("role");
            if (text_content != undefined && text_content != "" && text_content != " " && text_content != "Videos" && text_content != "Like" && text_content != "like" && nodeName != "DIV" && nodeName != 'TEXTAREA' && nodeName != 'OPTION' && nodeName != 'SELECT' && !(nodeClass.includes("u-hiddenVisually")) && !(nodeClass.includes("actionCount")) && !(nodeClass.includes("_mh6 _wsc")) && /[a-z]/i.test(text_content) && !(/[0-9][m]/.test(text_content)) && !(/[0-9][w]/.test(text_content)) && role != "button" && nodeClass != "_2yav" && text_content != "messenger" && text_content != "Messenger" && nodeClass != "_mh6 _wsc" && nodeClass != "_1tqi"){
                get_classification_node(text_content,nodeList[i]);
            }
        }
    }
}

window.addEventListener("load", onloadFunction,false);
count = 0;

var the_observer = new MutationObserver(callback);


function onloadFunction() {
    chrome.storage.local.get(['is_active'], function(result) {
        if (result.is_active == true){
            document.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, i, span, strong, em, b, cite').forEach(function(node) {
                // Do whatever you want with the node object - if bullying then blur
                var node_text = node.innerText;
                if (node_text != undefined && node_text != "" && node_text != " " && !(node.className.includes("_mh6 _wsc")) && !(node.className.includes("_1tqi")) && !(node.className.includes("u-hiddenVisually")) && !(node.className.includes("tweet")) && !(node.className.includes("Tweet")) && node_text != "Videos" && node_text != "Like" && node_text != "Shortcuts" && node_text != "like" && node_text != "Messenger" && node_text != "Tweets" && node_text != "Followers" && node_text != "messenger"){
                    get_classification_node(node_text,node);
                }
            });
            the_observer.observe(document, params);
        }
    });
}
function remove_blur() {
    this.style.webkitFilter =  "blur(0px)";
}

function get_classification(message){
    var jsonVariable = {"classify_text" : message};
    request({
        url: serverURL + 'classify_binary',
        method: 'POST',
        json: jsonVariable
    }, function(err, resp, body){
            if(err){
                console.log('Error has occured');
                console.log(err);
            }
            var text = JSON.stringify(body);
            var responseNUM = parseInt(text);
            console.log("Found from post:");
            console.log(responseNUM);
            if (responseNUM == 0){
                // no bullying detected
                return 0;
            } else if (responseNUM == 1) {
                // bullying detected
                return 1;
            } else {
                // no input detected?
                return 666;
            }
        }
   );
};

function get_classification_node(message,node){
    count += 1;
    var jsonVariable = {"classify_text" : message};
    request({
        url: serverURL + 'classify_binary',
        method: 'POST',
        json: jsonVariable
    }, function(err, resp, body){
            if(err){
                // console.log('Error has occured');
                // console.log(err);
            }
            var text = JSON.stringify(body);
            var responseNUM = parseInt(text);
            if (responseNUM == 0){
                // no bullying detected
                return 0;
            } else if (responseNUM == 1) {
                // bullying detected
                node.style.WebkitFilter = "blur(10px)";
                node.addEventListener("click", remove_blur, false);
                return 1;
            } else {
                // no input detected?
                return 666;
            }
        }
   );
};
