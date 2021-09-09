# Process Manager
This project is ran as a child process of Electron's main process as a sort of backend. The reason for this is to keep the Electron main process light as it will grow drastically.

This is designed in such a way it should be easy to swap the NodeIPC for a network protocol as this would allow multi node process managment.


## Websocket Authentication
First the client sends a message in this format 'id:secret' which authenticates the client. Upon success for now the connection is live, in the future the client and server will exchange brand new public and private keys.  


## Networking
At some point it'd be nice to make Jank a fully distributed system on the backend, in a pratical sense. I would like it so Jank has a list of nodes and it's easy to open an ssh connection in one click to them, and Jank can inteligently route to multiple process managers at once. The process manager may end up becoming a main node for a remote child node type that solely handles a single process on a remote machine.