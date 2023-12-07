import { useState } from "react";
import "./App.css";
import ChatScreen from "./Components/ChatScreen";
import SignInpage from "./Components/SignInpage";
import Cookies from "universal-cookie";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Config/Firebase";

const cookie = new Cookies();

function App() {
  const [authToken, setAuthToken] = useState<string | null>(
    cookie.get("refresh-token")
  );

  const [user] = useAuthState(auth);

  return <>{user ? <ChatScreen /> : <SignInpage />}</>;
}

export default App;
