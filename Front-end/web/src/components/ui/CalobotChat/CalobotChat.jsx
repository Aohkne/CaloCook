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

  // CALL API to analyze image
  const callCalobotAPI = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append('file', imageData);
      const response = await analyzeImage(formData);
      console.log(response);

      //   return response.data.analysis || response.data.message || 'Image analyzed successfully!';
    } catch (error) {
      console.error('API Error:', error);
      return "Sorry, I couldn't analyze this image. Please try again with a clearer food image!";
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
      const responseText = await callCalobotAPI(selectedImage);

      setCurrentTypingMessage({ from: 'bot', text: responseText });
      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    } catch (error) {
      const errorText = 'Sorry, I encountered an error analyzing your image. Please try again later!';

      setCurrentTypingMessage({ from: 'bot', text: errorText });
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
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
    if (typing && currentTypingMessage && currentCharIndex < currentTypingMessage.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + currentTypingMessage.text[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (typing && currentTypingMessage && currentCharIndex >= currentTypingMessage.text.length) {
      setMessages((prev) => [...prev, currentTypingMessage]);
      setCurrentTypingMessage(null);
      setTyping(false);
    }
  }, [typing, currentTypingMessage, currentCharIndex, typingSpeed]);

  // ANIMATION: auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, displayedText]);

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
              <div className={cx('messages-content', msg.from)}>
                {msg.from === 'user' ? (
                  <>
                    {msg.image && <img src={msg.image} alt='Food to analyze' className={cx('message-image')} />}
                    {msg.text}
                  </>
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>

              <div className={cx('action', msg.from)}>
                <div className={cx('item')} onClick={() => copyToClipboard(msg.text)} title='Copy'>
                  <Icon icon='tabler:copy' width='20' height='20' />
                </div>
                {msg.from === 'bot' && (
                  <div className={cx('item')} onClick={() => speakText(msg.text)} title='Read'>
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
              <div className={cx('messages-content', 'bot')}>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
                  }}
                >
                  {displayedText}
                </ReactMarkdown>
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
