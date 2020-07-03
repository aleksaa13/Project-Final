import React from "react";
import "../../src/App.css";
import axios from "axios";

class Signup extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    error: null,
    emailError: null,
    passwordErrorUpper: null,
    passwordErrorLength: null,
    emailAtError: null,
    usernameError: null,
  };
  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onFormSubmit = (event) => {
    this.setState({
      username: "",
      password: "",
      email: "",
      error: null,
      emailError: null,
      passwordErrorUpper: null,
      passwordErrorLength: null,
      emailAtError: null,
      usernameError: null,
    });
    event.preventDefault();
    const psw = this.state.password;
    var brVelikihSlova = 0;
    for (let i = 0; i < psw.length; i++) {
      if (psw[i] === psw[i].toUpperCase()) {
        if (psw[i] >= 0 || psw[i] <= 9) {
        } else {
          brVelikihSlova++;
        }
      }
    }
    if (this.state.password.length < 6) {
      this.setState({
        passwordErrorLength: "Dužina pasvorda mora imati najmanje 6 karaktera",
      });
    } else if (brVelikihSlova === 0) {
      this.setState({
        passwordErrorUpper:
          "Bar jedan karakter pasvorda mora biti veliko slovo",
      });
    } else if (this.state.email === "" || this.state.email === null) {
      this.setState({
        emailError: "Molimo Vas da unesete e mail",
      });
    } else if (this.state.email.includes("@") === false) {
      this.setState({
        emailAtError: "E mail mora sadržati @ karakter",
      });
    } else if (this.state.username === "" || this.state.username === null) {
      this.setState({
        usernameError: "Molimo Vas da unesete korisničko ime",
      });
    } else {
      axios
        .post("https://racunko.herokuapp.com/register", {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
        })
        .then((response) => {
          console.log(response);
          this.props.history.push("/login");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403) {
            this.setState({
              username: "",
              password: "",
              email: "",
              error:
                "Unijeti username ili mail već postoje. Molimo Vas da izaberete novi.",
            });
          } else {
            this.setState({
              username: "",
              password: "",
              email: "",
              error: "Došlo je do greške. Molimo Vas da pokušate ponovo.",
            });
          }
        });
    }
  };

  renderError() {
    if (this.state.error) {
      return <h1 style={{ color: "red" }}> {this.state.error} </h1>;
    }
  }
  render() {
    return (
      <div className="container">
        <div className="wrap wrap-login">
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
            <div className="centralize" style={{ margin: "1%" }}>
              <div className="ui left icon input login-width">
                <input
                  className="input-login"
                  id="mail"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.onInputChange}
                  value={this.state.email}
                />
                <i className="mail icon"></i>
              </div>{" "}
              {this.state.emailError} {this.state.emailAtError}{" "}
            </div>{" "}
            <div className="centralize" style={{ margin: "1%" }}>
              <div className="ui left icon input login-width">
                <input
                  type="text"
                  placeholder="Username"
                  id="user"
                  name="username"
                  placeholder="Username"
                  onChange={this.onInputChange}
                  value={this.state.username}
                />{" "}
                <i className="users icon"> </i>{" "}
              </div>{" "}
              {this.state.usernameError}
            </div>{" "}
            <div className="centralize" style={{ margin: "1%" }}>
              <div className="ui left icon input login-width">
                <input
                  type="password"
                  id="pass"
                  name="password"
                  placeholder="Password"
                  onChange={this.onInputChange}
                  value={this.state.password}
                />{" "}
                <i className="key icon"> </i>{" "}
              </div>{" "}
              <p style={{ color: "white" }}>
                Pasvord mora sadržati najmanje 6 karaktera i bar jedno veliko
                slovo
              </p>
              {this.state.passwordErrorLength} {this.state.passwordErrorUpper}
            </div>{" "}
            <div className="container-btn">
              <button className="ui button"> Signup </button>{" "}
            </div>{" "}
          </form>{" "}
          {this.renderError()}{" "}
        </div>{" "}
      </div>
    );
  }
}

export default Signup;
