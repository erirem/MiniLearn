import React, { useState } from 'react';
import axios from 'axios';

const ModulesList = () => {
  const [content, setContent] = useState([]); // Store content as an array of chunks
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chunkSize = 200; // Set the size of each chunk

  // Function to split content into chunks
  const splitContent = (text) => {
    console.log(text.title)
    const regex = new RegExp(`(.{1,${chunkSize}})(\\s|$)`, 'g');
    return text.match(regex) || [];
  };

  // Modül üretme fonksiyonu
  const generateModule = async (moduleType) => {
    setLoading(true);
    setError(null); // Reset error before generating new content
    setCurrentPage(0); // Reset page to the beginning

    try {
      const response = await axios.post('http://localhost:5000/api/modules', {
        moduleType, // Modül tipini gönderiyoruz
      });

      const chunks = splitContent(response.data.content);
      setContent(chunks); // Store content as chunks
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
    <div>
      <h2>Select a Module</h2>
      <button onClick={() => generateModule('ai')}>Artificial Intelligence</button>
      <button onClick={() => generateModule('math')}>Mathematics</button>
      <button onClick={() => generateModule('history')}>History</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {content.length > 0 && (
        <div>
          <h3>Generated Content (Page {currentPage + 1} of {content.length}):</h3>
          <p>{content[currentPage]}</p>
          <div>
            <button onClick={prevPage} disabled={currentPage === 0}>
              Previous
            </button>
            <button onClick={nextPage} disabled={currentPage === content.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesList;
