# mcweb

Rudimentary web interface for a Minecraft Server

# Features

* TODO: Downloads and sets up a Minecraft Server
* Server side: NodeJS
* Client side: [uhtml](https://github.com/WebReflection/uhtml)
* [socket.io](https://socket.io) used to connect client and server.
* Automatically reloads (most of the) server and browser on code change without restarting the Minecraft Server.

# Requirements

* Linux (tried Ubuntu and Alpine)
* NodeJS (at least a recent LTS) for running the website.
* Java (whatever Minecraft requires) for running the Minecraft Server.
* nginx for static files serving, reverse proxy and authentication.
* A recent browser: tried Chrome and Firefox, Edge probably works too, not sure about Safari.

# Structure

* `all` code shared between `base` and `web`.
	* Base configuration.
	* IPC event names.
	* Relay logic to send events between `base` and `web`.
	* State logic that emits updates.
* `base` part of the server that runs the Minecraft Server and the API.
	* Does not reload on code change (this would kill the Minecraft server).
	* Starts Minecraft server as a child process, sends commands through stdin and captures stdout.
	* Starts `api` as a child process.
	* Starts directory watchers for `api` and `web` to trigger reloading.
* `api` part of the server that runs the Server API.
	* Reloads on code change.
* `web` static files served through nginx. Reloads on code change.
* `mc` Minecraft servers, worlds and required files.
	* `common` contains the obligatory Minecraft configuration files. Symbolic links are added in each Minecraft server directory.
	* `current` is a symbolic link to the currently running Minecraft server.
	* `fake` stub Minecraft server for testing.
	* TODO: `release` is a symbolic link to the latest downloaded release Minecraft server.
	* TODO: `snapshot` is a symbolic link to the latest downloaded snapshot Minecraft server.
	* TODO: `*` every other directory is a specific downloaded version of a Minecraft server.
