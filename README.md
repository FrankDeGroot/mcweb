# mcweb
Rudimentary web interface for minecraft server

# Requirements
* Ubuntu 18.04
* NginX
* node 8+ with matching npm
* certbot

# Setup
* `setup`

# Application Insights Instrumentation Key
Add a file `.keys.js` with the below contents to configure the Instrumentation Key:
```javascript
module.exports.applicationInsightsInstrumentationKey = '<your key>'
```