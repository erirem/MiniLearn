import React, { useState, useEffect} from 'react';
import axios from 'axios';
import './Quiz.css'; // Custom CSS for QuizList
import { auth } from '../firebaseConfig';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);  
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  
  const userName = auth.currentUser?.displayName;
  const userEmail = auth.currentUser?.email;

  const generateQuiz = async (quizType) => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setScore(0);
    setIsQuizFinished(false);
    setCurrentPage(0);
    setContent([]);
    setAnswers([]);

    try {
      const response = await axios.post('http://localhost:5000/api/quizes', {
        quizType,
      });
      setTitle(quizType);
      const questions = splitContent(response.data.content);
      setContent(questions);
      
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load the quiz.');
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

  
  const splitContent = (content) => {
    try {
      // If content is passed as a string, parse it
      const data = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Extract the main content sections
      const pages = Array.isArray(data.questions) 
      ? data.questions.map(section => ({
          id: section.id,
          question: section.question,
          options: section.options,
          answer: section.answer
        }))
      : [];
      // Add the main title and description as the first page
      pages.unshift({
        id: 0,
        title: data.title,
        description: data.description,
        options: [],
        question: [],
        answer: [] // Empty array since the main content doesn't have key points
      });
  
      return pages;
    } catch (error) {
      console.error('Error processing content:', error);
      return [];
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    const currentQuestion = content[currentPage];
    const studentAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedOption,
      correctAnswer: currentQuestion.answer,
    };
    console.log('studentAnswer:', studentAnswer);

    setAnswers((prevAnswers) => [...prevAnswers, studentAnswer]);
    console.log(answers)
    
    setSelectedOption(null);

    if (currentPage < content.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setIsQuizFinished(true);
    }
  };
 
  function calculateScore(answers) {
    let puan = 0;
    answers.forEach(answer => {
      console.log("Selected Option: ", answer.selectedOption, "Correct Answer: ", answer.correctAnswer)
      if (answer.selectedOption === answer.correctAnswer) {
        puan += 1; // Increment score for each correct answer
      }
      console.log(puan)
    });
    setScore(puan);
  }

  const sendAnswersToBackend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/evaluate', {
        answers,
        quizType: title, // Hangi quiz türünün çözüldüğünü de ekleyebilirsin
        score,
        userEmail,
        userName
      });
      
      // Backend'den dönen yorumları burada işleyebilirsin
      console.log('Model Output:', response.data);
    } catch (error) {
      console.error('Error sending answers to the backend:', error);
    }
  };
  
  // Quiz tamamlandığında bu fonksiyonu çağır
  if (isQuizFinished) {
    calculateScore(answers);
    setShowScore(true);
    sendAnswersToBackend();
    setIsQuizFinished(false);
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quiz Seç</h2>
      <div className="button-group">
        <button className="quiz-button" onClick={() => generateQuiz('Yapay Zeka')}>
          Yapay Zeka
        </button>
        <button className="quiz-button" onClick={() => generateQuiz('Matematik')}>
          Matematik
        </button>
        <button className="quiz-button" onClick={() => generateQuiz('Tarih')}>
          Tarih
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && content.length > 0 && !isQuizFinished && (
        <div className="card-container">
          <h3 className="card-title">{title} (Card {currentPage + 1} of {content.length}):</h3>
          <div className="card">
            <h4>{content[0].title}</h4>
            <p>{content[0].description}</p>
            <div className="quiz-card">
                {currentPage > 0 && (
                  <h3 className="quiz-question-title">
                    {title} (Question {currentPage} of {content.length - 1})
                  </h3>
                )}
               <p className="quiz-question">{content[currentPage].question}</p>
            <div className="quiz-options">
              {content[currentPage].options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
                >
                {option}
              </button>
            ))}
            </div>
          </div>
          </div>

            <div className="navigation-buttons">
              <button
                className="nav-button"
                onClick={submitAnswer}
                disabled={selectedOption === null}
                >
                Submit Answer
              </button>
              <button className="nav-button" onClick={prevPage} disabled={currentPage === 0}>
                Previous
              </button>
              <button className="nav-button" onClick={nextPage} disabled={currentPage === content.length - 1}>
                Next
              </button>
          </div>
        </div>
      )}
      {showScore && (
        <div className="quiz-results">
          <h3 className="results-title">Quiz Tamamlandı!</h3>
          <p className="score-text">Puanınız: {score} / {content.length-1}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
