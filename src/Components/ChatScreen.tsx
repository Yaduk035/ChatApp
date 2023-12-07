import { Container, Button } from "@mui/material";
import TextInput from "./TextInput";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { useEffect, useState } from "react";

const cookie = new Cookies();

type msgType = {
  createdAt?: string;
  text?: string;
  id?: string;
  user?: string;
};

const ChatScreen = () => {
  const currentUser = auth.currentUser?.email;
  const [messages, setMessages] = useState<msgType[]>([]);
  const logOut = async () => {
    try {
      await signOut(auth);
      cookie.remove("refresh-token");
    } catch (error) {
      console.log(error);
    }
  };

  // const msgRef = collection(db, "messages");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let msgArray: object[] = [];
      querySnapshot.forEach((doc) => {
        msgArray.push({ ...doc.data(), id: doc.id });
      });
      setMessages(msgArray);
    });
    return () => unsubscribe();
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
            style={{
              border: "1px solid gray",
              overflowY: "auto",
            }}
            sx={{ width: "500px", padding: "10px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent: msg.user === currentUser ? "right" : "left",
                }}
              >
                <span
                  style={{
                    border: "1px solid gray",
                    margin: "1px",
                    borderRadius:
                      i === 0
                        ? "0px 10px 10px 10px"
                        : i + 1 === messages.length
                        ? "10px 10px 0px 10px"
                        : msg.user !== messages[i - 1]?.user &&
                          msg.user !== messages[i + 1].user
                        ? "0px 10px 0px 10px"
                        : msg.user !== messages[i + 1].user
                        ? "10px 10px 0px 10px"
                        : i > 0 && msg.user == messages[i - 1].user
                        ? "10px 10px 10px 10px"
                        : "0px 10px 10px 10px",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    backgroundColor:
                      msg.user === currentUser ? "cornflowerblue" : "cadetblue",
                    maxWidth: "380px",
                  }}
                >
                  <p style={{ margin: "5px", fontSize: "0.9rem" }}>
                    {i > 0 && msg.user == messages[i - 1].user ? (
                      <div></div>
                    ) : (
                      <div
                        style={{
                          color: "black",
                          textAlign:
                            msg.user === currentUser ? "right" : "left",
                        }}
                      >
                        {msg.user}
                      </div>
                    )}
                    {msg.text}
                  </p>
                </span>
              </div>
            ))}
            <div style={{ height: "70px" }}></div>
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
                // translate: "-120px",
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
