import "./App.css";
import ChatScreen from "./Components/ChatScreen";
import SignInpage from "./Components/SignInpage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Config/Firebase";
import Header from "./Components/Header";

function App() {
  const [user] = useAuthState(auth);
  console.log(user);

  return (
    <>
      <Header user={user} />
      {user && <ChatScreen />}
    </>
  );
}

export default App;
