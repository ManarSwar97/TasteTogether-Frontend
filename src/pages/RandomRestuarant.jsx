import axios from "axios";
import { useState, useEffect } from "react";

const RandomRestaurant = () => {
//use states to get restaurant name, category, and coordinates
  const [restaurant, setRestaurant] = useState("");
  const [category, setCategory] = useState("");
  const [coordinates, setCoordinates] = useState(null);
// useState to store the fetched API results as an array
  const [data, setData] = useState([]);

//pickRandom is a function that takes the fetched API results as a paramenter and randomily picked a restaurant from that array and update the components states with that restaurant information
  const pickRandom = (records) => {
    if (records.length > 0) {
      const random = records[Math.floor(Math.random() * records.length)];
      setRestaurant(random.fields.name);
      setCategory(random.fields.subtype);
      setCoordinates(random.geometry.coordinates);
    }
  };

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        //fetch data from the API
        const response = await axios.get(
          "https://www.data.gov.bh/api/records/1.0/search/?dataset=restaurants0&rows=1600"
        );
        // extract the records from the response
        const records = response.data.records;
        //update setData state with the records value
        setData(records);
        //pass the records as an argument to pickRandom function (select random restaurant)
        pickRandom(records);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    getRestaurants();
  }, []);

    const mapsUrl = coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`
    : null;

return (
  
    <div className="random-rest">
      <div className="random-container">
        <h2>{restaurant || "Click below to pick a restaurant"}</h2>
        {restaurant && <h4>Category: {category}</h4>}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="direction-btn"
          >
            Get Directions
          </a>
        )}
        <button className="random-btn" onClick={() => pickRandom(data)}>
          Generate New Restaurant
        </button>
      </div>
    </div>

  );
};

export default RandomRestaurant;
