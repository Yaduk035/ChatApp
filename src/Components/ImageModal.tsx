import * as React from "react";
import Modal from "@mui/material/Modal";
import { DisabledByDefault } from "@mui/icons-material";

type imgModalType = {
  openModal: boolean;
  setopenModal: (value: boolean) => void;
  imageUrl?: string;
};

export default function ImageModal({
  openModal,
  setopenModal,
  imageUrl,
}: imgModalType) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setopenModal(false);
  };

  React.useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <span
            style={{
              position: "absolute",
              right: "5%",
              top: "8%",
              cursor: "pointer",
              color: "wheat",
            }}
            onClick={handleClose}
          >
            <DisabledByDefault fontSize="large" />
          </span>
          <img src={imageUrl} id="ImageModal" />
        </div>
        {/* <Box sx={style}> */}
        {/* </Box> */}
      </Modal>
    </div>
  );
}
