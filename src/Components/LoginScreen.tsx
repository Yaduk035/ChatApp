import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";

const LoginScreen = () => {
  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <>
      <div style={{ color: "rgb(0, 90, 120)" }}>
        <h3 style={{ fontFamily: "monospace" }}>
          Sign in with google to continue
        </h3>
      </div>
      <Button
        variant="outlined"
        size="large"
        onClick={signIn}
        style={{ textTransform: "none", fontWeight: "bold" }}
      >
        <span>Sign in with</span>
        <Google
          style={{
            margin: "0 0 0 5px",
            fontSize: "1.8rem",
          }}
        />
      </Button>
    </>
  );
};

export default LoginScreen;
