import { useState } from "react";
import { Form } from "react-bootstrap"; 
import { Link } from "react-router-dom";
const RestuarantPost = ({ restaurants }) => {
  const [search, setSearch] = useState("");
  const seen = new Set();
//a function used to avoid duplicate values
  const uniqueRestaurants = restaurants.filter((restaurant) => {
    const name = restaurant.fields.name;
    const subtype = restaurant.fields.subtype;
    const key = `${name}-${subtype}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    } else {
      seen.add(key);
      return true;
    }
  });
//search function 
  const filteredRestaurants = uniqueRestaurants.filter((restaurant) => {
    return restaurant.fields.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <h1 className="random-title">Random Restaurants</h1>
      <div className="top-section">
        <Form className="search-rest">
          <Form.Control
            type="text"
            placeholder="Search Restaurant"
            value={search}
            className="search-retaurant"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>

        <Link to="/randomRestaurant">
          <button className="random-button">Show Random Restaurant</button>
        </Link>
      </div>
      <div className="rest-grid">
        {filteredRestaurants.map((restaurant) => {
          
            //getting restuarant coordinates and display it
          const [longitude, latitude] = restaurant.geometry.coordinates;
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

          return (
            <div key={restaurant.recordid} className="rest-card">
              <h3 className="rest-name">{restaurant.fields.name}</h3>
              <p>
                <span className="value">Category: {restaurant.fields.subtype}</span>
              </p>
              <p>
               <button className="direction-button"> <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"

                  style={{ color: "#1a73e8" }}
                >
                  Get Directions
                </a></button>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestuarantPost;
