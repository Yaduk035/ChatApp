import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/Firebase";
import { useParams } from "react-router-dom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

type modalType = {
  setOpenModal: ReturnType;
  openModal: boolean;
};

type groupType = {
  createdAt?: string;
  createdBy?: string;
  users?: string[];
  name: string;
  private?: boolean;
};

function AddUsersModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" color="error" onClick={handleOpen}>
        Add users
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, backgroundColor: "rgb(40,40,40)" }}>
          <h2 id="child-modal-title">Add users</h2>
          <form>
            <input
              style={{
                lineHeight: "1.5",
                background: "rgb(80,80,80)",
                outline: "none",
                border: "none",
                padding: "0 10px",
                height: "4vh",
                color: "white",
              }}
              placeholder="Enter gmail id here"
            />
          </form>
          <br />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="contained" color="error" onClick={handleClose}>
              Add user
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function ShareGroup() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const path = window.location.href;

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleOpen}>
        Share
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200, backgroundColor: "rgb(40,40,40)" }}>
          <h2 id="child-modal-title">Share group</h2>
          <form>
            <input
              style={{
                lineHeight: "1.5",
                background: "rgb(80,80,80)",
                outline: "none",
                border: "none",
                padding: "0 10px",
                height: "6vh",
                color: "white",
              }}
              value={path}
            />
          </form>
          <br />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function GroupInfoModal(props: modalType) {
  const [open, setOpen] = React.useState(false);
  const { groupName } = useParams();
  const [groupData, setGroupData] = React.useState<groupType>();

  const handleClose = () => {
    setOpen(false);
    props.setOpenModal(false);
  };

  React.useEffect(() => {
    setOpen(props.openModal);
  }, [props.openModal]);

  const getGroupData = async () => {
    const docRef = doc(db, "groupNames", `${groupName}`);
    const docSnap = await getDoc(docRef);
    setGroupData(docSnap.data());
  };
  React.useEffect(() => {
    getGroupData();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{ ...style, width: 400 }}
          style={{ backgroundColor: "rgb(40,40,40)" }}
        >
          <span style={{ textAlign: "center" }}>
            <h2
              id="parent-modal-title"
              style={{ padding: "0", margin: "10px" }}
            >
              {groupData?.name}
            </h2>
            <span style={{ color: "gray" }}>
              <p>{groupData?.private ? "Private group" : "Public group"}</p>
            </span>
            <p id="parent-modal-title" style={{ color: "gray" }}>
              {" "}
              Created by: {groupData?.createdBy}
            </p>
          </span>
          {groupData?.users && (
            <div>
              <ul>
                <h4>Group members</h4>
                {groupData?.users.map((data) => (
                  <li>{data}</li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {groupData?.private && <AddUsersModal />}
            <ShareGroup />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
