import { Button } from "@mui/material";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Config/Firebase";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Google, Home } from "@mui/icons-material";
type groupType = {
  createdAt?: string;
  createdBy?: string;
  users?: string[];
  name?: string;
  private?: boolean;
  inviteLink?: string;
};

const InvitePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { groupName, invId } = useParams();
  const [groupData, setGroupData] = useState<groupType>();
  const [ErrMsg, setErrMsg] = useState<string | undefined | null>("");
  const currentUser: string | null | undefined = user?.email;
  const [spinner, setSpinner] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [redirectToGp, setredirectToGp] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const exists: boolean | undefined =
        groupData?.users?.includes(currentUser);
      setUserExists(!!exists);
    }
  }, [groupData]);

  const signIn = async () => {
    await signInWithPopup(auth, provider);
  };

  const getGroupData = async () => {
    setSpinner(true);
    const docRef = doc(db, "groupNames", `${groupName}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setGroupData(docSnap.data());
      setSpinner(false);
    } else {
      setSpinner(false);
      setErrMsg("Invalid invite link");
      console.log("error");
    }
  };

  useEffect(() => {
    getGroupData();
  }, []);

  useEffect(() => {
    if (userExists) {
      setErrMsg(`You are already a member of group ${groupName}`);
      setredirectToGp(true);
    }
  }, [userExists, groupData]);

  const addUsers = async (value: string | null | undefined) => {
    if (!value) return;
    setSpinner(true);
    const currentUserArr = groupData?.users;
    if (currentUserArr?.includes(value)) {
      console.log("already exists");
      return;
    }
    const newUser = [value];
    const updatedArr = currentUserArr?.concat(newUser);

    try {
      const docRef = doc(db, "groupNames", `${groupName}`);
      const msgRef = collection(db, `${groupName}`);
      await updateDoc(docRef, {
        users: updatedArr,
      });
      await addDoc(msgRef, {
        text: `${auth.currentUser.email} has joined the group through invite link`,
        createdAt: serverTimestamp(),
        user: auth.currentUser?.email,
        alertMsg: true,
      });
      navigate(`/groups/${groupName}`);
      setSpinner(false);
    } catch (error) {
      console.log(error);
      setErrMsg("something went wrong");
      setSpinner(false);
    }
  };

  const linkVerify = () => {
    if (!groupData?.inviteLink) return;
    const linkSplit = groupData?.inviteLink?.split("/");
    const lastVar = linkSplit[linkSplit?.length - 1];
    if (lastVar !== invId) setErrMsg("Invalid invite link.");
  };
  useEffect(() => {
    linkVerify();
  }, [groupData]);

  return (
    <>
      <div>
        <div>{ErrMsg && <p>{ErrMsg}</p>}</div>
        <Button
          variant="contained"
          onClick={signIn}
          style={{ textTransform: "none" }}
        >
          <Google style={{ margin: "0 10px 0 0" }} />
          Sign in with google
        </Button>
        <div>
          {redirectToGp && (
            <>
              <br />
              <Button
                variant="contained"
                color="info"
                size="large"
                onClick={() => navigate("/")}
                style={{ textTransform: "none" }}
              >
                Go to {groupName}
              </Button>
            </>
          )}
          <br />
          <br />
          {!user && <p>Sign in to continue</p>}
          {user && userExists ? (
            <Button
              variant="outlined"
              color="warning"
              style={{ textTransform: "none" }}
            >
              {spinner ? (
                <span style={{ paddingRight: "10px" }}>
                  <CircularProgress size={20} />
                  Please Wait
                </span>
              ) : (
                <span>Join Group</span>
              )}
            </Button>
          ) : user ? (
            <Button
              onClick={() => addUsers(currentUser)}
              color="error"
              variant="contained"
              style={{ textTransform: "none" }}
            >
              {spinner ? (
                <span style={{ paddingRight: "10px" }}>
                  <CircularProgress size={20} />
                  Please Wait
                </span>
              ) : (
                <span>Join Group</span>
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              style={{ textTransform: "none" }}
            >
              {spinner ? (
                <span style={{ paddingRight: "10px" }}>
                  <CircularProgress size={20} />
                  Please Wait
                </span>
              ) : (
                <span>Join Group</span>
              )}
            </Button>
          )}
          <br />
          <br />
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            style={{ textTransform: "none" }}
          >
            <Home />
            Go home
          </Button>
        </div>
      </div>
    </>
  );
};

export default InvitePage;
