import React from "react";
import moment from "moment";
import { DatePicker } from "antd";
import Axios from "axios";
import { Link } from "react-router-dom";
import "../../src/App.css";
import { Pie } from "react-chartjs-2";


const Filter =(props)=> {
  const prihodi = props.items.filter((prihod) => prihod.property==='prihod'
  
  );
  const rashodi = props.items.filter(rashod => rashod.property==='rashod'
  );
  const plate=prihodi.filter(prihod=>prihod.category==='plata');
  const honorari=prihodi.filter(prihod=>prihod.category.name==='honorar')
  const rente=prihodi.filter(prihod=>prihod.category==='renta');
  const pokloni=prihodi.filter(prihod=>prihod.category==='poklon');
  const transporti=rashodi.filter(prihod=>prihod.category==='transport');
  const hrane=rashodi.filter(prihod=>prihod.category==='hrana');
  const odjece=rashodi.filter(prihod=>prihod.category==='odjeca');
  const edukacije=rashodi.filter(prihod=>prihod.category==='edukacija');
  const saberi=(niz)=>{
      niz.map((item)=>{
      let zbir=0;
      zbir=zbir+item.amount;
return zbir;
  })
}
const plata=saberi(plate);
const honorar=saberi(honorari);
const poklon=saberi(pokloni);
const renta=saberi(rente);
const hrana=saberi(hrane);
const odjeca=saberi(odjece);
const edukacija=saberi(edukacije);
const transport=saberi(transporti);

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
      <DatePicker onChange={onChange} picker="month" />
      <div>
      <span className="total">Ukupan prihod:</span>
            <span className="ukupan-prihod">
              {plata+honorar+renta+poklon}
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
                    honorar,
                    poklon,
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
      <div id='prihodi' className='list-prihod'>{listItems(prihodi)}</div>
      </div>
      </div>
      <div id='rashodi' className='list-rashod'>{listItems(rashodi)}</div>
    </React.Fragment>

  );
};

export default Filter;
