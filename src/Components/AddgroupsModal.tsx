import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { db, auth } from "../Config/Firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Stack, FormGroup, CircularProgress } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type modalType = {
  openModal: boolean;
  closeModal: ReturnType;
  groupNames?: [];
};

export default function AddgroupModal(props: modalType) {
  const [open, setOpen] = React.useState(false);
  const [spinner, setSpinner] = React.useState<boolean>(false);
  const [newGroup, setNewGroup] = React.useState<string | null>();
  const [groupType, setGroupType] = React.useState<boolean>(false);

  //   const handleChange = (event: SelectChangeEvent) => {
  //     setGroupType(event.target.);
  //   };

  const handleClose = () => {
    setOpen(false);
    props.closeModal();
  };

  React.useEffect(() => {
    setOpen(props.openModal);
  }, [props.openModal]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const msgref = collection(db, `${newGroup}`);
      await addDoc(msgref, {
        text: `New group ${newGroup} created by ${auth.currentUser?.email}`,
        user: auth.currentUser?.email,
        createdAt: serverTimestamp(),
        private: groupType,
      });

      const groupIndexRef = doc(db, "groupNames", `${newGroup}`);
      await setDoc(groupIndexRef, {
        name: `${newGroup}`,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.email,
        private: groupType,
        users: [auth.currentUser?.email],
      });
      setSpinner(false);
      props.closeModal();
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  const handleToggleChange = () => {
    setGroupType((prev) => !prev);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ backgroundColor: "rgb(40,40,40)" }}>
          <form onSubmit={createGroup} style={{ textAlign: "center" }}>
            <Stack direction="column" spacing={2}>
              <Typography
                id="modal-modal-title"
                variant="h5"
                style={{ fontFamily: "monospace" }}
                component="h2"
              >
                Create new group
              </Typography>
              <input
                type="text"
                placeholder="Type group name"
                onChange={(e) => setNewGroup(e.target.value)}
                style={{
                  lineHeight: "1.5",
                  backgroundColor: "rgb(58,58,58",
                  outline: "none",
                  border: "none",
                  height: "8vh",
                  padding: "0 10px",
                  borderRadius: "5px",
                  fontSize: "1.2rem",
                }}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label={groupType ? "Private Group" : "Public Group"}
                  checked={groupType}
                  onChange={handleToggleChange}
                  style={{ display: "flex", justifyContent: "center" }}
                />
              </FormGroup>
              <Button variant="contained" color="success" type="submit">
                {spinner && (
                  <CircularProgress
                    color="inherit"
                    size={20}
                    style={{ marginRight: "10px" }}
                  />
                )}
                Add group
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
