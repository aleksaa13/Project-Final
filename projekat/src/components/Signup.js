import React from "react";
import "../../src/App.css";
import axios from "axios";

class Signup extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    error: null
  };
  onInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onFormSubmit = event => {
    event.preventDefault();
    axios
      .post("https://racunko.herokuapp.com/register", {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email
      })
      .then(response => {
        console.log(response);
        this.props.history.push("/login");
      })
      .catch(err =>
        this.setState({
          username: "",
          password: "",
          email: "",
          error: "Došlo je do greške. Molimo Vas da pokušate ponovo."
        })
      );
  };

  renderError() {
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
  }
  render() {
    return (
      <div className="container">
        <div className="wrap">
          <form
            className="form"
            onSubmit={this.onFormSubmit}
            autoComplete="off"
          >
            <span className="logo">
              <img
                src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
                alt="slika"
              />
            </span>{" "}
            <span className="header"> Sign up </span>{" "}
            <div className="wrap-input">
              <input
                className="input-login"
                id="mail"
                type="email"
                name="email"
                placeholder="Email"
                onChange={this.onInputChange}
                value={this.state.email}
              />{" "}
            </div>{" "}
            <div className="wrap-input">
              <input
                className="input-login"
                id="user"
                type="text"
                name="username"
                placeholder="Username"
                onChange={this.onInputChange}
                value={this.state.username}
              />{" "}
            </div>{" "}
            <div className="wrap-input">
              <input
                className="input-login"
                id="pass"
                type="password"
                name="password"
                placeholder="Password"
                onChange={this.onInputChange}
                value={this.state.password}
              />{" "}
            </div>{" "}
            <div className="container-btn">
              <button className="btn"> Signup </button>{" "}
            </div>{" "}
          </form>{" "}
          {this.renderError()}
        </div>{" "}
      </div>
    );
  }
}

export default Signup;
