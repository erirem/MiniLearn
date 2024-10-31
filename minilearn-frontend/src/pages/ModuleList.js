import React, { useState } from 'react';
import axios from 'axios';
import './ModulesList.css'; // Import the custom CSS file

const ModulesList = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const splitContent = (text) => {
    const cardRegex = /\*\*Kart \d+: (.*?)\*\*\n(.*?)(?=\*\*Kart \d+:|\n$)/gs;
    const cards = [];
    let match;
    while ((match = cardRegex.exec(text)) !== null) {
      cards.push({
        title: match[1].trim(),
        description: match[2].trim(),
      });
    }
    return cards;
  };

  const generateModule = async (moduleType) => {
    setLoading(true);
    setError(null);
    setCurrentPage(0);

    try {
      const response = await axios.post('http://localhost:5000/api/modules', {
        moduleType,
      });
      const cards = splitContent(response.data.content);
      setContent(cards);
    } catch (err) {
      console.error('Error generating module:', err);
      setError('Failed to generate module.');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="module-container">
      <h2 className="module-title">Select a Module</h2>
      <div className="button-group">
        <button className="module-button" onClick={() => generateModule('ai')}>
          Artificial Intelligence
        </button>
        <button className="module-button" onClick={() => generateModule('math')}>
          Mathematics
        </button>
        <button className="module-button" onClick={() => generateModule('history')}>
          History
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {content.length > 0 && (
        <div className="card-container">
          <h3 className="card-title">Generated Content (Card {currentPage + 1} of {content.length}):</h3>
          <div className="card">
            <h4>{content[currentPage].title}</h4>
            <p>{content[currentPage].description}</p>
          </div>
          <div className="navigation-buttons">
            <button className="nav-button" onClick={prevPage} disabled={currentPage === 0}>
              Previous
            </button>
            <button className="nav-button" onClick={nextPage} disabled={currentPage === content.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesList;
