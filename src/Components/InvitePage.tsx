import { Button } from "@mui/material";
import { auth, provider } from "../Config/Firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../Config/Firebase";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
type groupType = {
  createdAt?: string;
  createdBy?: string;
  users?: string[];
  name: string;
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

  const userExists = groupData?.users?.includes(currentUser);

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
    if (userExists) setErrMsg(`You are already a member of group ${groupName}`);
  }, [userExists]);

  const addUsers = async (value: string | null | undefined) => {
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
      await updateDoc(docRef, {
        users: updatedArr,
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
        <Button variant="contained" onClick={signIn}>
          Sign in with google
        </Button>
        <div>
          <br />
          <br />
          {!user && <p>Sign in to continue</p>}
          {user && userExists ? (
            <Button variant="outlined" color="warning">
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
            <Button onClick={() => addUsers(currentUser)} variant="outlined">
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
            <Button variant="outlined" color="warning">
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
          <Button variant="outlined" onClick={() => navigate("/")}>
            Go home
          </Button>
        </div>
      </div>
    </>
  );
};

export default InvitePage;
