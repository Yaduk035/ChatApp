import { useEffect, useState } from "react";
import { db, auth } from "../Config/Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import GroupCard from "./GroupCard";
import { Button, Container, Grid, Stack } from "@mui/material";
import AddgroupModal from "./AddgroupsModal";
import Header from "./Header";

type grpType = {
  createdAt?: string;
  name?: string;
  createdBy?: string;
  id?: string;
  private?: boolean;
  users?: [] | null | undefined | string;
};
type userType = {
  user: object | undefined | null;
};

const AddGroup = ({ user }: userType) => {
  const [groupNames, setGroupNames] = useState<grpType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);

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

  const closeModal = (): void => {
    setOpenModal(false);
  };

  // const ob = groupNames[1]?.users?.includes("yduneduvannoor@gmail.com");
  // console.log(ob);
  return (
    <>
      <Header user={user} />
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            margin: "8vh",
          }}
          className="addGp"
        >
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setOpenModal(true)}
          >
            Create Group
          </Button>
        </div>
        <div>
          <h2>Public groups</h2>
          <Stack direction={{ sm: "column", md: "row" }} spacing={2}>
            <Grid container spacing={2}>
              {groupNames?.map(
                (doc) =>
                  !doc.private && (
                    <Grid item xs={12} sm={6} md={6} lg={4}>
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
          <h2>Private groups</h2>
          <Stack direction={{ sm: "column", md: "row" }} spacing={2}>
            <Grid container spacing={2}>
              {groupNames?.map(
                (doc) =>
                  doc.private &&
                  doc.users?.includes(auth.currentUser?.email) && (
                    <Grid item xs={12} sm={6} md={6} lg={4}>
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
          <AddgroupModal
            openModal={openModal}
            closeModal={closeModal}
            groupNames={groupNames}
          />
        </div>
      </Container>
    </>
  );
};

export default AddGroup;
