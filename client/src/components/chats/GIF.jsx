import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AppConfig from "../../config/AppConfig";

function GIF({ onSelectGif }) {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const TENOR_API_KEY = AppConfig.tenorApiKey;
  const CLIENT_KEY = AppConfig.tenorClientKey;

  const fetchGif = async () => {
    const gifResponse = await fetch(
      `https://tenor.googleapis.com/v2/search?q=funny,cricket,coding,food,good morning,happy&key=${TENOR_API_KEY}&client_key=${CLIENT_KEY}&limit=50`
    );
    const json = await gifResponse.json();
    setGifs(json.results);
    setLoading(false);
  };

  const searchGifHandler = async () => {
    setLoading(true);
    const searchResponse = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${search}&key=${TENOR_API_KEY}&limit=100`
    );
    const json = await searchResponse.json();
    setGifs(json.results);
    setLoading(false);
  };

  useEffect(() => {
    fetchGif();
  }, []);

  return (
    <div className="gif-wrapper">
      <div className="search-container1">
        <div className="search-input">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            value={search}
            placeholder="Search Tenor"
            onChange={(e) => {
              setSearch(e.target.value);
              searchGifHandler();
            }}
          />
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="gif-grid">
          {gifs?.map((gif) => (
            <div
              className="gif-item"
              key={gif.id}
              onClick={() => onSelectGif(gif.media_formats.gif.url)}
            >
              <img
                src={gif.media_formats.gif.url}
                alt={gif.content_description}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GIF;
