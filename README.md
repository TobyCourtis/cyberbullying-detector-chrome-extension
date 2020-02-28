# cyberbullying-detector-chrome-extension
Google Chrome Extension component of the 'Cyberbullying Detector' requiring cyberbullying-detector-server to operate
<br></br>
How to run the Google Chrome Extension:

1) Alter content.js and popup.js
   - Change serverURL to your given Cyberbullying Detector Server
2) npm install -g browserify (see documentation [here](http://browserify.org))
   - Allow the use of require('module_name') in browser by building and bundling all dependencies
   - `browserify popup.js > bundle_popup.js`
   - `browserify content.js > bundle_content.js`
3) Add the Extension to Google Chrome browser
   - chrome://extensions/ - Load unpacked - Select the entire repository folder
   - If the certificate used with the server is not authenticated allow classification by disabling web security: 
      - `open -a Google\ Chrome --args --disable-web-security --user-data-dir=""`
