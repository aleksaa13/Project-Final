import React from "react";
import moment from "moment";
import { DatePicker } from "antd";
import Axios from "axios";
import { Link } from "react-router-dom";
import "../../src/App.css";
import { Pie } from "react-chartjs-2";
//import 'moment/locale/sr';

const Filter = (props) => {
  let bilans=0;
  let ovajMjesec=moment().locale('sr').format('MMMM');
  const prihodi = props.items.filter((prihod) => prihod.property === "prihod");
  const rashodi = props.items.filter((rashod) => rashod.property === "rashod");
  const plate = prihodi.filter((prihod) => prihod.category === "plata");
  const honorari = prihodi.filter((prihod) => prihod.category === "honorar");
  const rente = prihodi.filter((prihod) => prihod.category === "renta");
  const pokloni = prihodi.filter((prihod) => prihod.category === "poklon");
  const transporti = rashodi.filter(
    (prihod) => prihod.category === "transport"
  );
  const hrane = rashodi.filter((prihod) => prihod.category === "hrana");
  const odjece = rashodi.filter((prihod) => prihod.category === "odjeca");
  const edukacije = rashodi.filter((prihod) => prihod.category === "edukacija");

  const saberi = (niz) => {
    let array = niz.map((item) => {
      return item.amount;
    });
    let sum = array.reduce(function (a, b) {
      return a + b;
    }, 0);
    return sum;
  };
  let plata = saberi(plate);
  console.log(plata);
  const honorar = saberi(honorari);
  const poklon = saberi(pokloni);
  const renta = saberi(rente);
  const hrana = saberi(hrane);
  const odjeca = saberi(odjece);
  const edukacija = saberi(edukacije);
  const transport = saberi(transporti);
  const sviPrihodi=honorar+poklon+plata+renta;
  const sviRashodi=odjeca+edukacija+transport+hrana;
  bilans=sviPrihodi-sviRashodi;

  function listItems(array) {
    const listItems = array.map((items) => (
      <div className="ui items" key={items._id}>
        <div className="item">
          <div className="content">
            <div className="header">
              {" "}
              {items.amount} {`\u20AC`}{" "}
            </div>{" "}
            <div className="meta">
              <span className="price"> {items.category} </span>/{" "}
              <span className="price"> {items.description} </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    ));

    return listItems;
  }
  function onChange(date, dateString) {
    props.getFilterData(dateString);
    console.log(props);
  }

  return (
    <React.Fragment>
      <div className='picker centralize'>
      <DatePicker onChange={onChange} picker="month" />
      </div>
      <div
                  className={
                    bilans < 0
                      ? "red  container-btn"
                      : "green container-btn"
                  }
                >
                  {bilans === 0 ? <p>Izaberite mjesec </p>:
                  <p>Bilans:{bilans}
                  {`\u20AC`} </p>
                  }
                
      </div>
      <div className='half-wrap'>
      <div className='half1'>
        <span className="total">Ukupan prihod:</span>
        <span className="ukupan-prihod">
          {plata + honorar + renta + poklon}
          {`\u20AC`}
        </span>

        <div className="chart-wrap-income">
          <Pie
            data={{
              labels: ["Plata", "Renta", "Honorar", "Poklon"],
              datasets: [
                {
                  data: [
                    saberi(plate),
                    saberi(rente),
                    saberi(honorari),
                    saberi(pokloni),
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
          <div id="prihodi" className="list-prihod">
            {listItems(prihodi)}
          </div>
        </div>
        </div>
        <div className='half2'>
        <span className="total">Ukupan rashod:</span>
        <span className="ukupan-prihod">
          {transport + odjeca + hrana + edukacija}
          {`\u20AC`}
        </span>
        <div className="chart-wrap-expense">
          <Pie
            data={{
              labels: ["Transport", "Odjeca", "Edukacija", "Hrana"],
              datasets: [
                {
                  data: [
                    saberi(transporti),
                    saberi(odjece),
                    saberi(edukacije),
                    saberi(hrane),
                  ],
                  backgroundColor: ["#ffc2c3", "#fe7773", "#e81e25", "#0e0301"],
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
        </div>
      
      <div id="rashodi" className="list-rashod">
        {listItems(rashodi)}
        </div>
        </div>
        </div>
        
    </React.Fragment>
  );
};

export default Filter;
