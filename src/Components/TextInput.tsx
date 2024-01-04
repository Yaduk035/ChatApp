import { Send } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/Firebase";
import { auth } from "../Config/Firebase";
import { useParams } from "react-router-dom";

type ref = {
  scrollRef: React.RefObject<HTMLDivElement>;
};

export default function TextInput({ scrollRef }: ref) {
  const [inputMessage, setInputMessage] = useState<string | null>(null);
  const [spinner, setSpinner] = useState<boolean>(false);
  const { groupName } = useParams();

  const msgRef = collection(db, `${groupName}`);

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
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };
  return (
    <div className="inputDiv">
      <form onSubmit={handleSubmit}>
        {/* <TextField
              id="input-basic"
              variant="outlined"
              placeholder="Type you message here"
              sx={{
                color: "wheat",
                "& fieldset": { borderColor: "gray" }, // Border color for the TextField
                "& input": { color: "white" }, // Text color for the TextField
                "& .MuiInputLabel-root": { color: "white" }, // Text color for the label
              }}
              onChange={(e) => setInputMessage(e.target.value)}
              value={inputMessage}
            /> */}
        <input
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          autoFocus
        />

        <button onClick={handleSubmit} disabled={spinner}>
          {!spinner ? (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Send
                sx={{
                  color: "wheat",
                  fontSize: "2rem",
                  cursor: "pointer",
                }}
              />
            </span>
          ) : (
            <CircularProgress />
          )}
        </button>
      </form>
    </div>
  );
}
