import { useState } from "react";
import { Form } from "react-bootstrap"; 

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
      <Form>
        <Form.Control
          type="text"
          placeholder="Search Restaurant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>

      <div className="rest-grid">
        {filteredRestaurants.map((restaurant) => {

            //getting restuarant coordinates and display it
          const [longitude, latitude] = restaurant.geometry.coordinates;
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

          return (
            <div key={restaurant.recordid} className="rest-card">
              <h3 className="rest-name">{restaurant.fields.name}</h3>
              <p>
                <span className="label">Subtype:</span>{" "}
                <span className="value">{restaurant.fields.subtype}</span>
              </p>
              <p>
                <span className="label">Block:</span>{" "}
                <span className="value">{restaurant.fields.block}</span>
              </p>
              <p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1a73e8" }}
                >
                  Get Directions
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestuarantPost;
