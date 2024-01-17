import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Logout, Menu as Menuicon } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import GroupInfoModal from "./GroupInfoModal";
import { Chip, Divider } from "@mui/material";

type userType = {
  user: { email?: string };
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
          {path !== "/" && (
            <span id="moreGroupsButton">
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() => navigate("/")}
                style={{ textTransform: "none" }}
              >
                More groups
              </Button>
            </span>
          )}
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
            sx={{
              mt: "1px",
              "& .MuiMenu-paper": {
                backgroundColor: "rgb(60,60,60)",
                color: "wheat",
              },
            }}
          >
            <Divider>
              <Chip label="Username" color="success" />
              <MenuItem id="MenuItemInv">{user?.email}</MenuItem>
            </Divider>
            <Divider variant="fullWidth" />
            {path !== "/" && (
              <>
                <MenuItem id="MenuItemNorm" onClick={handleModalOpen}>
                  Group Info
                </MenuItem>
                <span id="showGroupsMenu">
                  <MenuItem
                    onClick={() => navigate("/")}
                    style={{ fontFamily: "monospace" }}
                    id="MenuItemNorm"
                  >
                    More Groups
                  </MenuItem>
                </span>
                <Divider variant="middle" />
              </>
            )}
            <MenuItem
              onClick={logOut}
              style={{ color: "red", fontFamily: "monospace" }}
              id="MenuItemNorm"
            >
              {" "}
              <Logout />
              Logout
            </MenuItem>
            {/* <MenuItem
              onClick={handleClose}
              style={{ fontSize: "0.8rem", color: "GrayText" }}
            >
              About app
            </MenuItem> */}
          </Menu>
        </div>
      ) : (
        <Button
          variant="outlined"
          size="large"
          color="inherit"
          onClick={signIn}
          style={{ fontWeight: 1500, fontFamily: "monospace" }}
          id="MenuItemNorm"
        >
          Log In
        </Button>
      )}
      <GroupInfoModal openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}
