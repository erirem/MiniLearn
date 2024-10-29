import React, { useState } from 'react';
import axios from 'axios';

const ModulesList = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modül üretme fonksiyonu
  const generateModule = async (moduleType) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/modules', {
        moduleType, // Modül tipini gönderiyoruz
      });
      console.log('Generated Content:', response.data.content);
      setContent(response.data.content);
    } catch (err) {
      console.error('Error generating module:', err);
      setError('Failed to generate module.');
    } finally {
      setLoading(false);
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
      {content && (
        <div>
          <h3>Generated Content:</h3>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default ModulesList;
