import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
  return (
    <span onClick={() => navigate(`/groups/${props.groupName}`)}>
      <Card
        style={{ backgroundColor: "black", color: "wheat", cursor: "pointer" }}
        sx={{ minWidth: 275 }}
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
