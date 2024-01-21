import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ArrowDropDown } from "@mui/icons-material";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config/Firebase";
import { deleteObject, ref } from "firebase/storage";
import { Divider, Tooltip } from "@mui/material";

type msgMenu = {
  msgId: string;
  groupName: string;
  imagePath?: string;
  setisMsgDeleted: (value: boolean) => void;
};

export default function MsgDelMenu({
  msgId,
  groupName,
  imagePath,
  setisMsgDeleted,
}: msgMenu) {
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
      setisMsgDeleted(true);
      if (imagePath) {
        const pathRef = ref(storage, imagePath);
        await deleteObject(pathRef);
      }
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
        <Tooltip title="More options" arrow>
          <ArrowDropDown
            style={{
              transform: "translateY(-8px)",
              cursor: "pointer",
              color: "inherit",
              margin: "-8px 0 -0.5em 0",
            }}
            fontSize="large"
          />
        </Tooltip>
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
        <MenuItem
          onClick={() => {
            if (confirm("Delete message?") == true) {
              deleteMessage();
            }
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>Delete</span>
        </MenuItem>
        <Divider variant="middle" sx={{ backgroundColor: "gray" }} />
        <MenuItem onClick={handleClose}>
          <span style={{ color: "rgb(170,180,160)", fontSize: "0.7rem" }}>
            Close
          </span>
        </MenuItem>
      </Menu>
    </div>
  );
}
