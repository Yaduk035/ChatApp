import "./App.css";
import ChatScreen from "./Components/ChatScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Config/Firebase";
import Header from "./Components/Header";
import { Routes, Route } from "react-router-dom";
import AddGroup from "./Components/AddGroup";
import Layout from "./Components/Layout";
import PageNotFound from "./Components/PageNotFound";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Header user={user} />
      {/* {user && <ChatScreen />} */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {user && <Route path="/" element={<AddGroup />} />}
          {user && <Route path="/groups/:groupName" element={<ChatScreen />} />}
          <Route path="/*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
