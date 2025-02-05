// client/src/components/ChatInterface/ChatInterface.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./ChatInterface.module.css";
import CampaignPreviewModal from "../CampaignPreviewModal/CampaignPreviewModal";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  // Predefined conversation flow
  const conversationFlow = [
    { id: 1, question: "What's your business niche or industry?" },
    { id: 2, question: "Describe your target audience in detail:" },
    { id: 3, question: "What's your daily advertising budget (USD)?" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  // Auto-scroll to bottom
  useEffect(() => chatEndRef.current?.scrollIntoView(), [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { text: input, isBot: false };

      // Update messages
      setMessages((prev) => [...prev, userMessage]);

      // API call
      const response = await axios.post("/api/chat", {
        step: currentStep,
        answer: input.trim(),
      });

      // Handle final step
      if (currentStep === conversationFlow.length - 1) {
        const campaign = await axios.post("/api/campaigns", {
          answers: [input],
        });
        setCampaignData(campaign.data);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: response.data.nextQuestion, isBot: true },
        ]);
        setCurrentStep((prev) => prev + 1);
      }
    } catch (err) {
      setError("Failed to process request. Please try again.");
      console.error("API Error:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.isBot ? styles.bot : styles.user
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      {campaignData && (
        <CampaignPreviewModal
          data={campaignData}
          onClose={() => setCampaignData(null)}
          onConfirm={handleCampaignLaunch}
        />
      )}
    </div>
  );
};

export default ChatInterface;
