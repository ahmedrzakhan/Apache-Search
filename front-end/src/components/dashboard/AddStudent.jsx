import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Center } from "./Styles";

const styles = {
  buttonStyle: {
    background: "#8ed1fc",
    fontWeight: "bold",
    color: "#fff",
  },
};

class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: "",
      email: "",
      city: "",
      blood_group: "",
      image: "",
      gender: "",
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "file") {
      value = e.target.files[0];
    }
    this.setState({
      [name]: value,
    });
  };

  openDialog = () => {
    this.setState({
      open: true,
    });
  };

  closeDialog = () => {
    this.setState({
      open: false,
    });
  };

  addStudent = async () => {
    const { name, email, city, blood_group, image, gender } = this.state;
    const { addNewStudent } = this.props;
    if (!name || !email || !city || !blood_group || !image || !gender) {
      alert("Fill all the details");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("city", city);
    data.append("blood_group", blood_group);
    data.append("studentImage", image);
    data.append("gender", gender);

    const config = {
      method: "post",
      url: "http://localhost:5000/api/students/add/",
      headers: {
        "Content-Type": `multipart/form-data`,
      },
      data: data,
    };

    try {
      const response = await axios(config);
      addNewStudent(response.data.student);
      this.closeDialog();
    } catch (err) {
      console.log("Get Students error", err);
    }
  };

  render() {
    const { open, email, name, city, gender, blood_group } = this.state;
    const { classes } = this.props;
    return (
      <>
        <Center>
          <Button
            variant="outlined"
            className={classes.buttonStyle}
            onClick={this.openDialog}
          >
            New Student
          </Button>
        </Center>
        <Dialog open={open} onClose={this.closeDialog}>
          <DialogTitle>Add new Student</DialogTitle>
          <form encType="multipart/form-data">
            <DialogContent>
              <DialogContentText>Enter the student details</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                name="name"
                value={name}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Email Address"
                name="email"
                value={email}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Gender"
                name="gender"
                value={gender}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="City"
                name="city"
                value={city}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Blood Group"
                name="blood_group"
                value={blood_group}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Picture"
                name="image"
                type="file"
                onChange={this.handleChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.addStudent} color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(AddStudent);
