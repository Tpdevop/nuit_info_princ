import { useState, useRef, useEffect } from "react";
import { ReactComponent as HumanBody } from "../assets/hbRenewedAgain.svg";
import questions from "../assets/questions.json";
import AudioBackground from "./AudioBackground";
import HealthBar from "./HealthBar";
import Popup from "./Popup";

const HumanBodyComponent = () => {
  const svgRef = useRef(null);
  const [health, setHealth] = useState(100); // Health level
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Questions answered
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 }); // Statistics
  const [popup, setPopup] = useState({
    visible: false,
    bodyPart: "",
    question: "",
    options: [],
    context: "",
    x: 0,
    y: 0,
  });
  const [isChallengeOver, setIsChallengeOver] = useState(false); // Track if the challenge is over

  // Handle element clicks
  const handleElementClick = (event) => {
    if (isChallengeOver) return; // Prevent interactions if challenge is over

    const targetId = event.target.id;

    if (!questions[targetId]) {
      console.log(`No question available for: ${targetId}`);
      return;
    }

    if (answeredQuestions.includes(targetId)) {
      console.log(`Question already answered for: ${targetId}`);
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { question, options, context, correctAnswer } = questions[targetId];
    setPopup({
      visible: true,
      bodyPart: targetId,
      question,
      options,
      context,
      correctAnswer,
      x,
      y,
    });
  };

  // Handle answer clicks
  const handleAnswerClick = (option) => {
    const correctAnswer = popup.correctAnswer;
    const isCorrect = option === correctAnswer;

    setAnsweredQuestions((prev) => [...prev, popup.bodyPart]); // Mark question as answered

    // Update statistics
    setStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    // Update health for incorrect answers
    if (!isCorrect) {
      setHealth((prevHealth) => Math.max(prevHealth - 10, 0));
    }

    setPopup({ ...popup, visible: false });

    // Check if challenge is over (either all questions answered or health is 0)
    if (answeredQuestions.length + 1 === Object.keys(questions).length || health <= 0) {
      setIsChallengeOver(true);
    }
  };

  // Restart the challenge
  const restartChallenge = () => {
    setHealth(100); // Reset health
    setAnsweredQuestions([]); // Reset answered questions
    setStats({ correct: 0, incorrect: 0 }); // Reset statistics
    setPopup({ ...popup, visible: false }); // Close popup
    setIsChallengeOver(false); // Allow interactions again
  };

  useEffect(() => {
    const svgElement = svgRef.current;

    if (svgElement) {
      const paths = svgElement.querySelectorAll("path, polyline, polygon");
      paths.forEach((path) => {
        path.addEventListener("click", handleElementClick);
      });

      return () => {
        paths.forEach((path) => {
          path.removeEventListener("click", handleElementClick);
        });
      };
    }
  }, []);

  return (
    <div
      style={{
        position: "relative",
        backgroundImage: 'url("../assets/ocean-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Roboto', sans-serif",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      {/* Audio Background */}
      <AudioBackground />

      {/* Statistics Banner */}
      {isChallengeOver && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            backgroundColor: "#4CAF50",
            color: "#fff",
            textAlign: "center",
            padding: "15px 0",
            zIndex: 1000,
          }}
        >
          <h2>Résumé de votre journée éducative</h2>
          <p>Questions correctes : {stats.correct}</p>
          <p>Questions incorrectes : {stats.incorrect}</p>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              color: "#4CAF50",
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={restartChallenge}
          >
            Recommencer le défi
          </button>
        </div>
      )}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#fff",
        }}
      >
        Corps Humain Interactif
      </h1>

      {/* Health Bar */}
      <HealthBar health={health} />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Santé : {health}%</p>

      {/* Human Body SVG */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <HumanBody
          ref={svgRef}
          style={{
            width: "85%",
            maxWidth: "450px",
            height: "auto",
            pointerEvents: isChallengeOver ? "none" : "auto", // Disable SVG interaction if challenge is over
          }}
        />
      </div>

      {/* Popup */}
      {popup.visible && <Popup popup={popup} handleAnswerClick={handleAnswerClick} />}
    </div>
  );
};

export default HumanBodyComponent;
