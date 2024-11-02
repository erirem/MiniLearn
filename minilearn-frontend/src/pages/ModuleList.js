import React, { useState } from 'react';
import axios from 'axios';
import './ModulesList.css'; // Import the custom CSS file

const ModulesList = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('')

  const splitContent = (content) => {
    try {
      // If content is passed as a string, parse it
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Extract the main content sections
      const pages = data.sections.map(section => ({
        id: section.id,
        title: section.title,
        description: section.content,
        keyPoints: section.keyPoints
      }));
  
      // Add the main title and description as the first page
      pages.unshift({
        id: 0,
        title: data.title,
        description: data.description,
        keyPoints: [] // Empty array since the main content doesn't have key points
      });
  
      return pages;
    } catch (error) {
      console.error('Error processing content:', error);
      return [];
    }
  };

  const generateModule = async (moduleType) => {
    setLoading(true);
    setError(null);
    setCurrentPage(0);
    setContent([])

    try {
      const response = await axios.post('http://localhost:5000/api/modules', {
        moduleType,
      });
      setTitle(moduleType);
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
      <h2 className="module-title">Modül Seç</h2>
      <div className="button-group">
        <button className="module-button" onClick={() => generateModule('Yapay Zeka')}>
          Yapay Zeka
        </button>
        <button className="module-button" onClick={() => generateModule('Matematik')}>
          Matematik
        </button>
        <button className="module-button" onClick={() => generateModule('Tarih')}>
          Tarih
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {content.length > 0 && (
        <div className="card-container">
          <h3 className="card-title">{title} (Card {currentPage + 1} of {content.length}):</h3>
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
