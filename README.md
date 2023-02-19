[![Board Status](https://dev.azure.com/fjtdg/8e7df17d-2ee9-4772-8b11-99d38ba4aece/0b12a572-4783-48ce-96de-584f72fd32ed/_apis/work/boardbadge/1dfc91e5-49e1-43e9-80ee-dfcfc35d014f)](https://dev.azure.com/fjtdg/8e7df17d-2ee9-4772-8b11-99d38ba4aece/_boards/board/t/0b12a572-4783-48ce-96de-584f72fd32ed/Microsoft.RequirementCategory)
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