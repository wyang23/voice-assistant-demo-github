// File: src/components/AdaptiveCard.jsx
"use client";

import { useState } from 'react';
import styles from './AdaptiveCard.module.css';

const AdaptiveCard = ({ cardData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle different card types
  const renderCard = () => {
    switch (cardData.type) {
      case 'info':
        return renderInfoCard();
      case 'action':
        return renderActionCard();
      case 'gallery':
        return renderGalleryCard();
      case 'chart':
        return renderChartCard();
      case 'form':
        return renderFormCard();
      default:
        return renderDefaultCard();
    }
  };

  // Basic info card with title and description
  const renderInfoCard = () => (
    <div className={`${styles.card} ${styles.infoCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title}</h3>
      {cardData.imageUrl && (
        <div className={styles.cardImageContainer}>
          <img src={cardData.imageUrl} alt={cardData.title} className={styles.cardImage} />
        </div>
      )}
      <p className={styles.cardDescription}>{cardData.description}</p>
      {cardData.data && cardData.data.details && (
        <>
          <button 
            className={styles.expandButton} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
          {isExpanded && (
            <div className={styles.expandedContent}>
              <p>{cardData.data.details}</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Action card with buttons
  const renderActionCard = () => (
    <div className={`${styles.card} ${styles.actionCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title}</h3>
      <p className={styles.cardDescription}>{cardData.description}</p>
      <div className={styles.actionButtons}>
        {cardData.actions && cardData.actions.map((action, index) => (
          <button 
            key={index} 
            className={styles.actionButton}
            onClick={() => handleAction(action)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Gallery card to show multiple images
  const renderGalleryCard = () => (
    <div className={`${styles.card} ${styles.galleryCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title}</h3>
      <div className={styles.galleryGrid}>
        {cardData.data && cardData.data.images && cardData.data.images.map((image, index) => (
          <div key={index} className={styles.galleryItem}>
            <img src={image.url} alt={image.alt || `Gallery image ${index}`} className={styles.galleryImage} />
            {image.caption && <p className={styles.imageCaption}>{image.caption}</p>}
          </div>
        ))}
      </div>
      {cardData.description && <p className={styles.cardDescription}>{cardData.description}</p>}
    </div>
  );

  // Chart card for data visualization
  const renderChartCard = () => (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title}</h3>
      <div className={styles.chartContainer}>
        {/* We would insert a chart library here like Chart.js or D3 */}
        <div className={styles.chartPlaceholder}>
          {/* Chart would be rendered here using the data */}
          <p>Chart visualization would appear here</p>
          {/* This is just a placeholder, you would use actual chart component */}
        </div>
      </div>
      {cardData.description && <p className={styles.cardDescription}>{cardData.description}</p>}
    </div>
  );

  // Form card for user input
  const renderFormCard = () => (
    <div className={`${styles.card} ${styles.formCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title}</h3>
      {cardData.description && <p className={styles.cardDescription}>{cardData.description}</p>}
      <form className={styles.form} onSubmit={handleFormSubmit}>
        {cardData.data && cardData.data.fields && cardData.data.fields.map((field, index) => (
          <div key={index} className={styles.formField}>
            <label htmlFor={`field-${index}`} className={styles.fieldLabel}>{field.label}</label>
            {field.type === 'text' && (
              <input 
                id={`field-${index}`}
                type="text" 
                placeholder={field.placeholder || ''}
                className={styles.textInput}
                required={field.required}
              />
            )}
            {field.type === 'textarea' && (
              <textarea 
                id={`field-${index}`}
                placeholder={field.placeholder || ''}
                className={styles.textareaInput}
                required={field.required}
                rows={4}
              />
            )}
            {field.type === 'select' && (
              <select 
                id={`field-${index}`}
                className={styles.selectInput}
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options && field.options.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>{option.label}</option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          {cardData.data && cardData.data.submitLabel ? cardData.data.submitLabel : 'Submit'}
        </button>
      </form>
    </div>
  );

  // Default card for any other type
  const renderDefaultCard = () => (
    <div className={`${styles.card} ${styles.defaultCard}`}>
      <h3 className={styles.cardTitle}>{cardData.title || 'Information'}</h3>
      <p className={styles.cardDescription}>{cardData.description || 'No description provided.'}</p>
    </div>
  );

  // Handle action button clicks
  const handleAction = (action) => {
    console.log('Action clicked:', action);
    // Implement action handling logic here
    // This could include:
    // - Triggering a new API call
    // - Updating application state
    // - Navigating to a new page
    // - Opening a modal
  };

  // Handle form submissions
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    
    console.log('Form submitted:', formValues);
    // Implement form submission logic here
    // - Send data to backend
    // - Update state based on response
  };

  return renderCard();
};

export default AdaptiveCard;