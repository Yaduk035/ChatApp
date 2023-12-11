import { Container, Button } from "@mui/material";
import TextInput from "./TextInput";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { useEffect, useState, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
      {/* <div>
        <Button variant="contained" color="primary" onClick={logOut}>
          Sign out
        </Button>
      </div> */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Container
          maxWidth="md"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "600px",
            minWidth: "600px",
          }}
        >
          <Container
            style={{
              // border: "1px solid gray",
              overflowY: "auto",
            }}
            sx={{ padding: "10px" }}
          >
            <div style={{ height: "5.5vh" }}></div>
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.user === currentUser ? "flex-end" : "flex-start",
                }}
              >
                <span
                  style={{
                    border: "1px solid gray",
                    margin: "1px",
                    borderRadius:
                      i === 0
                        ? "2px 10px 10px 10px"
                        : // : i + 1 === messages.length
                        // ? "10px 10px 0px 10px"
                        msg.user !== messages[i - 1]?.user &&
                          msg.user !== messages[i + 1]?.user
                        ? "2px 10px 2px 10px"
                        : msg.user !== messages[i + 1]?.user
                        ? "10px 10px 2px 10px"
                        : i > 0 && msg.user == messages[i - 1].user
                        ? "10px 10px 10px 10px"
                        : "2px 10px 10px 10px",
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
            <div ref={scrollRef} style={{ height: "30px" }}></div>
          </Container>
        </Container>
        <TextInput scrollRef={scrollRef} />
      </div>
    </>
  );
};

export default ChatScreen;
