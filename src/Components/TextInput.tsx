import { Send } from "@mui/icons-material";
import { CircularProgress, Tooltip } from "@mui/material";
import React, { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Config/Firebase";
import { auth } from "../Config/Firebase";
import { useParams } from "react-router-dom";
import { storage } from "../Config/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import ImageSelectComponent from "./ImageSelectComponent";

type ref = {
  scrollRef: React.RefObject<HTMLDivElement>;
  setbackdropOpen?: (value: boolean) => void;
  isMsgDeleted: boolean;
  setisMsgDeleted: (value: boolean) => void;
};

export default function TextInput({
  scrollRef,
  setbackdropOpen,
  isMsgDeleted,
  setisMsgDeleted,
}: ref) {
  const [inputMessage, setInputMessage] = useState<string | null>(null);
  const [image, setimage] = useState<File | null>(null);
  const [spinner, setSpinner] = useState<boolean>(false);
  const { groupName } = useParams();

  const msgRef = collection(db, `${groupName}`);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current.focus();
    if (!inputMessage) return;
    setSpinner(true);
    try {
      await addDoc(msgRef, {
        text: inputMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser?.email,
      });
      setInputMessage("");
      setSpinner(false);
      if (isMsgDeleted) setisMsgDeleted(false);
      // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  const uploadImg = async () => {
    if (!image) return;
    const imgName = `${image.name + v4()}`;
    const imgPath = `images/${groupName}/${imgName}`;
    const imgRef = ref(storage, imgPath);
    uploadBytes(imgRef, image).then((item) => {
      getDownloadURL(item.ref).then((url) => {
        addDoc(msgRef, {
          image: url,
          imagePath: imgPath,
          createdAt: serverTimestamp(),
          user: auth.currentUser?.email,
        });
      });
    });
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    setbackdropOpen(true);
  };
  return (
    <div className="inputDiv">
      <form onSubmit={handleSubmit}>
        <Tooltip title="Select an image" arrow>
          <div id="imageMsgIcon">
            <ImageSelectComponent setImage={setimage} uploadImg={uploadImg} />
          </div>
        </Tooltip>
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
