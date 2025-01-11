import { createBrowserRouter } from "react-router-dom";
import Whispser from "./components/Whisper";
import Settings from "./components/Settings";
import Layout from "./Layout";
import WhisperSettings from "./components/Settings/WhisperSettings";
import AboutMe from "./components/Settings/AboutMe";
import NormalSettings from "./components/Settings/NormalSettings";
import { WhisperDetail } from "./components/WhisperDetail";

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
      { path: "whisper", children:[ 
        { index: true, element: <Whispser /> },
        { path: ":id", element: <WhisperDetail /> } // 新增详情页
        ]
      },
      { path: "user", element: <User /> },
      { path: "theme", element: <div /> },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "normal_settings",
            element: <NormalSettings />,
          },
          {
            path: "whisper_settings",
            element: <WhisperSettings />,
          },
          {
            path: "about_me",
            element: <AboutMe />,
          },
        ],
      },
    ],
  },
]);
