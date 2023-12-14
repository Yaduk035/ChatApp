import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(40,40,40)",
  p: 4,
  outline: "none",
};

type inpProps = {
  showModal: boolean;
};

export default function LoadingScreen({ showModal }: inpProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!showModal) {
      handleOpen();
    }
    if (showModal) {
      handleClose();
    }
  }, [showModal]);
  return (
    <div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Unauthorized access
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You are not a member of this group. Contact the group admin.
          </Typography>
          <br />
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Button onClick={() => navigate("/")} variant="outlined">
              Go home
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
