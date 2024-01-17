import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

type bckDrpType = {
  openBackdrop: boolean;
  setbackdropOpen: (value: boolean) => void;
};

export default function BackDrop({
  setbackdropOpen,
  openBackdrop,
}: bckDrpType) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setbackdropOpen(false);
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(openBackdrop);
  }, [openBackdrop]);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
