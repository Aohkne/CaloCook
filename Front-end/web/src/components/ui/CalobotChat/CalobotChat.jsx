import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { models } from '@/data/models';
import { analyzeImage } from '@/api/model';

import ModelCard from '@/components/ui/ModelCard/ModelCard';

import styles from './CalobotChat.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CalobotChat({ model, handleModelSelect }) {
  const [selectedModel] = useState(model);

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi, I'm Calobot! Please upload an image of your food and I'll analyze its nutritional content for you."
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingSpeed = 30;

  // Format analysis response into readable text
  const formatAnalysisResponse = (data) => {
    if (!data.success) {
      return {
        type: 'error',
        text: data.message || "Sorry, I couldn't analyze this image. Please try again!",
        suggestion: data.suggestion || null
      };
    }

    const { food_detected, description, nutrition_info, recommendations, ai_analysis } = data;

    return {
      type: 'analysis',
      data: {
        foodName: food_detected?.display_name || food_detected?.name || 'Unknown Food',
        confidence: food_detected?.confidence_percentage || 0,
        description: description || 'No description available',
        nutrition: {
          caloriesPer100g: nutrition_info?.calories_per_100g || 0,
          typicalPortion: nutrition_info?.typical_portion_g || 0,
          estimatedCalories: nutrition_info?.estimated_calories || 0
        },
        recommendations: {
          portionNote: recommendations?.portion_note || '',
          calorieNote: recommendations?.calorie_note || '',
          healthTip: recommendations?.health_tip || ''
        },
        aiAnalysis: {
          detectionConfidence: ai_analysis?.detection_confidence || 0,
          status: ai_analysis?.processing_status || 'Unknown'
        }
      }
    };
  };

  // CALL API to analyze image
  const callCalobotAPI = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('file', imageData);

      const response = await analyzeImage(formData);

      return formatAnalysisResponse(response.data || response);
    } catch (error) {
      console.error('API Error:', error);
      return {
        type: 'error',
        text: "Sorry, I couldn't analyze this image. Please try again with a clearer food image!"
      };
    }
  };

  // HANDLE SEND (only for images)
  const handleSend = async () => {
    if (!selectedImage) return;

    // CREATE USER MESSAGE with image
    const userMessage = {
      from: 'user',
      text: 'Please analyze this food image',
      image: imagePreview
    };

    setMessages((prev) => [...prev, userMessage]);
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const responseData = await callCalobotAPI(selectedImage);

      setCurrentTypingMessage({ from: 'bot', ...responseData });
      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    } catch (error) {
      const errorMessage = {
        type: 'error',
        text: 'Sorry, I encountered an error analyzing your image. Please try again later!'
      };

      setCurrentTypingMessage({ from: 'bot', ...errorMessage });
      console.error('Error: ', error);

      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    }
  };

  // HANDLE IMG UPLOAD
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      setSelectedImage(file);

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // REMOVE SELECTED IMAGE
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // DROP
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const file = files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // COPY
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // SPEECH
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  // ANIMATION: typing animation
  useEffect(() => {
    if (typing && currentTypingMessage && currentCharIndex < currentTypingMessage.text?.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentTypingMessage.text[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (typing && currentTypingMessage && currentCharIndex >= (currentTypingMessage.text?.length || 0)) {
      setMessages((prev) => [...prev, currentTypingMessage]);
      setCurrentTypingMessage(null);
      setTyping(false);
    }
  }, [typing, currentTypingMessage, currentCharIndex, typingSpeed]);

  // ANIMATION: auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, displayedText]);

  // RENDER: message content based on type
  const renderMessageContent = (msg) => {
    if (msg.from === 'user') {
      return (
        <>
          {msg.image && <img src={msg.image} alt='Food to analyze' className={cx('message-image')} />}
          {msg.text}
        </>
      );
    }

    if (msg.type === 'error') {
      return (
        <div className={cx('error-result')}>
          <Icon icon='material-symbols:error-outline' className={cx('error-icon')} />
          <div className={cx('error-message')}>
            <p>{msg.text}</p>
            {msg.suggestion && (
              <div className={cx('suggestion')}>
                <Icon icon='material-symbols:lightbulb-outline' />
                <span>{msg.suggestion}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (msg.type === 'analysis') {
      const { data } = msg;
      return (
        <div className={cx('analysis-result')}>
          <div className={cx('food-header')}>
            <Icon icon='material-symbols:restaurant' className={cx('food-icon')} />
            <h3 className={cx('food-name')}>{data.foodName}</h3>
            <div className={cx('confidence-badge')}>
              <Icon icon='material-symbols:verified' />
              <span>{data.confidence}% match</span>
            </div>
          </div>

          <div className={cx('description')}>
            <p>{data.description}</p>
          </div>

          <div className={cx('nutrition-grid')}>
            <div className={cx('nutrition-card')}>
              <Icon icon='material-symbols:local-fire-department' />
              <div className={cx('nutrition-info')}>
                <span className={cx('value')}>{data.nutrition.caloriesPer100g}</span>
                <span className={cx('unit')}>cal/100g</span>
              </div>
            </div>

            <div className={cx('nutrition-card')}>
              <Icon icon='material-symbols:scale' />
              <div className={cx('nutrition-info')}>
                <span className={cx('value')}>{data.nutrition.typicalPortion}</span>
                <span className={cx('unit')}>g portion</span>
              </div>
            </div>

            <div className={cx('nutrition-card', 'highlight')}>
              <Icon icon='material-symbols:calculate' />
              <div className={cx('nutrition-info')}>
                <span className={cx('value')}>{data.nutrition.estimatedCalories}</span>
                <span className={cx('unit')}>total calories</span>
              </div>
            </div>
          </div>

          {data.recommendations.healthTip && (
            <div className={cx('recommendations')}>
              <div className={cx('recommendation-item')}>
                <Icon icon='material-symbols:lightbulb' />
                <span>{data.recommendations.healthTip}</span>
              </div>
            </div>
          )}

          <div className={cx('analysis-meta')}>
            <span className={cx('detection-confidence')}>
              Detection: {data.aiAnalysis.detectionConfidence.toFixed(1)}%
            </span>
            <span className={cx('status')}>
              <Icon icon='material-symbols:check-circle' />
              {data.aiAnalysis.status}
            </span>
          </div>
        </div>
      );
    }

    // Default text message
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
        }}
      >
        {msg.text || ''}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={cx('calobot-chat', { 'drag-over': isDragOver })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* CHAT */}
      <div className={cx('chat-container')}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cx('messages-container')}>
            {msg.from === 'bot' && <img src='/images/icon_Bot.png' alt='calobot' />}
            <div className={cx('messages')}>
              <div className={cx('messages-content', msg.from, { analysis: msg.type === 'analysis' })}>
                {renderMessageContent(msg)}
              </div>

              <div className={cx('action', msg.from)}>
                <div
                  className={cx('item')}
                  onClick={() => copyToClipboard(msg.text || JSON.stringify(msg.data))}
                  title='Copy'
                >
                  <Icon icon='tabler:copy' width='20' height='20' />
                </div>
                {msg.from === 'bot' && (
                  <div
                    className={cx('item')}
                    onClick={() => speakText(msg.text || msg.data?.foodName || 'Analysis completed')}
                    title='Read'
                  >
                    <Icon icon='proicons:volume' width='24' height='24' />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && currentTypingMessage && (
          <div className={cx('messages-container')}>
            <img src='/images/icon_Bot.png' alt='calobot' />
            <div className={cx('messages')}>
              <div className={cx('messages-content', 'bot', { analysis: currentTypingMessage.type === 'analysis' })}>
                {currentTypingMessage.type === 'analysis' ? (
                  renderMessageContent(currentTypingMessage)
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* DRAG MODAL */}
      {isDragOver && (
        <div className={cx('drag-modal')}>
          <div className={cx('drag-modal-overlay')}>
            <div className={cx('drag-modal-content')}>
              <Icon icon='material-symbols:cloud-upload-outline' width='64' height='64' />
              <h3>Drop food images here</h3>
              <p>Supported formats: JPG, PNG, GIF, WebP</p>
              <p>I'll analyze the nutritional content!</p>
            </div>
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className={cx('input-container')}>
        {/* Image Preview */}
        {imagePreview && (
          <div className={cx('image-preview')}>
            <div className={cx('image-preview-container')}>
              <img src={imagePreview} alt='Food Preview' />
              <button className={cx('remove-image')} onClick={removeImage} title='Remove image'>
                <Icon icon='tabler:x' width='16' height='16' />
              </button>
            </div>
          </div>
        )}

        <div className={cx('input-box')}>
          <input
            type='file'
            ref={fileInputRef}
            accept='image/*'
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <button onClick={() => fileInputRef.current?.click()} disabled={loading || typing} title='Add food image'>
            <Icon icon='material-symbols:add-a-photo-outline' width='24' height='24' />
          </button>

          <div className={cx('upload-prompt')}>
            {!imagePreview ? (
              <span>Upload a food image to analyze nutritional content...</span>
            ) : (
              <span>Food image ready for analysis!</span>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={typing || loading || !selectedImage}
            title='Analyze food image'
            className={cx('analyze-btn', { 'has-image': !!selectedImage })}
          >
            {loading ? (
              <Icon icon='eos-icons:loading' width='24' height='24' />
            ) : (
              <Icon icon='material-symbols:analytics-outline' width='24' height='24' />
            )}
          </button>
        </div>

        {/* MODELS SELECTOR */}
        <div className={cx('model-container')}>
          {models.map((item) => (
            <ModelCard
              key={item.id}
              icon={item?.icon}
              image={item?.image}
              title={item.title}
              type={item.type}
              description={item.description}
              onClick={() => handleModelSelect(item.type)}
              isActive={selectedModel === item.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalobotChat;
