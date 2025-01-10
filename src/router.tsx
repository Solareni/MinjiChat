import { createBrowserRouter } from "react-router-dom";
import Audio from "./components/Audio";
import Settings from "./components/Settings";
import Layout from "./App";
import AudioSettings from "./components/Settings/AudioSettings";
import About from "./components/Settings/About";

const NewConversation = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      New Conversation
    </div>
  );
};

const Conversations = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      Conversations
    </div>
  );
};

const Discover = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      Discover
    </div>
  );
};

const User = () => {
  return (
    <div className="text-4xl font-bold dark:text-white text-black animate-fade-in">
      User
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "logo", element: <div /> },
      { path: "new_conversation", element: <NewConversation /> },
      { path: "conversations", element: <Conversations /> },
      { path: "discover", element: <Discover /> },
      { path: "audio", element: <Audio /> },
      { path: "user", element: <User /> },
      { path: "theme", element: <div /> },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "audio",
            element: <AudioSettings />,
          },
          {
            path: "about",
            element: <About />,
          },
        ],
      },
    ],
  },
]);
