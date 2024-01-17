import { useEffect, useState } from "react";
import { db, auth } from "../Config/Firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import GroupCard from "./GroupCard";
import { Button, Container, Grid, Stack, Tooltip } from "@mui/material";
import AddgroupModal from "./AddgroupsModal";
import Header from "./Header";
import { Add, GroupAddTwoTone, Lock, Public } from "@mui/icons-material";

type grpType = {
  createdAt?: string;
  name?: string;
  createdBy?: string;
  id?: string;
  private?: boolean;
  users?: [];
  formattedDate?: string;
};
type userType = {
  user: object;
};
type formatType = {
  createdAt: { seconds: number };
};

const AddGroup = ({ user }: userType) => {
  const [groupNames, setGroupNames] = useState<grpType[]>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [existingGroups, setExistingGroups] = useState<string[]>([]);
  const [isPrivate, setisPrivate] = useState(false);

  const userEmail: string = auth.currentUser.email;
  // console.log(groupNames);
  // console.log(typeof groupNames[1].createdAt);
  useEffect(() => {
    document.title = "ChatApp-Home";
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, "groupNames"), orderBy("createdAt"));
      const unSub = onSnapshot(q, (snapshot) => {
        let groups: object[] = [];
        snapshot.forEach((doc) => {
          groups.push({ ...doc.data(), id: doc.id });
        });
        let formattedData: object[] = [];
        groups.map((doc: formatType) => {
          formattedData.push({
            ...doc,
            formattedDate: new Date(
              doc.createdAt?.seconds * 1000
            ).toLocaleString(),
          });
        });
        setGroupNames(formattedData);
      });
      return () => unSub();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const closeModal = (): void => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (!groupNames) return;
    const names = groupNames.map((item) => item?.name.toLowerCase());
    setExistingGroups(names);
  }, [groupNames]);

  return (
    <>
      <Header user={user} />
      <div style={{ height: "12vh" }}></div>
      <Button
        variant="outlined"
        color="warning"
        size="large"
        onClick={() => {
          setOpenModal(true);
          setisPrivate(false);
        }}
      >
        <GroupAddTwoTone style={{ fontSize: "2rem", margin: "0 3px 3px 0" }} />
        Create Group
      </Button>

      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
          }}
          className="addGp"
        ></div>
        <div>
          <div className="publicDiv">
            <h2 style={{ fontFamily: "monospace" }}>
              <Public style={{ transform: "translateY(4px)" }} />
              Public groups
              <Tooltip title="Create a public group" arrow>
                <span
                  onClick={() => {
                    setOpenModal(true);
                    setisPrivate(false);
                  }}
                >
                  <Add className="publicGpAddBtn" />
                </span>
              </Tooltip>
            </h2>
            <Stack direction={{ sm: "column", md: "row" }} spacing={2}>
              <Grid container spacing={1}>
                {groupNames &&
                  groupNames.map(
                    (doc) =>
                      !doc.private && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={3}
                          key={doc.id}
                        >
                          <GroupCard
                            key={doc.id}
                            groupName={doc.name}
                            createdBy={doc.createdBy}
                            private={doc.private}
                            formattedDate={doc.formattedDate}
                          />
                        </Grid>
                      )
                  )}
              </Grid>
            </Stack>
          </div>
          <div className="privateDiv">
            <h2 style={{ fontFamily: "monospace" }}>
              <Lock style={{ transform: "translateY(3px)" }} />
              Private groups
              <Tooltip title="Create a private group" arrow>
                <span
                  onClick={() => {
                    setOpenModal(true);
                    setisPrivate(true);
                  }}
                >
                  <Add className="GroupAddBtn" />
                </span>
              </Tooltip>
            </h2>
            <Stack direction={{ sm: "column", md: "row" }} spacing={2}>
              <Grid container spacing={1}>
                {groupNames?.map(
                  (doc) =>
                    doc.private &&
                    doc.users &&
                    (doc.users as string[]).includes(userEmail) && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={3}
                        key={doc.id}
                      >
                        <GroupCard
                          key={doc.id}
                          groupName={doc.name}
                          createdBy={doc.createdBy}
                          private={doc.private}
                          formattedDate={doc.formattedDate}
                        />
                      </Grid>
                    )
                )}
              </Grid>
            </Stack>
          </div>
          <AddgroupModal
            openModal={openModal}
            closeModal={closeModal}
            existingGps={existingGroups}
            privateGp={isPrivate}
          />
        </div>
      </Container>
      <div style={{ height: "4vh" }}></div>
    </>
  );
};

export default AddGroup;
