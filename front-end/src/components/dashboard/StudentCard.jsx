import React, { Component } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import EditStudentDetails from "./EditStudentDetails";

const styles = (theme) => ({
  alignCenter: {
    textAlign: "center",
  },
  padding: {
    padding: 20,
  },
  media: {
    paddingTop: "81.25%",
    borderRadius: "50%",
    margin: "28px",
  },
  justifyCenter: {
    justifyContent: "center",
  },
});

class StudentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  render() {
    const {
      data,
      classes,
      deleteStudent,
      isEditing,
      updateStudentDetails,
    } = this.props;
    return (
      <>
        <Card raised className={classes.padding}>
          <CardActionArea className={classes.alignCenter}>
            {data.image ? (
              <CardMedia image={data.image} className={classes.media} />
            ) : null}
            <CardContent>
              <Typography noWrap variant="h5">{data.name}</Typography>
              <Typography>Blood Group: {data.blood_group}</Typography>
              <Typography noWrap>
                Email: {data.email}
              </Typography>
              <Typography>City: {data.city}</Typography>
              <Typography>Gender: {data.gender}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions className={classes.justifyCenter}>
            <EditStudentDetails
              data={data}
              open={isEditing}
              updateStudentDetails={updateStudentDetails}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteStudent(data._id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(StudentCard);
