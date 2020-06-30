import React from "react";
import "../../src/App.css";
import axios from "axios";
import { Pie } from "react-chartjs-2";

class Prihodi extends React.Component {
  state = {
    error: null,
    prihod: "prihod",
    kategorijaprihoda: "plata",
    opisprihoda: "",
    vrijednostprihoda: "",
    sviprihodi: [],
    ukupanPrihod: 0,
    plata: 0,
    renta: 0,
    honorar: 0,
    poklon: 0,
  };

  mapIncome = (incomes) => {
    let plata = 0;
    let honorar = 0;
    let poklon = 0;
    let renta = 0;
    incomes.map((el) => {
      {
        el.category === "plata"
          ? (plata = plata + parseInt(el.amount))
          : el.category === "honorar"
          ? (honorar = honorar + parseInt(el.amount))
          : el.category === "poklon"
          ? (poklon = poklon + parseInt(el.amount))
          : el.category === "renta"
          ? (renta = renta + parseInt(el.amount))
          : console.log("micko");
      }
    });

    this.setState({
      plata: plata,
      honorar: honorar,
      poklon: poklon,
      renta: renta,
    });
  };

  componentDidMount() {
    const username = localStorage.getItem("username");

    axios
      .post(
        "https://racunko.herokuapp.com/items",

        {
          username: username,
        }
      )
      .then((response) => {
        this.mapIncome(response.data);
        const postojeciprihodi = response.data.filter(function (prihod) {
          return prihod.property === "prihod";
        });
        this.setState({
          sviprihodi: postojeciprihodi,
        });

        var vrijednost = 0;
        for (var i = 0; i < this.state.sviprihodi.length; i++) {
          vrijednost = vrijednost + this.state.sviprihodi[i].amount;
        }

        this.setState({
          ukupanPrihod: vrijednost,
        });
        this.props.podesiPrihod(vrijednost);
      })
      .catch((err) => console.log(err));
  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  onFormSubmit = (event) => {
    event.preventDefault();
    const username = localStorage.getItem("username");
    const usertoken = localStorage.getItem("usertoken");

    axios
      .post("https://racunko.herokuapp.com/add", {
        username: username,
        item: {
          property: this.state.prihod,
          amount: this.state.vrijednostprihoda,
          category: this.state.kategorijaprihoda,
          description: this.state.opisprihoda,
        },
      })
      .then((response) => {
        const prihod1 = {
          _id: response.data._id,
          category: this.state.kategorijaprihoda,
          description: this.state.opisprihoda,
          amount: Number(this.state.vrijednostprihoda),
        };
        this.props.podesiPrihod(this.state.vrijednostprihoda);

        prihod1.category === "plata"
          ? this.setState({
              plata: this.state.plata + parseInt(prihod1.amount),
            })
          : prihod1.category === "honorar"
          ? this.setState({
              honorar: this.state.honorar + parseInt(prihod1.amount),
            })
          : prihod1.category === "poklon"
          ? this.setState({
              poklon: this.state.poklon + parseInt(prihod1.amount),
            })
          : this.setState({
              renta: this.state.renta + parseInt(prihod1.amount),
            });
        this.setState({
          sviprihodi: [...this.state.sviprihodi, prihod1],
          prihod: "prihod",
          kategorijaprihoda: "plata",
          opisprihoda: "",
          ukupanPrihod:
            this.state.ukupanPrihod + parseInt(this.state.vrijednostprihoda),
          vrijednostprihoda: "",
        });
      })
      .catch((err) =>
        this.setState({
          prihod: "prihod",
          kategorijaprihoda: "plata",
          opisprihoda: "",
          vrijednostprihoda: "",
          error: "Došlo je do greške. Molimo Vas da pokušate ponovo.",
        })
      );
  };
  renderError() {
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
  }

  deleteIncome = (e) => {
    const id = e.target.id;
    console.log(id);
    const username = localStorage.getItem("username");
    axios
      .delete("https://racunko.herokuapp.com/delete", {
        username: username,
        _id: id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
    const novisviprihodi = this.state.sviprihodi.filter(function (prihod) {
      return prihod._id !== id;
    });
    this.setState({
      sviprihodi: novisviprihodi,
    });
    var vrijednost = 0;
    for (var i = 0; i < novisviprihodi.length; i++) {
      vrijednost = vrijednost + parseInt(novisviprihodi[i].amount);
    }
    var umanjenje = vrijednost - this.state.ukupanPrihod;
    this.setState({
      ukupanPrihod: vrijednost,
    });
    this.props.podesiPrihod(umanjenje);
    this.mapIncome(this.state.sviprihodi);
  };

  handleIncome() {
    const listItems = this.state.sviprihodi.map((prihod) => (
      <div className="ui items" key={prihod._id}>
        <div className="item">
          <div className="content">
            <div className="header">
              {" "}
              {prihod.amount} {`\u20AC`}{" "}
            </div>{" "}
            <div className="meta">
              <span className="price"> {prihod.category} </span>/{" "}
              <span className="price"> {prihod.description} </span>{" "}
              <button type="button" id={prihod._id} onClick={this.deleteIncome}>
                Obrisi prihod
              </button>
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    ));

    return listItems;
  }
  render() {
    return (
      //
      <div className="component-wrap">
        <form onSubmit={this.onFormSubmit}>
          <div className="ui card centralize">
            <div className="content">
              <div className="header">Prihod</div>
            </div>
            <div className="content centralize">
              <h4 style={{ textAlign: "center" }} className="ui sub header">
                Unesite detalje prihoda
              </h4>
              <div className="ui small feed">
                <div className="event">
                  <div className="content">
                    <div className="summary centralize">
                      <select
                        className="ui dropdown"
                        name="kategorijaprihoda"
                        value={this.state.kategorijaprihoda}
                        onChange={this.onInputChange}
                      >
                        <option value="plata"> Plata </option>{" "}
                        <option value="renta"> Renta </option>{" "}
                        <option value="honorar"> Honorar </option>{" "}
                        <option value="poklon"> Poklon </option>{" "}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="event">
                  <div className="content">
                    <div className="summary centralize">
                      <div className="ui input">
                        <input
                          type="text"
                          name="opisprihoda"
                          placeholder="Opis prihoda"
                          onChange={this.onInputChange}
                          value={this.state.opisprihoda}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="event">
                  <div className="content">
                    <input
                      className="input-number-prihod"
                      type="number"
                      name="vrijednostprihoda"
                      placeholder="Unesite vrijednost"
                      onChange={this.onInputChange}
                      value={this.state.vrijednostprihoda}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="extra content">
              <button type="submit" className="ui button">
                Dodaj Prihod
              </button>
            </div>
          </div>
          <p>
            <span className="total">Ukupan prihod:</span>
            <span className="ukupan-prihod">
              {this.state.ukupanPrihod}
              {`\u20AC`}
            </span>
          </p>
        </form>
        <div className="chart-wrap-income">
          <Pie
            data={{
              labels: ["Plata", "Renta", "Honorar", "Poklon"],
              datasets: [
                {
                  data: [
                    this.state.plata,
                    this.state.renta,
                    this.state.honorar,
                    this.state.poklon,
                  ],
                  backgroundColor: ["#d1ede1", "#7bc5ae", "#028c6a", "#003e19"],
                  hoverBackgroundColor: [
                    "#bfe6ff",
                    "#bfe6ff",
                    "#bfe6ff",
                    "#bfe6ff",
                  ],
                },
              ],
            }}
            options={{}}
          />

          <div className="list-prihod">{this.handleIncome()}</div>
        </div>
      </div>
    );
  }
}

export default Prihodi;
