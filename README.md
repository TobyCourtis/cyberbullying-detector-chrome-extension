# cyberbullying-detector-chrome-extension
Google Chrome Extension component of the 'Cyberbullying Detector' requiring cyberbullying-detector-server to operate
<br></br>
My research paper titled ‘Towards Automated Blocking of Cyberbullying in Online Social Networks’, outlining the background and approach to producing my cyberbullying detector can be viewed [here](http://www.tobycourtis.com/wp-content/uploads/2020/04/Towards-Automated-Blocking-of-Cyberbullying-in-OSNs.pdf).
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
      - `open -n -a Google\ Chrome --args --user-data-dir=/tmp/chrome_dev_test --disable-web-security`
