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
    poklon: 0
  };

  mapIncome = incomes => {
    let plata = 0;
    let honorar = 0;
    let poklon = 0;
    let renta = 0;
    incomes.map(el => {
      {
        el.category === "plata"
          ? (plata = plata + parseInt(el.amount))
          : el.category === "honorar"
          ? (honorar = honorar + parseInt(el.amount))
          : el.category === "poklon"
          ? (poklon = poklon + parseInt(el.amount))
          : (renta = renta + parseInt(el.amount));
      }
    });
    console.log(plata);
    console.log(poklon);
    console.log(honorar);
    this.setState({
      plata: plata,
      honorar: honorar,
      poklon: poklon,
      renta: renta
    });
  };

  componentDidMount() {
    const username = localStorage.getItem("username");

    axios
      .post(
        "https://racunko.herokuapp.com/items",

        {
          username: username
        }
      )
      .then(response => {
        console.log(response.data);
        this.mapIncome(response.data);
        const postojeciprihodi = response.data.filter(function(prihod) {
          return prihod.property === "prihod";
        });
        this.setState({
          sviprihodi: postojeciprihodi
        });
        console.log(this.state.sviprihodi);
        var vrijednost = 0;
        for (var i = 0; i < this.state.sviprihodi.length; i++) {
          vrijednost = vrijednost + this.state.sviprihodi[i].amount;
        }
        console.log(vrijednost);
        this.setState({
          ukupanPrihod: vrijednost
        });
        this.props.podesiPrihod(vrijednost);
      })
      .catch(err => console.log(err));
  }

  onInputChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  onFormSubmit = event => {
    event.preventDefault();
    const username = localStorage.getItem("username");
    const usertoken = localStorage.getItem("usertoken");

    console.log(username);

    axios
      .post("https://racunko.herokuapp.com/add", {
        username: username,
        item: {
          property: this.state.prihod,
          amount: this.state.vrijednostprihoda,
          category: this.state.kategorijaprihoda,
          description: this.state.opisprihoda
        }
      })
      .then(response => {
        console.log(response);
        const prihod1 = {
          id: this.state.sviprihodi.length + 1,
          category: this.state.kategorijaprihoda,
          description: this.state.opisprihoda,
          amount: this.state.vrijednostprihoda
        };
        this.props.podesiPrihod(this.state.vrijednostprihoda);
        console.log(this.state.vrijednostprihoda);
        prihod1.category === "plata"
          ? this.setState({
              plata: this.state.plata + parseInt(prihod1.amount)
            })
          : prihod1.category === "honorar"
          ? this.setState({
              honorar: this.state.honorar + parseInt(prihod1.amount)
            })
          : prihod1.category === "poklon"
          ? this.setState({
              poklon: this.state.poklon + parseInt(prihod1.amount)
            })
          : this.setState({
              renta: this.state.renta + parseInt(prihod1.amount)
            });
        this.setState({
          sviprihodi: [...this.state.sviprihodi, prihod1],
          prihod: "prihod",
          kategorijaprihoda: "plata",
          opisprihoda: "",
          ukupanPrihod:
            this.state.ukupanPrihod + Number(this.state.vrijednostprihoda),
          vrijednostprihoda: ""
        });
      })
      .catch(err =>
        this.setState({
          prihod: "prihod",
          kategorijaprihoda: "plata",
          opisprihoda: "",
          vrijednostprihoda: "",
          error: "Došlo je do greške. Molimo Vas da pokušate ponovo."
        })
      );
  };
  renderError() {
    if (this.state.error) {
      return <h1>{this.state.error}</h1>;
    }
  }
  handleIncome() {
    const listItems = this.state.sviprihodi.map(prihod => (
      <div className="ui items">
        <div className="item">
          <div className="content">
            <div className="header">
              {prihod.amount}
              {`\u20AC`}
            </div>
            <div className="meta">
              <span className="price">{prihod.category}</span>/
              <span className="price">{prihod.description}</span>
            </div>
          </div>
        </div>
      </div>
    ));
    return listItems;
  }
  render() {
    return (
      //
      <React.Fragment>
        <form onSubmit={this.onFormSubmit}>
          <div className="ui card">
            <div className="content">
              <div className="header">Prihod</div>
            </div>
            <div className="content">
              <h4 className="ui sub header">Unesite detalje prihoda</h4>
              <div className="ui small feed">
                <div className="event">
                  <div className="content">
                    <div className="summary">
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
                    <div className="summary">
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
                    <div className="summary">
                      <input
                        className="input-number-prihod"
                        type="number"
                        name="vrijednostprihoda"
                        placeholder="Vrijednost prihoda"
                        onChange={this.onInputChange}
                        value={this.state.vrijednostprihoda}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="extra content">
              <button type="submit" className="ui button">
                Dodaj Prihod
              </button>
            </div>
            <div className="list-prihod">{this.handleIncome()}</div>
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
                    this.state.poklon
                  ],
                  backgroundColor: ["#d1ede1", "#7bc5ae", "#028c6a", "#003e19"],
                  hoverBackgroundColor: [
                    "#bfe6ff",
                    "#bfe6ff",
                    "#bfe6ff",
                    "#bfe6ff"
                  ]
                }
              ]
            }}
            options={{}}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Prihodi;
