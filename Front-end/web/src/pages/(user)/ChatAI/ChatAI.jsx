import { Icon } from '@iconify/react';
import { useEffect, useState, useRef } from 'react';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import Navbar from '@/components/ui/Navbar/Navbar';

import styles from './ChatAI.module.scss';
import classNames from 'classnames/bind';

// Cấu hình API - thay thế bằng API key thực tế
const API_KEY = import.meta.env.VITE_API_KEY;
const MODEL = import.meta.env.VITE_MODEL || '';
const PROMPT = import.meta.env.VITE_PROMPT || '';

const cx = classNames.bind(styles);

function ChatAI() {
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi, I'm Calo bot. How can I help you?" }]);
  const [input, setInput] = useState('');

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

  // CALL API
  const callGeminiAPI = async (message, imageData = null) => {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(API_KEY);

      let model;
      let content;

      if (imageData) {
        // CHOOSE MODEL: 'gemini-pro-vision'
        model = genAI.getGenerativeModel({ model: MODEL });
        content = [
          PROMPT + message,
          {
            inlineData: {
              data: imageData.split(',')[1],
              mimeType: 'image/jpeg'
            }
          }
        ];
      } else {
        // CHOOSE MODEL: 'gemini-pro-vision' $$$
        model = genAI.getGenerativeModel({ model: MODEL });
        content = PROMPT + message;
      }

      const result = await model.generateContent(content);
      const response = await result.response;
      return await response.text();
    } catch (error) {
      console.error('API Error:', error);
      return "Sorry, I've been a bit busy today so I might have made a mistake, you can come back later when I'm better!";
    }
  };

  // HANLE SEND
  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    // CREATE USER MESSAGE
    const userMessage = {
      from: 'user',
      text: input,
      image: imagePreview
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const responseText = await callGeminiAPI(input, selectedImage);

      setCurrentTypingMessage({ from: 'bot', text: responseText });
      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    } catch (error) {
      const errorText =
        'Xin lỗi, hôm nay hoạt động hơi nhiều nên có thể tôi đã bị lỗi, bạn có thể quay lại lúc sau khi tui khoẻ lại nha!';

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
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
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

  // HANDLE DRAG & DROP
  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   // CHECK DRAGGED CONTAIN: images
  //   const items = e.dataTransfer.items;
  //   let hasImage = false;

  //   if (items) {
  //     for (let i = 0; i < items.length; i++) {
  //       if (items[i].type.startsWith('image/')) {
  //         hasImage = true;
  //         break;
  //       }
  //     }
  //   }

  //   if (hasImage) {
  //     setIsDragOver(true);
  //   }
  // };

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
      utterance.lang = 'vi-VN'; //vi-VN
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  // MAKE MESSAGE TO URLs clickable
  const makeLinksClickable = (text) => {
    const urlRegex =
      /(https?:\/\/[^\s]+)|(\b(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/g;

    return text.replace(urlRegex, (url) => {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      return `[${url}](${fullUrl})`;
    });
  };

  // ANIMATION: animation
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
      className={cx('wrapper', { 'drag-over': isDragOver })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Navbar />

      {/* CHAT */}
      <div className={cx('chat-container')}>
        {messages.map((msg, idx) => (
          <div key={idx} className={cx('messages-container')}>
            {msg.from === 'bot' && <img src='/images/icon_Bot.png' alt='bot' />}
            <div className={cx('messages')}>
              <div className={cx('messages-content', msg.from)}>
                {msg.from === 'user' ? (
                  <>
                    {msg.image && <img src={msg.image} alt='Uploaded' className={cx('message-image')} />}
                    {msg.text}
                  </>
                ) : (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
                    }}
                  >
                    {makeLinksClickable(msg.text)}
                  </ReactMarkdown>
                )}
              </div>

              <div className={cx('action', msg.from)}>
                <div className={cx('item')} onClick={() => copyToClipboard(msg.text)} title='Copy'>
                  <Icon icon='tabler:copy' width='20' height='20' />
                </div>
                {msg.from === 'bot' && (
                  <div className={cx('item')} onClick={() => speakText(msg.text)} title='Read aloud'>
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
            <img src='/images/icon_Bot.png' alt='bot' />
            <div className={cx('messages')}>
              <div className={cx('messages-content', 'bot')}>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />
                  }}
                >
                  {makeLinksClickable(displayedText)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* DRAG MODEL */}
      {isDragOver && (
        <div className={cx('drag-modal')}>
          <div className={cx('drag-modal-overlay')}>
            <div className={cx('drag-modal-content')}>
              <Icon icon='material-symbols:cloud-upload-outline' width='64' height='64' />
              <h3>Drop images here</h3>
              <p>Supported formats: JPG, PNG, GIF, WebP</p>
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
              <img src={imagePreview} alt='Preview' />
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
          <button onClick={() => fileInputRef.current?.click()} disabled={loading || typing} title='Add image'>
            <Icon icon='uil:plus' width='24' height='24' />
          </button>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask something...'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !typing && !loading) {
                handleSend();
              }
            }}
            disabled={typing || loading}
          />
          <button
            onClick={handleSend}
            disabled={typing || loading || (!input.trim() && !selectedImage)}
            title='Send message'
          >
            <Icon icon='mingcute:send-fill' width='24' height='24' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatAI;
