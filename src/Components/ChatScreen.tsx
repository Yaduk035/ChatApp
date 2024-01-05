import { Container } from "@mui/material";
import TextInput from "./TextInput";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../Config/Firebase";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import { format, parse } from "date-fns";

type msgType = {
  createdAt?: string;
  text?: string;
  id?: string;
  user?: string;
  formattedDate?: string;
};

type userType = {
  user?: object | undefined | null;
};

type groupType = {
  createdAt?: {
    seconds: string;
  };
  createdBy?: string;
  users?: string[];
  name?: string;
  private?: boolean;
  inviteLink?: string;
};

type formatType = {
  createdAt: { seconds: number };
};

const ChatScreen = ({ user }: userType) => {
  const currentUser: string | null | undefined = auth.currentUser?.email;
  const [messages, setMessages] = useState<msgType[]>([]);
  const [groupData, setGroupData] = useState<groupType>();

  const [userExists, setUserExists] = useState<boolean | undefined>(false);
  const [privateGp, setPrivateGp] = useState<boolean>(false);
  const [showChats, setShowChats] = useState<boolean>(false);

  const { groupName } = useParams();
  useEffect(() => {
    document.title = groupName;
  }, []);
  // const msgRef = collection(db, "messages");
  const scrollRef = useRef<HTMLDivElement>(null);

  const getGroupData = async () => {
    const docRef = doc(db, "groupNames", `${groupName}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setGroupData(docSnap.data());
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    getGroupData();
  }, []);

  useEffect(() => {
    // console.log(groupData);
    if (groupData?.private) {
      setPrivateGp(true);
      const userFromDb = groupData.users?.includes(currentUser);
      setUserExists(userFromDb);
    } else {
      setPrivateGp(false);
    }
  }, [groupData, currentUser]);

  useEffect(() => {
    if (userExists && privateGp) {
      setShowChats(true);
    } else if (!userExists && privateGp) {
      setShowChats(false);
    } else if (!privateGp) {
      setShowChats(true);
    }
  }, [userExists, privateGp]);

  useEffect(() => {
    try {
      const q = query(collection(db, `${groupName}`), orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let msgArray: object[] = [];
        querySnapshot.forEach((doc) => {
          msgArray.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        let formattedMsgArr: object[] = [];
        msgArray.map((doc: formatType) => {
          formattedMsgArr.push({
            ...doc,
            formattedDate: new Date(
              doc.createdAt?.seconds * 1000
            ).toLocaleString(),
          });
        });

        setMessages(formattedMsgArr);
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

  function convertDate(value: string) {
    if (!value) return;
    const parsedDate = parse(value, "d/M/yyyy", new Date());
    const formattedDate = format(parsedDate, "EEEE, d MMM yyyy");
    // console.log("Date: ", formattedDate);
    return formattedDate;
  }

  return (
    <>
      {/* <div>
        <Button variant="contained" color="primary" onClick={logOut}>
          Sign out
        </Button>
      </div> */}
      <Header user={user} />
      <div style={{ height: "4vh" }}></div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Container
          maxWidth="md"
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0px",
            padding: "0px",
          }}
          className="chatDiv"
        >
          <Container
            style={{
              // border: "1px solid gray",
              overflowY: "auto",
              overflowX: "hidden",
              flex: "none",
            }}
            sx={{ padding: "10px" }}
          >
            <div style={{ height: "5.5vh" }}></div>
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                // style={{
                //   display: "flex",
                //   justifyContent:
                //     i === 0
                //       ? "center"
                //       : msg.user === currentUser
                //       ? "flex-end"
                //       : "flex-start",  // useEffect(() => {
                //   console.log(groupNames);
                // }, [groupNames]);

                // }}
              >
                {i === 0 ? (
                  <div style={{ margin: "15px 0 15px 0" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor: "rgb(30,30,30)",
                        padding: "10px",
                        borderRadius: "3px 10px 3px 10px",
                        color: "rgb(100,160,150)",
                      }}
                    >
                      {/* {msg.formattedDate.split(",")[0]} */}
                      {convertDate(msg.formattedDate.split(",")[0])}
                    </span>
                  </div>
                ) : msg.formattedDate.split(",")[0] !==
                  messages[i - 1].formattedDate.split(",")[0] ? (
                  <div style={{ margin: "15px 0 15px 0" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        backgroundColor: "rgb(30,30,30)",
                        padding: "10px",
                        borderRadius: "3px 10px 3px 10px",
                        color: "rgb(100,160,150)",
                      }}
                    >
                      {/* {msg.formattedDate.split(",")[0]} */}
                      {convertDate(msg.formattedDate.split(",")[0])}
                    </span>
                  </div>
                ) : (
                  <div></div>
                )}
                <div
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
                    className="msgDiv"
                    style={{
                      // border: "1px solid gray",
                      margin: i === 0 ? "10px 0px 10px 0px" : "1px",
                      borderRadius:
                        i === 1
                          ? "4px 10px 10px 10px"
                          : // : i + 1 === messages.length
                          // ? "10px 10px 0px 10px"
                          msg.user !== messages[i - 1]?.user &&
                            msg.user !== messages[i + 1]?.user
                          ? "4px 10px 4px 10px"
                          : msg.user !== messages[i + 1]?.user
                          ? "10px 10px 4px 10px"
                          : i > 0 && msg.user == messages[i - 1].user
                          ? "10px 10px 10px 10px"
                          : "4px 10px 10px 10px",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      backgroundColor:
                        i === 0
                          ? "black"
                          : msg.user === currentUser
                          ? "cornflowerblue"
                          : "cadetblue",
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
                            color: "rgb(30,50,40)",
                            textAlign:
                              msg.user === currentUser ? "right" : "left",
                            fontSize: "0.8rem",
                          }}
                        >
                          {msg.user}
                        </div>
                      )}
                      <div
                        style={{
                          textAlign: i === 0 ? "center" : "left",
                          color: i === 0 ? "rgb(100,160,150)" : "rgb(10,20,10)",
                          fontSize: i === 0 ? "0.85rem" : "0.95rem",
                          lineHeight: "18px",
                        }}
                      >
                        {msg.text}
                      </div>
                      <div
                        style={{
                          color: i === 0 ? "rgb(100,160,150)" : "rgb(30,50,40)",
                          fontSize: "0.7rem",
                          textAlign: "end",
                          margin: "-2px 0 -5px 0",
                          padding: "0px",
                        }}
                      >
                        {msg.formattedDate.split(",")[1]}
                      </div>
                    </p>
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} style={{ height: "30px" }}></div>
          </Container>
          <div style={{ height: "5vh" }}></div>
          <TextInput scrollRef={scrollRef} />
        </Container>
      </div>
      <LoadingScreen showModal={showChats} />
    </>
  );
};

export default ChatScreen;
