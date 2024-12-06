import { useState, useRef, useEffect } from "react";
import { ReactComponent as HumanBody } from "../assets/hbRenewedAgain.svg";
import questions from "../assets/questions.json";
import AudioBackground from "./AudioBackground";
import HealthBar from "./HealthBar";
import Popup from "./Popup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HumanBodyComponent = () => {
  const svgRef = useRef(null);
  const [health, setHealth] = useState(100);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [popup, setPopup] = useState({
    visible: false,
    bodyPart: "",
    question: "",
    options: [],
    context: "",
    correctAnswer: "",
    x: 0,
    y: 0,
  });
  const [isChallengeOver, setIsChallengeOver] = useState(false);

  // Show toast notifications
  const showToast = (isCorrect) => {
    if (isCorrect) {
      toast.success("✅ Correct answer! Well done!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else {
      toast.error("❌ Mauvaise réponse !", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  // Handle element click to open popup
  const handleElementClick = (event) => {
    if (isChallengeOver) return;

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

  // Handle the answer click in popup
  const handleAnswerClick = (option) => {
    const correctAnswer = popup.correctAnswer;
    const isCorrect = option === correctAnswer;

    // Show toast for feedback
    showToast(isCorrect);

    setAnsweredQuestions((prev) => [...prev, popup.bodyPart]);

    setStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
    }));

    if (!isCorrect) {
      setHealth((prevHealth) => Math.max(prevHealth - 10, 0)); // Reduce health on incorrect answer
    }

    // Close popup after answering
    setPopup({ ...popup, visible: false });

    if (answeredQuestions.length + 1 === Object.keys(questions).length || health <= 0) {
      setIsChallengeOver(true); // End challenge if health reaches 0 or all questions answered
    }
  };

  // Handle clicks outside the popup to close it
  const handleBackgroundClick = (e) => {
    if (popup.visible && !svgRef.current.contains(e.target) && !e.target.closest('.popup')) {
      setPopup({ ...popup, visible: false });
    }
  };

  // Restart the challenge
  const restartChallenge = () => {
    setHealth(100);
    setAnsweredQuestions([]);
    setStats({ correct: 0, incorrect: 0 });
    setPopup({ ...popup, visible: false });
    setIsChallengeOver(false);
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

    document.addEventListener("click", handleBackgroundClick);

    return () => {
      document.removeEventListener("click", handleBackgroundClick);
    };
  }, [popup]);

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
      {/* Weather Button */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <a
          href="https://stellular-moxie-560bbe.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              backgroundColor: "#007BFF",
              border: "2px solid #0056b3",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease, background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            Vérifier le Météo
          </button>
        </a>
      </div>

      {/* Toastify Container */}
      <ToastContainer /> 

      {/* Audio Background */}
      <AudioBackground />

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
      <h3> Cliquez Sur Les Organes Du Corps!</h3>

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
            pointerEvents: isChallengeOver ? "none" : "auto",
          }}
        />
      </div>

      {/* Popup */}
      {popup.visible && <Popup popup={popup} handleAnswerClick={handleAnswerClick} />}
    </div>
  );
};

export default HumanBodyComponent;
