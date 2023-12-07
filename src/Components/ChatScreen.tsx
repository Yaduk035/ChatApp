import { Container, Button } from "@mui/material";
import TextInput from "./TextInput";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { onSnapshot } from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { collection } from "firebase/firestore";
import { useEffect, useState } from "react";

const cookie = new Cookies();
const currentUser = auth.currentUser?.email;

type msgType = {
  createdAt?: string;
  text?: string;
  id?: string;
  user?: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<msgType[]>([]);
  const logOut = async () => {
    try {
      await signOut(auth);
      cookie.remove("refresh-token");
    } catch (error) {
      console.log(error);
    }
  };

  const msgRef = collection(db, "messages");

  useEffect(() => {
    onSnapshot(msgRef, (snapshot) => {
      console.log(snapshot);
      let msgArray: msgType[] = [];
      snapshot.forEach((doc) => {
        msgArray.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  }, []);

  return (
    <>
      <div>
        <Button variant="contained" color="primary" onClick={logOut}>
          Sign out
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Container
          maxWidth="md"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container
            style={{ border: "1px solid gray" }}
            sx={{ minWidth: "400px" }}
          >
            {messages.map((msg) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: msg.user === currentUser ? "right" : "left",
                }}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </Container>
          <span
            style={{
              marginTop: "auto",
              position: "fixed",
              bottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                translate: "-120px",
              }}
            >
              <TextInput />
            </div>
          </span>
        </Container>
      </div>
    </>
  );
};

export default ChatScreen;
