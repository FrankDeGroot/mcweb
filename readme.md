# Minecraft Web Console

# Prerequisites

- Linux Container
- JRE for running, JDK for tests
- Deno

# Requirements

- Sets up base directory with common files.
- Allows selecting desired Minecraft version to run.
- Downloads and sets up desired Minecraft version.
- Allows creating and selecting worlds.
- Allows moving worlds to newer Minecraft version.
- Allows setting gamerules.
- HTTPS: add a `site.cer` and `site.key` in the project root.
- Username & Password authentication.
- Keep web page updated with changes on server.
- Allows at most one Minecraft version running at any time.

# Implementation

- Backend
  - Runs in [deno](https://deno.land).
  - Web server for static files.
  - Web Sockets for API communication.
- Frontend
  - Uses [µhtml](https://github.com/WebReflection/uhtml).
  - Uses Web Sockets.

# Minecraft Directory Structure

- `mc`: Base directory.
  - `common`: items shared across versions.
    - `*`: Configuration files shared across versions.
    - `logs`: Shared directory for log files.
  - `current`: Link to running or selected to run Minecraft version.
  - `release`: Link to latest release.
  - `snapshot`: Link to latest snapshot.
  - `*`: Downloaded or modded Minecraft version.
    - `run.jar`: Link to runnable jar, usually `server.jar` but can be different
      for e.g. Fabric modded servers.
    - `server.jar`: Downloaded Minecraft server.
    - `*`: Links to files and `logs` directory under `common`.

# Backend Design

- Server that serves static files and can upgrade connection to Web Socket.
- On Web Socket connect sends entire state.
- Receives commands through Web Sockets and sends delta state when server state
  is updated.
- Allows only one command to be processed at a time:
  - Commands sent while busy are ignored.
  - Busy state is part of server state so connected browsers know when server is
    busy.

# Folders

- `api`: The backend files running on the server.
- `fake`: A fake Minecraft Server used for testing.
- `lib`: Files shared between the backend and the backend common test code.
- `mc`: The Minecraft Servers (not committed to git).
- `mocks`: Alternate files used during testing (instead of the one in
  `backend`).
- `test`: Common code used for testing the backend.
- `web`: Browser files.
