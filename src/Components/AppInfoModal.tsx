import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { GitHub } from "@mui/icons-material";

type modalType = {
  modalState: boolean;
  setModal: (type: boolean) => void;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  backgroundImage: "linear-gradient(rgb(80,50,50),rgb(30,30,30))",
  outline: "none",
  borderRadius: "4px 15px 4px 15px",
};

export default function AppInfoModal(props: modalType) {
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    props.setModal(false);
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(props.modalState);
  }, [props.modalState]);

  return (
    <div>
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
              style={{ fontFamily: "monospace" }}
            >
              About app
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              style={{ fontFamily: "monospace" }}
              variant="subtitle2"
            >
              Thank you for checking out my app.
              <br />
              This app is built with React typescipt and firebase, made solely
              for learning purposes. You can find my other projects on github.
            </Typography>
            <br />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="outlined"
                color="primary"
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
