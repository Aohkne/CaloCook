// ChatBotModal.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, SendHorizonal } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { REACT_NATIVE_APP_API_KEY, REACT_NATIVE_APP_MODEL, REACT_NATIVE_APP_PROMPT } from '@env';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(REACT_NATIVE_APP_API_KEY);
const prompt = REACT_NATIVE_APP_PROMPT;

import { useTheme } from '@contexts/ThemeProvider';

export default function ChatBotModal({ visible, onClose }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi, I'm Calo bot. How can I help you?" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const typingSpeed = 15;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: REACT_NATIVE_APP_MODEL
      });

      const result = await model.generateContent(prompt + input);
      const response = await result.response;
      const text = await response.text();

      setCurrentTypingMessage({ from: 'bot', text });
      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      const errorText =
        'Xin lỗi, hôm nay hoạt động hơi nhiều nên có thể tôi đã bị lỗi, bạn có thể quay lại lúc sau khi tui khoẻ lại nha!';

      setCurrentTypingMessage({ from: 'bot', text: errorText });
      setDisplayedText('');
      setCurrentCharIndex(0);
      setTyping(true);
      setLoading(false);
    }
  };

  // Typing effect
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

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, typing, displayedText]);

  return (
    <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={onClose}>
      <BlurView style={styles.blurBackground} intensity={15} tint='dark'>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Calo Bot</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={30} color={colors.secondary} strokeWidth={3} />
              </TouchableOpacity>
            </View>

            {/* MESSAGES */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg, idx) => (
                <View key={idx} style={[styles.message, msg.from === 'user' ? styles.userMessage : styles.botMessage]}>
                  {msg.from === 'bot' && (
                    <Image source={require('@assets/chat/icon_Bot.png')} style={styles.botImage} />
                  )}
                  <Text style={msg.from === 'user' ? styles.userText : styles.botText}>{msg.text}</Text>
                </View>
              ))}

              {typing && currentTypingMessage && (
                <View style={[styles.message, styles.botMessage]}>
                  <Image source={require('@assets/chat/icon_Bot.png')} style={styles.botImage} />
                  <Text style={styles.botText}>{displayedText}</Text>
                </View>
              )}
            </ScrollView>

            {/* Loading */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='small' color={colors.primary} />
                <Text style={styles.loadingText}>...</Text>
              </View>
            )}

            {/* INPUT */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
                placeholder='Ask something'
                placeholderTextColor={colors.description}
                multiline
                maxLength={500}
                editable={!typing && !loading}
                onSubmitEditing={handleSend}
                returnKeyType='send'
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                disabled={typing || loading || !input.trim()}
              >
                <SendHorizonal size={25} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    blurBackground: {
      flex: 1
    },
    keyboardAvoidingView: {
      flex: 1
    },
    container: {
      flex: 1,
      marginTop: 100,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      borderColor: colors.black,
      backgroundColor: colors.background + '80'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16
    },
    title: {
      fontSize: 30,
      letterSpacing: 2,
      fontWeight: 'bold',
      color: colors.secondary,

      shadowColor: colors.white,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 0,
      elevation: 8
    },
    messagesContainer: {
      flex: 1
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 20
    },
    message: {
      marginVertical: 4,
      maxWidth: '90%',
      padding: 12,
      borderRadius: 12
    },

    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colors.secondary
    },
    userText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.white,

      shadowColor: colors.black,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 0,
      elevation: 8
    },

    botMessage: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      backgroundColor: 'transparent'
    },
    botImage: {
      width: 40,
      height: 30
    },
    botText: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 22,
      marginLeft: 10,
      marginVertical: 'auto',
      color: colors.secondary,

      shadowColor: colors.white,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 0,
      elevation: 8
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12
    },
    loadingText: {
      marginLeft: 8,
      color: colors.primary,
      fontSize: 14
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: colors.background,
      borderTopWidth: 1
    },
    textInput: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 12,
      marginRight: 12,
      fontSize: 16,
      color: colors.title,
      backgroundColor: 'transparent',
      maxHeight: 100
    },
    sendButton: {
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
