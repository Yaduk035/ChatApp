import { Button } from "@mui/material";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookie = new Cookies();

const SignInpage = () => {
  const signInGoogle = async () => {
    const userData = await signInWithPopup(auth, provider);
    console.log(userData);
    cookie.set("refresh-token", userData?.user?.refreshToken);
  };

  return (
    <div>
      <Button variant="contained" onClick={signInGoogle}>
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInpage;
