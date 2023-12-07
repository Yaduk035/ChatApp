import { useState } from "react";
import "./App.css";
import ChatScreen from "./Components/ChatScreen";
import SignInpage from "./Components/SignInpage";
import Cookies from "universal-cookie";

const cookie = new Cookies();

function App() {
  const [authToken, setAuthToken] = useState<string | null>(
    cookie.get("refresh-token")
  );
  return <>{authToken ? <ChatScreen /> : <SignInpage />}</>;
}

export default App;
