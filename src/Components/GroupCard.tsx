import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type cardType = {
  groupName: string | undefined;
  createdAt?: string;
  createdBy?: string;
  private?: boolean;
};

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
//   >
//     •
//   </Box>
// );

export default function GroupCard(props: cardType) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  return (
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
                transform: "scale(1.05)",
                boxShadow: "0 5px 20px rgba(150, 150, 150, 0.45)",
                borderRadius: "20px",
                border: "3px  rgba(44, 41, 41, 0.400",
                backgroundColor: "black",
                color: "wheat",
                cursor: "pointer",
              }
            : {
                transition: "all 0.3s ease",
                transform: "scale(1)",
                // border: "3px  rgba(44, 41, 41, 0.400",
                // borderRadius: "10px",
                backgroundColor: "rgb(50,10,20)",
                color: "wheat",
                cursor: "pointer",
              }
        }
        sx={{ minWidth: 200 }}
      >
        <CardContent>
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.createdAt}
        </Typography> */}
          <Typography variant="h5" component="div">
            {props.groupName}
          </Typography>
          <Typography sx={{ fontSize: 10 }}>Created by:</Typography>
          <Typography sx={{ mb: 1.5 }}>{props.createdBy}</Typography>
          {/* <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
        </CardContent>
      </Card>
    </span>
  );
}
