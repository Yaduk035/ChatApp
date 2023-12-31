import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { MenuItem } from "@mui/material";
import { GitHub, Info } from "@mui/icons-material";

type triggerMtd = {
  loggedIn: boolean;
};

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
  backgroundImage: "linear-gradient(rgb(80,80,80),rgb(40,40,40))",
  outline: "none",
};

export default function AppInfoModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <MenuItem
          onClick={handleOpen}
          style={{ fontSize: "0.8rem", color: "GrayText" }}
        >
          About app
        </MenuItem>
      ) : ( */}
      <span onClick={handleOpen}>
        <Info
          style={{ cursor: "pointer", fontSize: "1.7rem", color: "gray" }}
        />
      </span>
      {/* <Button onClick={handleOpen}></Button> */}
      {/* )} */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              align="center"
            >
              About app
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Thank you for checking out my app.
              <br />
              This app is built with React typescipt and firebase and made
              solely for learning purposes. You can find my other projects on
              github.
            </Typography>
            <br />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                color="error"
                style={{ textTransform: "none" }}
                href="https://github.com/Yaduk035"
                target="_blank"
              >
                <GitHub style={{ fontSize: "2rem", margin: "0 10px 0 0" }} />
                github.com/Yaduk035
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
