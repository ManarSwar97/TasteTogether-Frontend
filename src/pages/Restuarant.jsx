import axios from "axios";
import { useState, useEffect } from "react";
import RestuarantPost from "../components/RestuarantPost";
import RandomRestaurant from "./RandomRestuarant";
import { Link } from "react-router-dom";
const Restaurant = () =>{
    const [restaurants , setRestuarant] = useState([])
    useEffect(()=>{
        const getRestuarant = async () =>{
            const response = await axios.get(`https://www.data.gov.bh/api/records/1.0/search/?dataset=restaurants0&rows=10`)
            setRestuarant(response.data.records)
        }
        getRestuarant()
    }, [])

return (
  <div>
    <Link to="/random">
    <button>Show Random Restaurant</button>
    </Link>
    <RestuarantPost restaurants={restaurants} />
  </div>
);


}
export default Restaurant;
