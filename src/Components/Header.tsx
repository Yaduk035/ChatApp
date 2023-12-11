import { RocketLaunchSharp } from "@mui/icons-material";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";

type userType = {
  user: object | undefined | null;
};

const Header = ({ user }: userType) => {
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <header>
          <RocketLaunchSharp fontSize="large" />
          {user ? (
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={logOut}
            >
              Log Out
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={signIn}
            >
              Log In
            </Button>
          )}
        </header>
      </div>
    </>
  );
};

export default Header;
