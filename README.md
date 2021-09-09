# DAML Practical project

### To be implemented:
- User interface to allow name selection, connection, disconnection
- Server API to get list of current clients
- User display next to canvas that shows current clients
- Differentation between clients (name + color select?)

## The design:

### Server:
- Responds to socket requests when new clients join:
    - Creates a new avatar associated with new client
    - Creates a new key map associated with new client
    - Sends locations of all clients to new client
- Responds to controls by clients
    - When a client provides a map (JSON) showing what buttons they are
    pressing, the server updates the value and stores it locally
- Notifies clients of time advancing
    - When time advances, server calculates new position of each avatar
    based on controls, then sends the positions to each client

### Client:
- Establishes socket connection
    - Provides a name
- Visualizes most recent server data
    - Keeps a list of avatar objects that are rendered based on:
        - Position
        - Name
        - Color?/Other characteristic
- Sends updated controls data to server upon changes

### The handshake when a client first connects:
- Client notifies server that it wants to exist
- Server assigns client an ID
- Server adds client to the list of clients
- Server sends ID to client