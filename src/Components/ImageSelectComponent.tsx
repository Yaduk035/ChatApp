import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Close, Delete, PermMedia, Send } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const fileTypes = ["JPG", "PNG", "GIF", "Jpeg", "Webp"];

type imageComp = {
  setImage: React.Dispatch<React.SetStateAction<File>>;
  uploadImg: () => void;
  handleClose?: () => void;
};

function ImageDragDrop({ setImage, uploadImg, handleClose }: imageComp) {
  const [file, setFile] = useState(null);
  const [displayImg, setdisplayImg] = useState<string | undefined>();
  const handleChange = (file) => {
    setFile(file);
    setImage(file);

    if (file) {
      // Convert the File object to a URL
      const imageUrl = URL.createObjectURL(file);
      setdisplayImg(imageUrl);
    }
  };
  return (
    <>
      {file ? (
        <div style={{ textAlign: "center" }}>
          <img
            src={displayImg}
            width="300px"
            style={{ borderRadius: "10px" }}
          />
        </div>
      ) : (
        <div
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(17, 29, 53),rgb(10,10,10))",
            margin: "15px 0 20px 0",
          }}
        >
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
          />
        </div>
      )}
      {file && (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Tooltip title="Clear image" arrow>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setFile(null)}
              size="small"
            >
              <Delete />
            </Button>
          </Tooltip>

          {/* <Button
        variant="outlined"
          color="inherit"
          size="small"Send
          onClick={handleClose}
        >
          <Close />
        </Button> */}
          <Tooltip title="Send image" arrow>
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
          </Tooltip>
        </div>
      )}
    </>
  );
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "rgb(30,30,30)",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  outline: "none",
  borderRadius: "15px",
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
          <span style={{ position: "absolute", right: "2r0px" }}>
            <Tooltip title="Close" arrow>
              <span id="CloseButton" onClick={handleClose}>
                <Close />
              </span>
            </Tooltip>
          </span>
          <div
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              fontWeight: "bolder",
              margin: 0,
              paddingTop: 0,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h5">
              Select an image
            </Typography>
          </div>
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
