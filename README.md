# CSCC09 Project Deliverable
This is a project for my web programming course where I collaborated with 2 other individuals. 

To test this application, please run the `docker-compose.yml` file in the root directory.

## Project URL

https://instachatapp.me or https://www.instachatapp.me

## Project Video URL 

https://www.youtube.com/watch?v=pXjJU4U7hWo&feature=youtu.be

**Note**: There are some limitations to this demo
* The part demoing rooms is done on one computer since it would be difficult to record otherwise
  * The site should still work across multiple computers and more than two users
* Voice chat wasn’t demoed but should work


## Project Description

**InstaChat** is a web application that allows its users to create an account, sign into the application, and create a room or join an existing room. 

Inside each room, users can interact with other users via video/voice chat and share a whiteboard where each user can freely draw using different colors, put shapes, and erase any part of the drawing.

## Development

**Technology:**
* The frontend technology for UI is React (with TypeScript enabled)
* For the most part the backend is comprised of NodeJS (Express), GraphQL, and a Database (MongoDB)
* NodeJS files on the backend are with Typescript enabled.

**User Interface:**
* The UI is styled using react-bootstrap for the most part, with custom CSS in some places to bring the UI elements together. 
* Many of the icons are sourced from flaticon.

**Rooms/Whiteboard/Calls:**
* KonvaJS library is used to display the whiteboard
* Socket.io (WebSocket) is used to
  * Allow users to start and join specific separate rooms
  * Broadcast whiteboard changes to everyone in a room
  * Coordinate WebRTC connections
* PeerJS (WebRTC) is used for transmitting audio and video data for calls

**GraphQL:**
* Implemented using Apollo Server. 
* Express is responsible for passing the requests to the GraphQL server. 
* Apollo Client is used for React to communicate with Apollo Server

**Database:**
* We used MongoDB, specifically we use the MongoDB Atlas
* This allows us to connect to the database with just a connection string and not worry with maintaining a specific database server

**Sessions:**
* Handled with express-session with the store configured to be MongoDB.
* Sessions are passed into Apollo Server to deal with signin/signup/signout

## Deployment

The application is deployed using docker containers. There are 2 docker containers, one for the frontend and one for the backend. Frontend is running on port 80 and 443 (due to http redirect to https). Backend is running on port 5000 (for GraphQL server) and 5001 (for webRTC with PeerJS). We used DigitalOcean as the web hosting service and got a domain name from Namecheap. SSL certificate is also obtained from Namecheap.

The application is secured with SSL as follows; frontend is served by nginx which is configured with ssl and by telling where nginx can find the certificate and the private key. Backend is served using express where SSL is configured using the https library and setting the correct options.

CORS policy is configured on the backend such that it only accepts origin from https://instachatapp.me or https://www.instachatapp.me. As there are credentials being sent such as cookies and session id,  
`credentials = “include”` is set for apollo client on the frontend and `credentials = true` is set for the backend.

## Maintenance

Since the github repository is configured with github actions to have continuous integration and continuous deployment, one of the first things we checked is if we have a green checkmark behind the commits to the main branch. If there was a red x, then we would open the action up and examine what part went wrong and try to fix it.

If the deployment process was fine then our next focus was to test the application on the production environment. This was necessary to ensure it was working well since the application is configured slightly differently when it is deployed on the web. One of the major differences is that our local testing environment uses http while the production environment uses https. 

If no errors are produced then our next step was to simulate actual users. As the application is deployed on the web, between our team as well as our friends we can register and use the website. This allowed us to monitor the behavior of the application when it encounters multiple users as well as allowed a thorough testing of the web socket and webRTC implementation we have with the whiteboard and voice/video.

In addition to all this, we would also monitor the cpu and network usage metrics that DigitalOcean provides on the dashboard. This is to ensure that the deployed application is not abnormally taking up alot of cpu or network resources as those might indicate that our application is not performing well.

If all of these went smoothly then we would be fairly confident that the application is working as expected.

## Challenges

1. Saving and sending whiteboard state to users joining a room

   Ultimately, the solution was fairly simple, but the process to get there was complicated. My initial thought was to use MongoDB or Redis to store the whiteboard. Free-hand drawn lines have a lot of points and in order for the whiteboard to update in real time, each point is sent to the server as it’s placed. This leads to a lot of individual messages to the server and a lot of potential database or cache operations. As a result, I had to do research and put thought into how I store things to minimize this. Fortunately, I realized that there was no need for the server to store everything. The users in a room already had the whiteboard state stored and my server could ask one of them to send that state to a new user.

2. Adding shapes support to the whiteboard

   The challenge came from the lack of resources that guide you on how to implement a whiteboard with the functionality we are looking for (free drawing, erase, shapes) using KonvaJS with React, so I relied on the official documentation for KonvaJS, which was fairly confusing since I have never worked on a canvas application before. The difficult part was incorporating pen/eraser functionality with shapes support, because the eraser functionality was essentially drawing some white lines over the existing painting (which did not interact so well with shapes), so I had to design the interaction between the two elements (lines and shapes), for which the solution I came up with was to treat these two elements separately. I believe that this separation was necessary due to how our application interacted with socket.io (sending arrays of lines and shapes to other users). In conclusion, the parts that made this functionality difficult to implement was the research on the KonvaJS library (and canvas applications in general) and supporting lines/shapes over multiple users.

3. GraphQL setup (frontend and backend)

   This was a bit of a challenge since GraphQL is a new concept to all the members of the group. We all had experience with designing a web application in a previous course; however, we used REST to implement the backend. The concept behind GraphQL is very different from REST since instead of URL endpoints to handle requests and send responses, GraphQL introduces resolver functions that will accept arguments and return an object. The overall documentation on how to set up GraphQL as well as implement many of the functions we need were fairly abundant; however, it took time to get used to the GraphQL structure since at times we were still thinking of implementing features using the REST style.

## Contributions

**Chuan Peng Xu**
* Implemented many things related to sockets
  * Initial set up, authentication, room management (starting, joining, leaving)
* Implemented some features of whiteboard
  * Initial set up, basic free drawing, sending whiteboard state to people who just joined
* Implemented most things related to WebRTC
  * Initial set up, managing calls, private signalling server
* Set up frontend routing

**Su Tong Kong**
* Designed the UI for the signin/signout page and navigation bar
* Designed the UI for the homepage (at /whiteboard)
  * Whiteboard
  * Video Chat feed
* Improved the UI for the connect page (at /connect)
* Implemented some features of the whiteboard
  * Scaling to the browser window size on load
  * Ability to add shapes to the whiteboard
  * Size/Color selection for pen, eraser, and shapes
  * Multi-user support for pen, eraser, and shapes using socket.io
* Improved the video/voice chat functionality
  * Ability to mute/turn off cam and unmute/turn on cam

**Wen Tao Ge**
* Implemented graphql server on the backend 
  * setup with apollo server, resolver files, typedef files
* Implemented session handling with express session and made it work with apollo server
* Connected frontend signin and signup UI with the graphql server
* Implemented email verification (backend and UI)
  * Users have to signup with real emails and verification email is sent with a link
* Implemented password reset (backend and UI)
  * Password reset link is sent to the user’s email
* Responsible for all deployment related things
  * Setting up Github Actions and Workflows
  * Dockerfiles for both frontend and backend
  * Domain name purchasing on namecheap
  * Setup web hosting on DigitalOcean
  * SSL configurations

# One more thing? 

Big thanks to Professor Theirry and the TAs!
