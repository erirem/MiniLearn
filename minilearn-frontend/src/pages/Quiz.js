// src/pages/Quiz.js
import React, { useEffect, useState } from 'react';

function Quiz() {
  const [quizQuestions, setQuizQuestions] = useState([]); // Başlangıç değeri []

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quiz');
        const data = await response.json();
        setQuizQuestions(data.questions || []); // Gelen veriyi kaydet, yoksa boş dizi
      } catch (error) {
        console.error('Quiz yüklenirken hata:', error);
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };

    fetchQuiz(); // Quiz verisini yükleme
  }, []);

  if (loading) return <p>Quiz Yükleniyor...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      <ul>
        {quizQuestions.map((question, index) => (
          <li key={index} className="mb-4 p-4 border rounded">
            <p>{question.text}</p>
            <ul>
              {question.options.map((option, idx) => (
                <li key={idx}>
                  <input type="radio" name={`question-${index}`} /> {option}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Quiz;