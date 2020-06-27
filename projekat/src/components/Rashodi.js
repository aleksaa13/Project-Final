import React from "react";
import "../../src/App.css";
import "../../src/App.css";
import axios from "axios";
import { Pie } from "react-chartjs-2";

class Rashodi extends React.Component {
  state = {
    error: null,
    rashod: "rashod",
    kategorijarashoda: "hrana",
    opisrashoda: "",
    vrijednostrashoda: "",
    svirashodi: [],
    ukupanRashod: 0,
    hrana: 0,
    transport: 0,
    edukacija: 0,
    odjeca: 0
  };
  mapIncome = incomes => {
    let hrana = 0;
    let odjeca = 0;
    let transport = 0;
    let edukacija = 0;
    incomes.map(el => {
      {
        el.category === "hrana"
          ? (hrana = hrana + parseInt(el.amount))
          : el.category === "odjeca"
          ? (odjeca = odjeca + parseInt(el.amount))
          : el.category === "edukacija"
          ? (edukacija = edukacija + parseInt(el.amount))
          : (transport = transport + parseInt(el.amount));
      }
    });
    console.log(transport);
    console.log(edukacija);
    console.log(odjeca);
    this.setState({
      hrana: hrana,
      odjeca: odjeca,
      edukacija: edukacija,
      transport: transport
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
        const postojecirahodi = response.data.filter(function(rashod) {
          return rashod.property === "rashod";
        });
        this.setState({
          svirashodi: postojecirahodi
        });
        var vrijednost = 0;
        for (var i = 0; i < this.state.svirashodi.length; i++) {
          vrijednost = vrijednost + this.state.svirashodi[i].amount;
        }
        console.log(vrijednost);
        this.setState({
          ukupanRashod: vrijednost
        });
        this.props.podesiRashod(vrijednost);
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
    const usertoken = localStorage.getItem("usertoken");
    const username = localStorage.getItem("username");
    console.log(usertoken);

    //const headers = { Authorization: "Bearer " + usertoken };
    axios
      .post(
        "https://racunko.herokuapp.com/add",

        {
          username: username,
          item: {
            property: this.state.rashod,
            amount: this.state.vrijednostrashoda,
            category: this.state.kategorijarashoda,
            description: this.state.opisrashoda
          }
        }
      )
      .then(response => {
        console.log(response);
        const rashod1 = {
          id: this.state.svirashodi.length + 1,
          category: this.state.kategorijarashoda,
          description: this.state.opisrashoda,
          amount: this.state.vrijednostrashoda
        };
        this.props.podesiRashod(this.state.vrijednostrashoda);
        console.log(this.state.vrijednostrashoda);
        rashod1.category === "transport"
          ? this.setState({
              transport: this.state.transport + parseInt(rashod1.amount)
            })
          : rashod1.category === "edukacija"
          ? this.setState({
              edukacija: this.state.edukacija + parseInt(rashod1.amount)
            })
          : rashod1.category === "hrana"
          ? this.setState({
              hrana: this.state.hrana + parseInt(rashod1.amount)
            })
          : this.setState({
              odjeca: this.state.odjeca + parseInt(rashod1.amount)
            });
        this.setState({
          svirashodi: [...this.state.svirashodi, rashod1],
          rashod: "rashod",
          kategorijarashoda: "transport",
          opisrashoda: "",
          ukupanRashod:
            this.state.ukupanRashod + Number(this.state.vrijednostrashoda),
          vrijednostrashoda: ""
        });
      })
      .catch(err =>
        this.setState({
          rashod: "rashod",
          kategorijarashoda: "hrana",
          opisprashoda: "",
          vrijednostrashoda: "",
          error: "Došlo je do greške. Molimo Vas da pokušate ponovo."
        })
      );
  };

  handleExpense() {
    console.log(this.state.svirashodi);
    const listItems = this.state.svirashodi.map(rashod => (
      <div key={rashod.id} className="ui items">
        <div className="item">
          <div className="content">
            <div className="header">
              {rashod.amount}
              {`\u20AC`}
            </div>
            <div className="meta">
              <span className="price">{rashod.category}</span>/
              <span className="price">{rashod.description}</span>
            </div>
          </div>
        </div>
      </div>
    ));
    return listItems;
  }
  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.onFormSubmit}>
          <div className="ui card">
            <div className="content">
              <div className="header">Rashod</div>
            </div>
            <div className="content">
              <h4 className="ui sub header">Unesite detalje rashoda</h4>
              <div className="ui small feed">
                <div className="event">
                  <div className="content">
                    <div className="summary">
                      <select
                        className="ui dropdown"
                        name="kategorijarashoda"
                        value={this.state.kategorijarashoda}
                        onChange={this.onInputChange}
                      >
                        <option value="hrana"> Hrana </option>{" "}
                        <option value="transport"> Transport </option>{" "}
                        <option value="edukacija"> Edukacija </option>{" "}
                        <option value="odjeca"> Odjeca </option>{" "}
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
                          name="opisrashoda"
                          placeholder="Opis rashoda"
                          onChange={this.onInputChange}
                          value={this.state.opisrashoda}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="event">
                  <div className="content">
                    <div className="summary">
                      <input
                        className="input-number-rashod"
                        type="number"
                        name="vrijednostrashoda"
                        placeholder="Vrijednost rashoda"
                        onChange={this.onInputChange}
                        value={this.state.vrijednostrashoda}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="extra content">
              <button type="submit" className="ui button">
                Dodaj Rashod
              </button>
            </div>
            
          </div>
          <p>
            <span className="total">Ukupan rashod:</span>
            <span className="ukupan-rashod">
              {this.state.ukupanRashod}
              {`\u20AC`}
            </span>
          </p>
        </form>
        <div className="chart-wrap-expense">
          <Pie
            data={{
              labels: ["Transport", "Odjeca", "Edukacija", "Hrana"],
              datasets: [
                {
                  data: [
                    this.state.transport,
                    this.state.odjeca,
                    this.state.edukacija,
                    this.state.hrana
                  ],
                  backgroundColor: ["#ffc2c3", "#fe7773", "#e81e25", "#0e0301"],
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
        <div className="list-rashod">{this.handleExpense()}</div>
      </React.Fragment>
    );
  }
}
export default Rashodi;
