import { Container } from "@mui/material";
import TextInput from "./TextInput";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

type msgType = {
  createdAt?: string;
  text?: string;
  id?: string;
  user?: string;
};

const ChatScreen = () => {
  const currentUser = auth.currentUser?.email;
  const [messages, setMessages] = useState<msgType[]>([]);

  const { groupName } = useParams();

  // const msgRef = collection(db, "messages");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, `${groupName}`), orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let msgArray: object[] = [];
        querySnapshot.forEach((doc) => {
          msgArray.push({ ...doc.data(), id: doc.id });
        });
        setMessages(msgArray);
      });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                    i === 0
                      ? "center"
                      : msg.user === currentUser
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <span
                  style={{
                    border: "1px solid gray",
                    margin: i === 0 ? "10px" : "1px",
                    borderRadius:
                      i === 1
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
                      i === 0
                        ? "black"
                        : msg.user === currentUser
                        ? "cornflowerblue"
                        : "cadetblue",
                    maxWidth: "380px",
                  }}
                >
                  <p style={{ margin: "5px", fontSize: "0.9rem" }}>
                    {i > 1 && msg.user == messages[i - 1].user ? (
                      <div></div>
                    ) : i === 0 ? (
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
