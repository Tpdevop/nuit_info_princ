import React, { useState } from "react";

const Popup = ({ popup, handleAnswerClick }) => {
  const [feedback, setFeedback] = useState(null); // Feedback for correct/incorrect answer
  const [isAnswering, setIsAnswering] = useState(false); // Manage button states during answering
  const [feedbackColor, setFeedbackColor] = useState(""); // Feedback color (green/red)
  const [isPopupVisible, setIsPopupVisible] = useState(true); // Control popup visibility
  const [isExiting, setIsExiting] = useState(false); // Exit animation state

  // Handle the user's answer
  const handleAnswer = (option) => {
    setIsAnswering(true); // Start the answering process
    const correctAnswer = popup.correctAnswer; // Get the correct answer
    const isCorrect = option === correctAnswer;

    // Provide feedback (correct/incorrect)
    setFeedback(isCorrect ? "Bonne réponse !" : "Mauvaise réponse !");
    setFeedbackColor(isCorrect ? "#28a745" : "#dc3545"); // Feedback color

    // Wait for a bit before closing the popup
    setTimeout(() => {
      setIsAnswering(false); // Reset the answering state
      handleAnswerClick(option); // Call the parent function to handle the answer
    }, 1500); // Delay before closing the popup
  };

  // Close the popup with an animation
  const closePopup = () => {
    setIsExiting(true); // Trigger the exit animation
    setTimeout(() => {
      setIsPopupVisible(false); // Hide the popup after the animation
    }, 500); // Delay to let the animation finish
  };

  // Modify the body part names for better readability in French
  const modifiedPopup = {
    ...popup,
    bodyPart:
      popup.bodyPart === "LeftLung" || popup.bodyPart === "RightLung"
        ? "Les Poumons"
        : popup.bodyPart === "LeftKidney" || popup.bodyPart === "RightKidney"
        ? "Les Reins"
        : popup.bodyPart === "LeftEye" || popup.bodyPart === "RightEye"
        ? "Les Yeux"
        : popup.bodyPart === "Liver"
        ? "Le Foie"
        : popup.bodyPart === "Brain"
        ? "Le Cerveau"
        : popup.bodyPart === "Heart"
        ? "Le Cœur"
        : popup.bodyPart === "Intestine"
        ? "Les Intestins"
        : popup.bodyPart,
  };

  return (
    isPopupVisible && (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "10px", // Position to the left
          transform: "translateY(-50%)",
          backgroundColor: "#fff",
          borderRadius: "10px", // Reduced radius for a compact look
          padding: "15px", // Reduced padding for a smaller box
          zIndex: 1000,
          maxWidth: "300px", // Reduced max width
          width: "80%", // Adjusted width
          fontSize: "14px", // Smaller font size
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Lighter shadow
          animation: isExiting ? "fadeOut 0.5s ease" : "fadeIn 0.3s ease",
          opacity: isExiting ? 0 : 1,
        }}
      >
        {/* Close button */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            fontSize: "20px",
            color: "red",
          }}
          onClick={closePopup} // Close the popup when clicked
        >
          &times;
        </div>

        {/* Popup content */}
        <h3
          style={{
            textAlign: "center",
            marginBottom: "10px", // Reduced margin
            fontSize: "16px", // Smaller font size
            fontWeight: "600",
            color: "#333",
          }}
        >
          {`Partie : ${modifiedPopup.bodyPart}`}
        </h3>

        <p
          style={{
            marginBottom: "10px", // Reduced margin
            fontSize: "14px", // Smaller font size
            fontWeight: "500",
            color: "#666",
          }}
        >
          <strong>Contexte :</strong> {modifiedPopup.context}
        </p>

        <p
          style={{
            marginBottom: "15px", // Reduced margin
            fontSize: "14px", // Smaller font size
            lineHeight: "1.5",
            color: "#000",
          }}
        >
          {modifiedPopup.question}
        </p>

        {/* Display feedback */}
        {feedback && (
          <div
            style={{
              margin: "10px 0",
              color: feedbackColor,
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {feedback}
          </div>
        )}

        {/* Answer options */}
        {modifiedPopup.options.map((option, index) => (
          <button
            key={index}
            disabled={isAnswering} // Disable button while answering
            style={{
              display: "block",
              margin: "5px 0", // Reduced margin
              padding: "10px", // Reduced padding
              width: "100%",
              border: "1px solid #ddd", // Thinner border
              borderRadius: "8px", // Smaller border radius
              backgroundColor: isAnswering ? "#f0f0f0" : "#4CAF50",
              fontSize: "14px", // Smaller font size
              fontWeight: "500",
              cursor: "pointer",
              opacity: isAnswering ? 0.6 : 1,
              color: "#fff",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)", // Lighter shadow
            }}
            onClick={() => handleAnswer(option)} // Handle answer selection
          >
            {option}
          </button>
        ))}
      </div>
    )
  );
};

export default Popup;
