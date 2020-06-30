import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import Axios from 'axios';
import {Link} from 'react-router-dom';

const Filter = (props) => {
   
    function onChange(date, dateString) {
        props.getFilterData(dateString);
        console.log(props);
      }
    return ( 
        <DatePicker onChange={onChange} picker="month" />
        
        /*ispis props.filterItems */
    );
    }
 
export default Filter;
