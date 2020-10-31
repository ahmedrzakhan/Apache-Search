import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    background: "#f50057",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  linkStyle: {
    color:"#3f51b5",
    textDecoration: "none",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#fff",
    fontWeight: 600,
  },
});

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const { history } = this.props;
    const item = {
      name,
      email,
      password,
    };

    const config = {
      method: "post",
      url: "http://localhost:5000/api/admin/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: item,
    };
    try {
      await axios(config);
      history.push("/");
    } catch (err) {
      console.log("Error in Register: " + JSON.stringify(err.response.data));
    }
  };

  render() {
    const { classes } = this.props;
    const { email, name, password } = this.state;
    return (
      <>
        <Container maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">Sign up</Typography>
            <form className={classes.form}>
              <TextField
                autoFocus
                fullWidth
                label="Name"
                margin="normal"
                name="name"
                onChange={this.handleChange}
                value={name}
                variant="outlined"
              />
              <TextField
                autoComplete="email"
                fullWidth
                label="Email Address"
                margin="normal"
                name="email"
                onChange={this.handleChange}
                value={email}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                margin="normal"
                name="password"
                onChange={this.handleChange}
                type="password"
                value={password}
                variant="outlined"
              />
            </form>
            <Button
              className={classes.submit}
              color="primary"
              fullWidth
              onClick={this.handleSubmit}
              variant="contained"
            >
              Sign up
            </Button>
          </div>
          <Grid container justify="center">
            <Grid item>
              <Link
                className={classes.linkStyle}
                to="/"
                key="/"
              >
                Have an account Login
              </Link>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(Register);
