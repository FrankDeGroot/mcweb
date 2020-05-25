# mcweb
Rudimentary web interface for minecraft server

# Requirements
* node 8+ with matching npm
* certbot

# Setup
* Create a `.config.js` like:
```javascript
module.exports = {
	pemPath: '/path/to/certs', // Optional path to certificates, also switches between http and https.
	port: 8080 // Optional port, otherwise 80/443 is used.
}
```
