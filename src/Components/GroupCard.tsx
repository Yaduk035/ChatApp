import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tilt } from "react-tilt";

type cardType = {
  groupName: string | undefined;
  createdAt?: string;
  createdBy?: string;
  private?: boolean;
  formattedDate?: string;
};

const defaultOptions = {
  reverse: true, // reverse the tilt direction
  max: 35, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1, // 2 = 200%, 1.5 = 150%, etc..
  speed: 1000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

export default function GroupCard(props: cardType) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <Tilt options={defaultOptions}>
      <span
        onClick={() => navigate(`/groups/${props.groupName}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card
          // style={{ backgroundColor: "black", color: "wheat", cursor: "pointer" }}
          style={
            hovered
              ? {
                  // transform: "scale(1.02)",
                  boxShadow: "0 2px 5px rgba(150, 150, 150, 0.35)",
                  borderRadius: "10px",
                  border: "3px  rgba(44, 41, 41, 0.400",
                  backgroundColor: "rgb(30,60,30)",
                  color: "wheat",
                  cursor: "pointer",
                  zIndex: 10,
                }
              : {
                  transition: "all 0.1s ease",
                  transform: "scale(1)",
                  backgroundColor: "rgb(50,10,20)",
                  color: "wheat",
                  cursor: "pointer",
                }
          }
          sx={{ minWidth: 190, height: "90px" }}
        >
          <CardContent style={{ padding: "3px 0 0 0" }}>
            {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.createdAt}
        </Typography> */}
            <Typography
              style={{ textTransform: "none", fontWeight: "bold" }}
              variant="button"
            >
              {props.groupName}
            </Typography>
            <Typography sx={{ fontSize: 9 }}>Created by:</Typography>
            <Typography sx={{ mb: 0.5, fontSize: 11 }}>
              {props.createdBy}
            </Typography>
            <Typography sx={{ mb: 0.5, fontSize: 10 }}>
              @{props.formattedDate}
            </Typography>
          </CardContent>
        </Card>
      </span>
    </Tilt>
  );
}
