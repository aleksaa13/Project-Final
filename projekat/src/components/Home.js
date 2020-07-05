import React from "react";
import "../../src/App.css";
import Prihodi from "./Prihodi";
import Rashodi from "./Rashodi";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import Filter from "./Filter";

class Home extends React.Component {
  state = {
    token: localStorage.getItem("usertoken"),
    budzet: 0,
    sviprihodi: [],
    svirashodi: [],
    prihodiirashodi: [],
    filter: "false",
    filterItems: [],
    isLoading: true,
  };

  componentDidMount() {
    let dateString = moment().format("ll");

    const username = localStorage.getItem("username");
    let mjesec = dateString.slice(0, 3);
    let godina = dateString.slice(7);
    axios
      .post(
        "https://racunko.herokuapp.com/filter",

        {
          username: username,
          month: mjesec,
          year: godina,
        }
      )
      .then((response) => {
        this.setState({
          isLoading: false,
        });
      })
      .catch((err) => console.log(err));
  }

  getFilterData = (dateString) => {
    let godina = dateString.slice(0, 4);
    let mesec = dateString.slice(5);
    console.log(mesec);
    let mjesec = moment()
      .month(parseInt(mesec - 1))
      .format("MMM");
    /* axios */
    console.log(mjesec);
    const username = localStorage.getItem("username");
    axios
      .post("https://racunko.herokuapp.com/filter", {
        username: username,
        month: mjesec,
        year: godina,
      })
      .then((response) => {
        this.setState({ filterItems: response.data });
      })
      .catch((err) => this.props.history.push("/login"));
  };
  handleFilter = () => {
    this.setState({ filter: "true" });
  };
  handleHome = () => {
    this.setState({ filter: "false" });
  };
  podesiPrihod = (prihod) => {
    console.log(this.state.budzet);
    this.setState({
      budzet:this.state.budzet + Number(prihod)
      });
    console.log(this.state.budzet)
  };

  podesiRashod = (rashod) => {
    this.setState({
      budzet: this.state.budzet - Number(rashod),
    });
    console.log(this.state.budzet)
  };
  renderContent() {
    if (this.state.token === null || this.state.token === "undefined") {
      this.setState({ token: null });
      this.props.history.push("/login");
    } else {
      return;
    }
  }

  renderAll() {
    if (this.state.isLoading) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui large text loader"> Loading </div>{" "}
          </div>{" "}
        </div>
      );
    } else {
      return <h1>DAAAAAAAAAA</h1>;
    }
  }

  handleLogOut = () => {
    localStorage.removeItem("usertoken");
    const usertoken = localStorage.getItem("usertoken");
    this.setState({ token: null });
  };

  renderLogOut() {
    if (this.state.token) {
      return (
        <Link type="submit" onClick={this.handleLogOut}>
          Logout{" "}
        </Link>
      );
    }
  }

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        {this.state.isLoading === true ? (
          <div className="uisegment">
            <div className="ui active inverted dimmer">
              <div className="ui large text loader"> Loading </div>{" "}
            </div>{" "}
          </div>
        ) : (
          <div className="container">
            <div className="ui secondary  menu">
              <a className="active item" onClick={this.handleHome}>
                Home{" "}
              </a>{" "}
              <a className="item" onClick={this.handleFilter}>
                ByMonth{" "}
              </a>{" "}
              <div className="right menu">
                <div className="item">
                  <a className="ui item"> {this.renderLogOut()} </a>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            {this.renderContent()}
            <div className="wrap">
              {" "}
              {/* <span className="logo">
                                            <img
                                              src="data:image/jpeg;base64,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"
                                              id="round"
                                              alt="slika"
                                            />
                                          </span>{" "} */}
              {this.state.filter === "true" ? (
                <Filter
                  items={this.state.filterItems}
                  getFilterData={this.getFilterData}
                ></Filter>
              ) : (
                <div>
                  <span className="header" style={{ marginBottom: 10 }}>
                    {" "}
                    {moment().format("MMMM")}{" "}
                  </span>{" "}
                  <div className="half-wrap">
                    <div className="half1">
                      <Prihodi podesiPrihod={this.podesiPrihod} />{" "}
                    </div>{" "}
                    <div className="half2">
                      <Rashodi podesiRashod={this.podesiRashod} />{" "}
                    </div>{" "}
                  </div>{" "}
                  <div
                    className={
                      this.state.budzet < 0
                        ? "red  container-btn"
                        : "green container-btn"
                    }
                  >
                    {" "}
                    {this.state.budzet} {`\u20AC`}{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </div>
            {" "}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Home;
