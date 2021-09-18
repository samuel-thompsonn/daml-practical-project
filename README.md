# DAML Practical project

This is Sam Thompson's practical project for the titular stage of Duke
Applied Machine Learning's recruitment process.

It's a simple React app with an Express backend that allows users to control
an online avatar in a multi-person room. The server also provides a simple
API call to get the current list of connected avatars.

## Running the program
Make sure you have Node installed. After downloading the repo, run the following in the root directory:
```
cd client
npm run build
cd ..
node index
```
and connect using localhost:3001 in your browser.


> Alternatively, you could run the development build of the front end in so that you don't need to rebuild after making changes. To do that, open two terminals. In the first, use:
> ```
> cd client
> npm start
> ```
> In the second terminal, go to the root > directory and run
> ```
> node index
> ```
> then connect to localhost:3000.
---
## The design

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
        - Position history
        - Name
        - Color
- Sends updated controls data to server upon changes

### The handshake when a client first connects:
- Client notifies server that it wants to exist
- Server assigns client an ID
- Server adds client to the list of clients
- Server sends ID to client
- Server tells client list of currently connected users