// client/src/components/CampaignPreviewModal/CampaignPreviewModal.jsx
import React from "react";
import styles from "./CampaignPreviewModal.module.css";

const CampaignPreviewModal = ({ data, onClose, onConfirm }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>Campaign Review</h2>
      <div className={styles.section}>
        <h3>Headlines</h3>
        <ul>
          {data.headlines.map((headline, index) => (
            <li key={index}>{headline}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Descriptions</h3>
        <ul>
          {data.descriptions.map((desc, index) => (
            <li key={index}>{desc}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h3>Keywords</h3>
        <div className={styles.keywordChips}>
          {data.keywords.map((keyword, index) => (
            <span key={index} className={styles.chip}>
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.modalActions}>
        <button onClick={onClose} className={styles.secondary}>
          Edit
        </button>
        <button onClick={onConfirm} className={styles.primary}>
          Confirm & Launch
        </button>
      </div>
    </div>
  </div>
);
