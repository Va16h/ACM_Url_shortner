import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConf } from './firebase_config.js'


firebase.initializeApp(firebaseConf());
const db = firebase.firestore();

function App() {
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [urls, setUrls] = useState([]);
  const [clickCounts, setClickCounts] = useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection('urls').get();
        const fetchedUrls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUrls(fetchedUrls);
      } catch (error) {
        console.error('Error fetching URLs: ', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url || !note) {
      return;
    }

    try {
      const docRef = await db.collection('urls').add({
        url,
        note,
        clickCount: 0,
      });
      const newUrl = {
        id: docRef.id,
        url,
        note,
        clickCount: 0,
      };
      setUrls([newUrl, ...urls]);
      setUrl('');
      setNote('');
      const shortenedId = docRef.id;
      const shortenedURL = `${window.location.origin}/${shortenedId}`;

      setShortenedUrl(shortenedURL);
    } catch (error) {
      console.error('Error adding URL: ', error);
    }
  };

  const handleUrlClick = (id) => {
    const updatedClickCounts = { ...clickCounts };
    updatedClickCounts[id] = (updatedClickCounts[id] || 0) + 1;
    setClickCounts(updatedClickCounts);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUrls = urls.filter((urlData) => {
    const searchString = `${urlData.url} ${urlData.note}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="App">
      <h1 className="title">URL Shortener</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>


      {shortenedUrl && (
        <div className="shortened-url">
          <p>Your shortened URL:</p>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer" className="url-link">
            {shortenedUrl}
          </a>
        </div>
      )}


      <div className="search">
        <input
          type="text"
          placeholder="Search URLs"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="urls">
        {filteredUrls.length > 0 ? (
          <ul className="url-list">
            {filteredUrls.map((url) => (
              <li key={url.id} className="url-item">
                <p className="url-note">{url.note}</p>
                <a
                  className="url-link"
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleUrlClick(url.id)}
                >
                  {url.url}
                </a>
                <span className="click-count">{clickCounts[url.id] || 0}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No matching URLs found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
