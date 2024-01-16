import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Close, PermMedia, Send } from "@mui/icons-material";

const fileTypes = ["JPG", "PNG", "GIF"];

type imageComp = {
  setImage: React.Dispatch<React.SetStateAction<File>>;
  uploadImg: () => void;
  handleClose?: () => void;
};

function ImageDragDrop({ setImage, uploadImg, handleClose }: imageComp) {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    setImage(file);
  };
  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(17, 29, 53),rgb(10,10,10))",
        }}
      >
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
        />
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          onClick={handleClose}
        >
          <Close />
        </Button>
        <Button
          onClick={() => {
            if (!file) return;
            uploadImg();
            handleClose();
          }}
          variant="contained"
          color="error"
        >
          <Send />
        </Button>
      </div>
    </>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(30,30,30)",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

export default function BasicModal({ setImage, uploadImg }: imageComp) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div
        onClick={handleOpen}
        style={{ cursor: "pointer", transform: "translateY(-10px)" }}
      >
        <span style={{ fontSize: "3rem" }}>
          <PermMedia />
        </span>
      </div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Send image
          </Typography>
          <br />
          <ImageDragDrop
            setImage={setImage}
            uploadImg={uploadImg}
            handleClose={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}
