import { RocketLaunchSharp } from "@mui/icons-material";
import { Button } from "@mui/material";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import ChatMenu from "./ChatMenu";
import { Google } from "@mui/icons-material";

type userType = {
  user: object | undefined | null;
};

const Header = ({ user }: userType) => {
  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <header>
          <Link to={"/"}>
            <RocketLaunchSharp fontSize="large" />
          </Link>
          <div>
            {/* {user && (
              <span style={{ marginRight: "0.9rem" }}>
                <Link to={"/"}>
                  <Button color="inherit" variant="outlined">
                    Groups
                  </Button>
                </Link>
              </span>
            )} */}
            {user ? (
              <ChatMenu user={user} />
            ) : (
              // <Button
              //   variant="outlined"
              //   size="large"
              //   color="inherit"
              //   onClick={logOut}
              // >
              //   Log Out
              // </Button>
              <Button
                variant="outlined"
                size="large"
                color="warning"
                onClick={signIn}
              >
                <Google style={{ margin: "0 8px 0 0", fontSize: "1.3rem" }} />
                Sign In
              </Button>
            )}
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
