import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  writeBatch,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../Config/Firebase";
import { useParams } from "react-router-dom";
import {
  Delete,
  Share,
  Close,
  PersonAddAlt,
  ExitToApp,
  ContentCopy,
  Autorenew,
  GroupRemoveTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Tooltip } from "@mui/material";

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
  borderRadius: "12px",
};
type modalType = {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
};

type groupType = {
  createdAt?: string;
  createdBy?: string;
  users?: string[];
  name?: string;
  private?: boolean;
  inviteLink?: string;
};

type adduserType = {
  addUsers: (value: string) => void;
};

type deluserType = {
  deleteUsers: (value: string, delType: "admin" | "user") => void;
  userName: string;
};

type shareModal = {
  inviteLink?: string;
  privateGp?: boolean;
  groupName?: string;
  groupData: {
    createdBy?: string;
    users?: string[];
  };
};
type deleteGpModal = {
  gpName?: string;
};

function AddUsersModal(props: adduserType) {
  const [open, setOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState<string | null>(null);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const addUser = (e) => {
    e.preventDefault();
    if (!newUser) return;
    props.addUsers(newUser);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="error"
        style={{ textTransform: "none" }}
        onClick={handleOpen}
      >
        <PersonAddAlt />
        Add members
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 250, backgroundColor: "rgb(40,40,40)" }}>
          <h3 id="child-modal-title">Add users</h3>
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
                fontSize: "1.1rem",
              }}
              placeholder="Enter gmail id here"
              onChange={(e) => setNewUser(e.target.value.toLowerCase())}
              autoFocus
            />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="error"
                onClick={addUser}
                type="submit"
              >
                Add user
              </Button>
              <Tooltip title="Close" arrow>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleClose}
                >
                  <Close />
                </Button>
              </Tooltip>
            </div>
          </form>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function ShareGroup({
  inviteLink,
  privateGp,
  groupName,
  groupData,
}: shareModal) {
  const [open, setOpen] = React.useState(false);
  const [invLink, setinvLink] = React.useState("");
  React.useEffect(() => {
    setinvLink(inviteLink);
  }, [inviteLink]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const path = window.location.href;
  const url = new URL(path);
  const baseUrl = `${url.protocol}//${url.host}`;

  const copyText = async () => {
    await navigator.clipboard.writeText(inviteLink || path);
    alert("Link copied");
  };

  const generateNewLink = async () => {
    const newId = Math.floor(Math.random() * 10000000000);

    const newInviteLink = `${baseUrl}/invite/${groupName}/${newId}`;
    const groupIndexRef = doc(db, "groupNames", `${groupName}`);
    setinvLink(invLink);
    // console.log(invLink);

    await updateDoc(groupIndexRef, {
      inviteLink: newInviteLink,
    });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        style={{ textTransform: "none" }}
        onClick={handleOpen}
      >
        <Share />
        {privateGp ? "Invite" : "Share"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300, backgroundColor: "rgb(40,40,40)" }}>
          <h2 id="child-modal-title">Share group</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  fontSize: "1.1rem",
                }}
                value={invLink}
              />
            </form>
            <Tooltip title="Copy link" arrow>
              <div
                style={{ alignSelf: "end" }}
                onClick={copyText}
                id="delButton"
              >
                <ContentCopy style={{ fontSize: "1.8rem" }} />
              </div>
            </Tooltip>
          </div>

          <br />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {auth.currentUser.email === groupData.createdBy && (
              <Tooltip
                arrow
                title="Generate new invite link.All previous invite links will be obsolete"
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (confirm("Regenerate new invite link?") == true) {
                      generateNewLink();
                    }
                  }}
                  size="small"
                  style={{ textTransform: "none" }}
                >
                  <Autorenew />
                  Reset link
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Close" arrow>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <Close />
              </Button>
            </Tooltip>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={copyText}
              size="small"
            >
              <ContentCopy />
            </Button> */}
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function DeleteGroup({ gpName }: deleteGpModal) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setValue("");
  };

  // Delete groups //

  const deleteGroup = async (e) => {
    e.preventDefault();
    if (value !== gpName) return;
    try {
      //// delete group from the index.
      await deleteDoc(doc(db, "groupNames", `${gpName}`));

      ////delete group messages collection.
      const collectionRef = collection(db, `${gpName}`);

      const querySnapshot = await getDocs(collectionRef);
      // querySnapshot.forEach((doc) => {
      //   deleteDoc(doc.ref)
      // });
      const batch = writeBatch(getFirestore());
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      handleClose();
      navigate("/");
      alert("Group deleted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Tooltip title="Delete group" arrow>
        <Button variant="outlined" color="error" onClick={handleOpen}>
          <Delete />
        </Button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 250, backgroundColor: "rgb(40,40,40)" }}>
          <h3 id="child-modal-title">Delete group {gpName}?</h3>
          <form style={{ fontSize: "1.5rem" }}>
            <input
              style={{
                lineHeight: "1.5",
                background: "rgb(80,80,80)",
                outline: "none",
                border: "none", // querySnapshot.forEach((doc) => {
                //   deleteDoc(doc.ref)
                // });

                padding: "0 10px",
                height: "6vh",
                color: "white",
                fontSize: "1.1rem",
              }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={gpName}
              autoFocus
            />
            <p style={{ marginTop: "5px", color: "gray", fontSize: "0.8rem" }}>
              Type group name here
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="contained"
                color="error"
                onClick={deleteGroup}
                type="submit"
                size="small"
                sx={{ textTransform: "none" }}
              >
                <GroupRemoveTwoTone sx={{ margin: "0 5px 0 0" }} />
                Delete
              </Button>
              <Tooltip title="Close">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleClose}
                >
                  <Close />
                </Button>
              </Tooltip>
            </div>
          </form>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

//////////////////////////////////////////////////

function DelMenu(props: deluserType) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <span
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Delete sx={{ color: "wheat" }} />
      </span>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            props.deleteUsers(props.userName, "admin");
          }}
        >
          Delete user
        </MenuItem>
        <MenuItem onClick={handleClose}>Cancel</MenuItem>
      </Menu>
    </div>
  );
}

//////////////////////////////////////////////////

export default function GroupInfoModal(props: modalType) {
  const [open, setOpen] = React.useState(false);
  const { groupName } = useParams();
  const [groupData, setGroupData] = React.useState<groupType>();

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    props.setOpenModal(false);
  };

  React.useEffect(() => {
    setOpen(props.openModal);
  }, [props.openModal]);

  React.useEffect(() => {
    try {
      const unSub = onSnapshot(doc(db, "groupNames", `${groupName}`), (doc) => {
        var realTimeGp = doc.data();
        setGroupData(realTimeGp);
      });
      return () => unSub();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // const getGroupData = async () => {
  //   const docRef = doc(db, "groupNames", `${groupName}`);
  //   const docSnap = await getDoc(docRef);
  //   setGroupData(docSnap.data());
  // };
  // React.useEffect(() => {
  //   getGroupData();
  // }, []);

  const addUsers = async (value: string) => {
    if (!value) return;
    const currentUserArr = groupData?.users;
    if (currentUserArr?.includes(value)) {
      console.log("already exists");
      return;
    }
    const newUser = [value];
    const updatedArr = currentUserArr?.concat(newUser);
    console.log(updatedArr);

    try {
      const docRef = doc(db, "groupNames", `${groupName}`);
      const msgRef = collection(db, `${groupName}`);
      await updateDoc(docRef, {
        users: updatedArr,
      });
      await addDoc(msgRef, {
        text: `${auth.currentUser.email} added ${newUser}`,
        createdAt: serverTimestamp(),
        user: auth.currentUser?.email,
        alertMsg: true,
      });
      alert(`${newUser} is added to the group`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUsers = async (value: string, delType: "admin" | "user") => {
    if (!value || !delType) return;
    const currentUserArr = groupData?.users;
    console.log(currentUserArr);
    if (currentUserArr?.includes(value)) {
      const removeUser = value;
      const updatedArr = currentUserArr?.filter((item) => item !== removeUser);
      console.log(updatedArr);

      try {
        const docRef = doc(db, "groupNames", `${groupName}`);
        const msgRef = collection(db, `${groupName}`);
        await updateDoc(docRef, {
          users: updatedArr,
        });
        const commonData = {
          createdAt: serverTimestamp(),
          user: auth.currentUser?.email,
          alertMsg: true,
        };

        if (delType === "admin") {
          await addDoc(msgRef, {
            ...commonData,
            text: `${auth.currentUser.email} removed ${removeUser}`,
          });
          alert(`${removeUser} has been removed from ${groupName}`);
        } else if (delType === "user") {
          await addDoc(msgRef, {
            ...commonData,
            text: `${auth.currentUser.email} left ${groupName}`,
          });
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        disableEscapeKeyDown
      >
        <Box
          sx={{ ...style, width: 400 }}
          style={{ backgroundColor: "rgb(40,40,40)", outline: "none" }}
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
              Created by: {groupData?.createdBy}
            </p>
            {/* {groupData?.inviteLink && (
              <p id="parent-modal-title" style={{ color: "gray" }}>
                Invite link: {groupData?.inviteLink}
              </p>
            )} */}
          </span>
          {groupData?.users && groupData.private && (
            <div style={{ margin: "0px 0px 20px 0px" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <h4>Group members</h4>
                </div>
                {groupData?.users.map((data, i) => (
                  <div
                    style={{
                      margin: "2px",
                      borderRadius: "5px",
                      backgroundColor: "rgb(30,30,30)",
                      padding: "5px 25px 5px 25px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    key={i}
                  >
                    <span>
                      {data} {data === groupData.createdBy && " (admin)"}{" "}
                    </span>{" "}
                    {groupData.createdBy === auth.currentUser.email &&
                      data !== groupData.createdBy && (
                        <span id="delButton">
                          <DelMenu
                            deleteUsers={deleteUsers}
                            // getGroupData={getGroupData}
                            userName={data}
                          />
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {groupData?.createdBy === auth.currentUser?.email && (
              <DeleteGroup gpName={groupName} />
            )}
            {groupData?.private &&
              groupData.createdBy === auth.currentUser?.email && (
                <AddUsersModal
                  addUsers={addUsers}
                  // getGroupData={getGroupData}
                />
              )}

            {groupData?.private &&
              groupData.createdBy !== auth.currentUser?.email && (
                <Button
                  variant="contained"
                  color="error"
                  style={{ textTransform: "none" }}
                  // onClick={() => deleteUsers(auth.currentUser.email, "user")}
                  onClick={() => {
                    if (confirm(`Exit from ${groupName}?`) == true) {
                      deleteUsers(auth.currentUser.email, "user");
                    }
                  }}
                >
                  <ExitToApp />
                  Exit group
                </Button>
              )}

            <ShareGroup
              inviteLink={groupData?.inviteLink}
              privateGp={groupData?.private}
              groupName={groupName}
              // getGroupData={getGroupData}
              groupData={groupData}
            />
            <Tooltip title="Close" arrow>
              <Button
                variant="outlined"
                size="small"
                color="warning"
                onClick={handleClose}
              >
                <Close />
              </Button>
            </Tooltip>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
