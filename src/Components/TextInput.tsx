import { Send } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import React, { useState, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      inputRef.current.focus();
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };
  return (
    <div className="inputDiv">
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          ref={inputRef}
        />

        <button type="button" onClick={handleSubmit} disabled={spinner}>
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
