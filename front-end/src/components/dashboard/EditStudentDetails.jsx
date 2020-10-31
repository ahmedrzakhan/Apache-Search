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

class EditStudentDeatils extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.data,
      open: false,
    };
  }

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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  updateStudentData = async (payload) => {
    const { name, email, city, blood_group, image, gender } = this.state;
    const { updateStudentDetails } = this.props;

    const item = {
      name,
      email,
      city,
      blood_group,
      image,
      gender,
    };

    const config = {
      method: "post",
      url: `http://localhost:5000/api/students/update/${payload}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: item,
    };

    try {
      const response = await axios(config);
      updateStudentDetails(response.data.student);
      this.closeDialog();
    } catch (err) {
      console.log("Get Students error", err);
    }

    this.closeDialog();
  };

  render() {
    const { name, email, city, blood_group, image, gender, open } = this.state;
    const { _id } = this.props.data;
    return (
      <>
        <Button variant="contained" color="primary" onClick={this.openDialog}>
          Edit
        </Button>

        <Dialog open={open} onClose={this.closeDialog}>
          <DialogTitle>Edit details</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit Student Details</DialogContentText>
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
              value={image}
              onChange={this.handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.updateStudentData(_id)}
              color="secondary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default EditStudentDeatils;
