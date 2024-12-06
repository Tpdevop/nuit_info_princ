const HealthBar = ({ health }) => {
    // Determine color based on health thresholds
    let healthColor;
    if (health > 70) {
      healthColor = "#4CAF50"; // Green for health above 70%
    } else if (health > 50) {
      healthColor = "#FFEB3B"; // Orange for health between 51% and 70%
    } else if (health > 30) {
      healthColor = "#FF9800"; // Yellow for health between 31% and 50%
    } else {
      healthColor = "#F44336"; // Red for health below 30%
    }
  
    const textColor = health < 30 ? "#fff" : "#000"; // Text color for low health (white text for red bar)
  
    return (
      <div
        style={{
          margin: "20px auto",
          width: "80%",
          maxWidth: "600px",
          background: "linear-gradient(to right, #e1e1e1, #f8f8f8)",
          borderRadius: "15px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          padding: "5px",
          height: "30px",
        }}
      >
        <div
          style={{
            width: `${health}%`,
            height: "100%",
            backgroundColor: healthColor,
            borderRadius: "10px",
            textAlign: "center",
            lineHeight: "30px",
            color: textColor,
            fontWeight: "bold",
            fontSize: "16px",
            transition: "width 0.5s ease-out, background-color 0.3s ease-in-out",
            boxSizing: "border-box",
          }}
        >
          {health}% {/* Display health percentage in the bar */}
        </div>
      </div>
    );
  };
  
  export default HealthBar;
  