import { useState } from "react";
import { Login, RocketLaunchSharp } from "@mui/icons-material";
import { Button } from "@mui/material";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import ChatMenu from "./ChatMenu";
import { Google } from "@mui/icons-material";
import AppInfoModal from "./AppInfoModal";
import { Info } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import GroupInfoModal from "./GroupInfoModal";

type userType = {
  user: object | undefined | null;
};

const Header = ({ user }: userType) => {
  const [modal, setmodal] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const path = location.pathname;
  const { groupName } = useParams();

  const handleModal = (value: boolean) => {
    setmodal(value);
  };

  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <header>
          <Link to={"/"}>
            <RocketLaunchSharp
              fontSize="large"
              style={{ margin: "0 10px 0 10px" }}
            />
          </Link>
          {groupName && (
            <div className="GroupBadge" onClick={() => setOpenModal(true)}>
              <span
                style={{
                  fontFamily: "monospace",
                  padding: "0 10px 0 10px",
                  fontSize: "1rem",
                  color: "rgb(200 200 200)",
                  fontWeight: "bolder",
                  // color: "rgb(100 108 180)",
                }}
              >
                {groupName}
              </span>
            </div>
          )}
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
              <span style={{ display: "flex" }}>
                {path === "/" && (
                  <span style={{ margin: "10px 10px" }}>
                    <span onClick={() => handleModal(true)}>
                      <Info
                        style={{
                          cursor: "pointer",
                          fontSize: "1.7rem",
                          color: "gray",
                        }}
                      />
                    </span>
                  </span>
                )}

                <ChatMenu user={user} />
              </span>
            ) : (
              // <Button
              //   variant="outlined"
              //   size="large"
              //   color="inherit"
              //   onClick={logOut}
              // >
              //   Log Out
              // </Button>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{ margin: "10px 10px" }}>
                  <span onClick={() => handleModal(true)}>
                    <Info
                      style={{
                        cursor: "pointer",
                        fontSize: "1.8rem",
                        color: "gray",
                      }}
                    />
                  </span>
                </span>

                <Button
                  variant="outlined"
                  color="warning"
                  onClick={signIn}
                  style={{ textTransform: "none" }}
                >
                  <Login style={{ margin: "0 5px 0 0", fontSize: "1.6rem" }} />
                  Sign In
                </Button>
              </div>
            )}
            <AppInfoModal modalState={modal} setModal={handleModal} />
          </div>
        </header>
        <GroupInfoModal openModal={openModal} setOpenModal={setOpenModal} />
      </div>
    </>
  );
};

export default Header;
