import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ArrowDropDown } from "@mui/icons-material";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config/Firebase";
import { ref } from "firebase/storage";

type msgMenu = {
  msgId: string;
  groupName: string;
  imagePath?: string;
};

export default function MsgDelMenu({ msgId, groupName, imagePath }: msgMenu) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteMessage = async () => {
    if (!msgId) console.log("Error deleting message.");
    try {
      await deleteDoc(doc(db, groupName, msgId));
      //   const pathRef = ref(storage,imagePath)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button> */}
      <span onClick={handleClick}>
        <ArrowDropDown
          style={{
            transform: "translateY(2px)",
            cursor: "pointer",
            color: "inherit",
            margin: "-8px 0 -5px 0",
          }}
          fontSize="medium"
        />
      </span>

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
        <MenuItem onClick={deleteMessage}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
