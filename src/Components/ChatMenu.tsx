import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Menu as Menuicon } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import GroupInfoModal from "./GroupInfoModal";

type userType = {
  user: object | undefined | null;
};

export default function ChatMenu({ user }: userType) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const open = Boolean(anchorEl);

  const location = useLocation();
  const path = location.pathname;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleModalOpen = (): void => {
    setOpenModal(true);
  };

  return (
    <>
      {user ? (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{ outline: "none", color: "wheat", fontFamily: "monospace" }}
          >
            <Menuicon style={{ fontSize: "2rem" }} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {path !== "/" && (
              <MenuItem onClick={handleModalOpen}>Group Info</MenuItem>
            )}
            <MenuItem onClick={logOut} style={{ color: "red" }}>
              Logout
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              style={{ fontSize: "0.8rem", color: "GrayText" }}
            >
              About app
            </MenuItem>
          </Menu>
        </div>
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
      <GroupInfoModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}
