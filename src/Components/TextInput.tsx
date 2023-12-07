import { Send } from "@mui/icons-material";
import { Button, CircularProgress, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/Firebase";
import { auth } from "../Config/Firebase";

export default function InputWithIcon() {
  const [inputMessage, setInputMessage] = useState<string | null>(null);
  const [spinner, setSpinner] = useState<boolean>(false);

  const msgRef = collection(db, "messages");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpinner(true);
    if (!inputMessage) return;
    try {
      await addDoc(msgRef, {
        text: inputMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser?.email,
      });
      setInputMessage("");
      setSpinner(false);
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };
  return (
    <Box
      sx={{ "& > :not(style)": { m: 1 }, maxWidth: "500px", minWidth: "400px" }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <TextField
            id="input-basic"
            variant="outlined"
            placeholder="Type you message here"
            sx={{
              color: "wheat",
              width: "100%",
              "& fieldset": { borderColor: "gray" }, // Border color for the TextField
              "& input": { color: "white" }, // Text color for the TextField
              "& .MuiInputLabel-root": { color: "white" }, // Text color for the label
            }}
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
          />

          <Button
            variant="outlined"
            onClick={handleSubmit}
            sx={{ height: "3.5rem" }}
            disabled={spinner}
          >
            {!spinner ? (
              <Send
                sx={{
                  color: "wheat",
                  mr: 1,
                  my: 1.5,
                  fontSize: "1.8rem",
                  cursor: "pointer",
                }}
              />
            ) : (
              <CircularProgress />
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
