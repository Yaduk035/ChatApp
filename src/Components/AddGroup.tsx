import { useEffect, useState } from "react";
import { db, auth } from "../Config/Firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import GroupCard from "./GroupCard";
import { Container, Grid, Stack } from "@mui/material";

type grpType = {
  createdAt?: string;
  name?: string;
  createdBy?: string;
  id?: string;
  private?: boolean;
};

const AddGroup = () => {
  const [groupNames, setGroupNames] = useState<grpType[]>([]);
  const [newGroup, setNewGroup] = useState<string | null>();
  useEffect(() => {
    const q = query(collection(db, "groupNames"), orderBy("createdAt"));
    const unSub = onSnapshot(q, (snapshot) => {
      let groups: object[] = [];
      snapshot.forEach((doc) => {
        groups.push({ ...doc.data(), id: doc.id });
      });
      setGroupNames(groups);
    });
    return () => unSub();
  }, []);

  //   const getGroupData = async (value: string | undefined) => {
  //     try {
  //       const docRef = doc(db, "groupNames", `${value}`);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         console.log("Document data:", docSnap.data());
  //         navigate(`/groups/${value}`);
  //       } else {
  //         // docSnap.data() will be undefined in this case
  //         console.log("No such document!");
  //         navigate("notfound");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msgref = collection(db, `${newGroup}`);
      await addDoc(msgref, {
        text: `New group ${newGroup} created by ${auth.currentUser?.email}`,
        user: auth.currentUser?.email,
        createdAt: serverTimestamp(),
      });

      const groupIndexRef = doc(db, "groupNames", `${newGroup}`);
      await setDoc(groupIndexRef, {
        name: `${newGroup}`,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.email,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
          }}
          className="addGp"
        >
          <form onSubmit={createGroup}>
            <input
              type="text"
              placeholder="Type group name"
              onChange={(e) => setNewGroup(e.target.value)}
            />
            <button type="submit">Add group</button>
          </form>
        </div>
        <div>
          <Stack direction={{ sm: "column", md: "row" }} spacing={2}>
            <Grid container spacing={2}>
              {groupNames?.map(
                (doc) =>
                  !doc.private && (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <GroupCard
                        key={doc.id}
                        groupName={doc.name}
                        createdBy={doc.createdBy}
                        private={doc.private}
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </Stack>
        </div>
      </Container>
    </>
  );
};

export default AddGroup;
