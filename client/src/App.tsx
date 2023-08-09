import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Peer from "peerjs";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Connect } from "./pages/Connect/Connect";
import { connectSocket } from "./pages/helpers/socket";
import { usePeer } from "./pages/helpers/peer";
import { Verify } from "./pages/Verify";
import { Resend } from "./pages/Resend";
import { Forgot } from "./pages/Forgot";
import { Reset } from "./pages/Reset";
import { IS_SIGNED_IN } from "./pages/helpers/queries";
import Credits from "./pages/Credits";

export interface PeerStream {
  peerId: string,
  stream: MediaStream,
  call?: Peer.MediaConnection
}

interface AppContext {
  currentRoom: string,
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>,
  streams: PeerStream[],
  setStreams: React.Dispatch<React.SetStateAction<PeerStream[]>>,
  ownStream: MediaStream | null,
  setOwnStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
  signedIn: boolean,
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const appContext = createContext<AppContext | null>(null);

const uri = process.env.NODE_ENV === "production" ? process.env.REACT_APP_SERVER_URL_PROD : process.env.REACT_APP_SERVER_URL;

/* Apollo client setup is based on https://www.apollographql.com/docs/react/get-started */
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: uri + "/graphql",
    credentials: "include"
  })
});

interface RouteProps {
  auth: boolean,
  path: string,
  element: JSX.Element
}

const routes: RouteProps[] = [
  {
    auth: false,
    path: '/',
    element: <Signin />
  },
  {
    auth: false,
    path: '/signup',
    element: <Signup />
  },
  {
    auth: true,
    path: '/connect',
    element: <Connect />
  },
  {
    auth: true,
    path: '/whiteboard',
    element: <HomePage />
  },
  {
    auth: false,
    path: '/verify/:token',
    element: <Verify />
  },
  {
    auth: false,
    path: '/resend',
    element: <Resend />
  },
  {
    auth: false,
    path: '/forgot',
    element: <Forgot />
  },
  {
    auth: false,
    path: '/reset/:token',
    element: <Reset />
  }
];

function App() {
  const [currentRoom, setCurrentRoom] = useState('');
  const [streams, setStreams] = useState<PeerStream[]>([]);
  const [ownStream, setOwnStream] = useState<MediaStream | null>(null);

  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await client.query({ query: IS_SIGNED_IN });
        if (!res.error) {
          connectSocket();
          setSignedIn(true);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
      getOwnStream();
    })();
  }, []);

  const getOwnStream = async () => {
    try {
      const newOwnStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setOwnStream(newOwnStream);
    } catch (e) {
    }
  }

  usePeer(ownStream, setStreams);

  return (
    <ApolloProvider client={client}>
      <appContext.Provider value={ { currentRoom, setCurrentRoom, streams, setStreams, ownStream, setOwnStream, signedIn, setSignedIn } }>
        <BrowserRouter>
          <div className="App">
            {loading ? null :
            <Routes>
              <Route key={0} path='/credits' element={<Credits />}></Route>
              {routes.map((route, index) => {
                let elem;
                if ((route.auth && signedIn) || (!route.auth && !signedIn)) {
                  elem = route.element;
                } else if (route.auth && !signedIn) {
                  elem = <Navigate to={{ pathname: '/' }} />
                } else { // !auth && signedIn
                  elem = <Navigate to={{ pathname: '/connect' }} />
                }
                return <Route key={index + 1} path={route.path} element={elem} />
              })}
            </Routes>}
          </div>
        </BrowserRouter>
      </appContext.Provider>
    </ApolloProvider>
  );
}

export default App;
