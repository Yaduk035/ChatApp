import "./App.css";
import ChatScreen from "./Components/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Config/Firebase";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import AddGroup from "./Components/AddGroup";
import Layout from "./Components/Layout";
import PageNotFound from "./Components/PageNotFound";
import InvitePage from "./Components/InvitePage";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      {!user && <Header user={user} />}
      {/* {user && <ChatScreen />} */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {user && <Route path="/" element={<AddGroup user={user} />} />}
          {user && (
            <Route
              path="/groups/:groupName"
              element={<ChatScreen user={user} />}
            />
          )}
          <Route
            path="/invite/:groupName/:invId"
            element={<InvitePage user={user} />}
          />
          <Route path="/*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
