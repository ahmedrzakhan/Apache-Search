import React, { Component } from "react";
import axios from "axios";
import {
  AppBar,
  Button,
  Drawer,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AddStudent from "./AddStudent";
import StudentCard from "./StudentCard";
import { Center } from "./Styles";
import { loadData } from "./../../localStorage/localStorage";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  gridStyle: {
    maxWidth: "100%",
    margin: "auto",

    [theme.breakpoints.down("md")]: {
      padding: "30px 5px 30px 5px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "20px 50px 20px 50px",
    },
  },
  headerStyle: {
    fontWeight: 600,
    fontSize: 18,
    textAlign: "center",
    flexGrow: 1,
  },
  linkStyle: {
    color: "#3f51b5",
    textDecoration: "none",
  },
  paginationStyle: {
    padding: "30px 0 50px 0",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: drawerWidth,
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      open: false,
      students: [],
      totalStudents: 0,
      currentPage: 1,
      adminName: "",
    };
  }

  getStudents = async (page = 1) => {
    const config = {
      method: "get",
      url: `http://localhost:5000/api/students?page=${page}&limit=6`,
    };

    try {
      const response = await axios(config);
      this.setState({
        students: response.data.current,
        totalStudents: response.data.totalCount,
        isLoading: false,
        currentPage: page,
      });
    } catch (err) {
      console.log("Get Students error", err);
    }
  };

  getAdminName = async () => {
    const adminData = loadData("admin");
    const config = {
      method: "get",
      url: "http://localhost:5000/api/admin/admin",
      headers: {
        Authorization: adminData.accessToken,
        "Content-Type": "application/json",
      },
      data: { email: adminData.email },
    };
    try {
      axios(config).then((res) => {
        this.setState({
          adminName: res.data.name,
        });
      });
    } catch (err) {
      console.log("get User name error", err);
    }
  };

  updateStudentDetails = (student) => {
    const { students } = this.state;
    this.setState({
      students: students.map((item) =>
        item._id === student._id ? { ...student } : item
      ),
    });
  };

  addNewStudent = (student) => {
    if (this.state.students.length < 6) {
      this.setState({
        students: [...this.state.students, student],
      });
    }
  };

  deleteStudent = async (payload) => {
    const { students } = this.state;
    const config = {
      method: "delete",
      url: `http://localhost:5000/api/students/delete/${payload}`,
    };

    try {
      const response = await axios(config);
      this.setState(
        {
          students: students.filter(
            (item) => item._id !== response.data.student._id
          ),
        },
        () => {
          this.getStudents(this.state.currentPage);
        }
      );
    } catch (err) {
      console.log("Delete Student error", err);
    }
  };

  handlePageChange = (e, val) => {
    this.setState(
      {
        isLoading: true,
        currentPage: val,
      },
      async () => {
        const config = {
          method: "get",
          url: `http://localhost:5000/api/students?page=${val}&limit=6`,
        };

        try {
          const response = await axios(config);
          this.setState({
            students: response.data.current,
            isLoading: false,
          });
        } catch (err) {
          console.log("Get Students error", err);
        }

        window.scrollTo(0, 0);
      }
    );
  };

  handleLogout = () => {
    const { history } = this.props;
    history.push("/");
  }

  componentDidMount() {
    this.getStudents();
    this.getAdminName();
  }

  render() {
    const { isLoading, students: data, totalStudents, adminName } = this.state;
    const { classes } = this.props;

    const numberOfPages = Math.ceil(totalStudents / 6);
    return (
      <div className={classes.rboot}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography className={classes.headerStyle}>Apache's</Typography>
            <Button onClick={this.handleLogout} color="secondary" variant="contained" size="small" style={{letterSpacing: 0.5}} >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div
            className={classes.toolbar}
            style={{
              background: "#3f51b5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {adminName}
          </div>
          <Divider />
          <List>
            {["Dashboard"].map((text, index) => (
              <Link
                to={text.toLowerCase()}
                key={text.toLowerCase()}
                className={classes.linkStyle}
              >
                <ListItem button key={text}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <AddStudent addNewStudent={this.addNewStudent} />
          <Center>{isLoading && <h2>Loading....</h2>}</Center>
          <Grid
            container
            spacing={3}
            className={classes.gridStyle}
            justify="center"
          >
            {data.map((item) => (
              <Grid item key={item.email} xs={12} sm={8} md={6} lg={4}>
                <StudentCard
                  data={item}
                  deleteStudent={this.deleteStudent}
                  updateStudentDetails={this.updateStudentDetails}
                />
              </Grid>
            ))}
          </Grid>
          <Grid container justify="center" className={classes.paginationStyle}>
            <Pagination
              count={numberOfPages}
              onChange={(e, value) => this.handlePageChange(e, value)}
            />
          </Grid>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
