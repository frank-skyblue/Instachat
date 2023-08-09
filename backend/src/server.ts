import fs from 'fs';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import { PeerServer } from 'peer';
import express, { Express }  from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { connectDB, closeDB } from '../config/db';
import initSocket from './socket';
import { typeDefs } from '../graphql/typeDefs';
import { resolvers } from './../graphql/resolvers';
dotenv.config();

declare module 'express-session' {
  interface SessionData {
    user: string;
  }
}

const corsConfig = {
  origin: process.env.NODE_ENV === "production" ? [process.env.REACT_FRONTEND_URL!, process.env.REACT_FRONTEND_URL_WWW!] : "http://localhost:3000",
  credentials: true
}

const app: Express = express();
app.use(cors(corsConfig));

const store = MongoStore.create({ clientPromise: connectDB(), ttl: 60 * 60 * 24 });
const sessionHandler = session({
  secret: 'abcdef',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
})
app.use(sessionHandler);

app.use((req, res, next) => {
  if (req.session.user !== undefined) {
    res.cookie('user', req.session.user, { path: '/', maxAge: 1000 * 60 * 60 * 24, secure: process.env.NODE_ENV === "production", domain: process.env.NODE_ENV === "production" ? "instachatapp.me": undefined });
  }
  next();
});

/* Apollo Server setup is based on https://www.apollographql.com/docs/apollo-server/getting-started/ */
/* TypeDefs and Resolvers format are also adapted from the above link */
const apollo = new ApolloServer({ typeDefs, resolvers, context: ({ req, res }) => ({ req, res }) })
apollo.start().then(() => {
  apollo.applyMiddleware({ app, cors: corsConfig });

  let server = null;
  if (process.env.NODE_ENV === "production") {
    const httpsOptions = {
      cert: fs.readFileSync('./ssl/instachatapp_me.crt'),
      ca: fs.readFileSync('./ssl/instachatapp_me.ca-bundle'),
      key: fs.readFileSync('./ssl/instachatapp_me.key')
    }
    server = https.createServer(httpsOptions, app)
    initSocket(server, sessionHandler);
    server.listen(process.env.PORT, (): void => {
      console.log(`Application started on https://instachatapp.me:${process.env.PORT}`);
    });
    PeerServer({ port: parseInt(process.env.PEER_PORT!), ssl: httpsOptions as any });
  } else {
    server = http.createServer(app);
    initSocket(server, sessionHandler);
    server.listen(process.env.PORT, (): void => {
      console.log(`Application started on http://localhost:${process.env.PORT}`);
    });
    PeerServer({ port: parseInt(process.env.PEER_PORT!) });
  }
});

process.on('SIGINT', () => {
  apollo.stop();
  closeDB();
  process.exit(0);
});