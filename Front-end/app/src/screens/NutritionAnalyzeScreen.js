import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { ChevronLeft, Camera, ImageIcon, RotateCcw, X, Zap } from 'lucide-react-native';

import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/contexts/ThemeProvider';

import { getStatus } from '@/services/model';
import { useDispatch, useSelector } from 'react-redux';
import { analyzeImage, addUserMessage, clearMessages, clearError } from '@/redux/slices/modelSlice';

export default function NutritionAnalyzeScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  // Redux state
  const { messages, isAnalyzing, error } = useSelector((state) => state.model);

  // Local state
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Refs
  const scrollViewRef = useRef(null);

  // Effects
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Functions
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // IMAGE SELECTION
  const selectImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false
      });

      setShowImageOptions(false);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.fileName || 'image.jpg'
        });
      }
    } catch (error) {
      setShowImageOptions(false);
      Alert.alert('Error', 'Failed to select image from gallery');
      console.error('Gallery selection error:', error);
    }
  };

  const selectImageFromCamera = async () => {
    try {
      // REQUEST: camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        setShowImageOptions(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });

      setShowImageOptions(false);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.fileName || 'camera_image.jpg'
        });
      }
    } catch (error) {
      setShowImageOptions(false);
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera capture error:', error);
    }
  };

  // ANALYZE IMAGE
  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    // Add user message
    dispatch(
      addUserMessage({
        text: 'Please analyze this food image',
        image: selectedImage.uri
      })
    );

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.name || 'photo.jpg'
      });

      // console.log('FormData parts:', JSON.stringify(formData._parts, null, 2));

      // Call API
      await getStatus();
      await dispatch(analyzeImage(formData)).unwrap();

      // Clear selected image
      setSelectedImage(null);
    } catch (error) {
      console.error('Analysis error:', error);
      setSelectedImage(null);
    }
  };

  // REMOVE IMAGE
  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // CLEAR CHAT
  const handleClearChat = () => {
    Alert.alert('Clear Chat', 'Are you sure you want to clear all messages?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          dispatch(clearMessages());
          setSelectedImage(null);
        }
      }
    ]);
  };

  // RENDER MESSAGE CONTENT
  const renderMessageContent = (msg) => {
    if (msg.from === 'user') {
      return (
        <View style={styles.userMessageContent}>
          {msg.image && <Image source={{ uri: msg.image }} style={styles.messageImage} />}
          <Text style={styles.userText}>{msg.text}</Text>
        </View>
      );
    }

    if (msg.type === 'error') {
      return (
        <View style={styles.errorResult}>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>{msg.text}</Text>
            {msg.suggestion && (
              <View style={styles.suggestion}>
                <Text style={styles.suggestionText}>{msg.suggestion}</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (msg.type === 'analysis' && msg.data) {
      const { data } = msg;
      return (
        <View style={styles.analysisResult}>
          {/* Food Header */}
          <View style={styles.foodHeader}>
            <Text style={styles.foodName}>{data.foodName}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{data.confidence}% match</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{data.description}</Text>

          {/* Nutrition Grid */}
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Calories/100g</Text>
              <Text style={styles.nutritionValue}>{data.nutrition.caloriesPer100g}</Text>
            </View>

            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionLabel}>Typical Portion</Text>
              <Text style={styles.nutritionValue}>{data.nutrition.typicalPortion}g</Text>
            </View>

            <View style={[styles.nutritionCard, styles.highlightCard]}>
              <Text style={[styles.nutritionLabel, styles.highlightText]}>Total Calories</Text>
              <Text style={[styles.nutritionValue, styles.highlightText]}>{data.nutrition.estimatedCalories}</Text>
            </View>
          </View>

          {/* Health Tip */}
          {data.recommendations.healthTip && (
            <View style={styles.healthTip}>
              <Text style={styles.healthTipText}>{data.recommendations.healthTip}</Text>
            </View>
          )}

          {/* Analysis Meta */}
          <View style={styles.analysisMeta}>
            <Text style={styles.detectionText}>Detection: {data.aiAnalysis.detectionConfidence.toFixed(1)}%</Text>
            <Text style={styles.statusText}>{data.aiAnalysis.status}</Text>
          </View>
        </View>
      );
    }

    // Default text message
    return <Text style={styles.botText}>{msg.text}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft size={24} color={colors.title} />
          </TouchableOpacity>

          <Text style={styles.title}>Calobot</Text>

          <TouchableOpacity style={styles.clearButton} onPress={handleClearChat}>
            <RotateCcw size={20} color={colors.title} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.from === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
              ]}
            >
              {/* Bot Avatar */}
              {message.from === 'bot' && (
                <View style={styles.botAvatar}>
                  <Zap size={16} color={colors.secondary} />
                </View>
              )}

              {/* Message Content */}
              <View
                style={[
                  styles.messageContainer,
                  message.from === 'user' ? styles.userMessage : styles.botMessage,
                  message.type === 'analysis' && styles.analysisMessage
                ]}
              >
                {renderMessageContent(message)}
              </View>
            </View>
          ))}

          {/* Loading Indicator */}
          {isAnalyzing && (
            <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
              <View style={styles.botAvatar}>
                <ActivityIndicator size='small' color={colors.secondary} />
              </View>
              <View style={[styles.messageContainer, styles.botMessage]}>
                <Text style={styles.botText}>Analyzing your food image...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeSelectedImage}>
              <X size={16} color={colors.titleWithBg} />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => setShowImageOptions(true)}
              disabled={isAnalyzing}
            >
              <ImageIcon size={24} color={colors.secondary} />
            </TouchableOpacity>

            <View style={styles.uploadPrompt}>
              <Text style={styles.promptText}>
                {!selectedImage
                  ? 'Upload a food image to analyze nutritional content...'
                  : 'Food image ready for analysis!'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.analyzeButton, selectedImage && !isAnalyzing && styles.analyzeButtonActive]}
              onPress={handleAnalyzeImage}
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size='small' color={colors.titleWithBg} />
              ) : (
                <Zap size={20} color={selectedImage ? colors.tertiary : colors.border} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Image Options Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType='slide'
        onRequestClose={() => setShowImageOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.modalTitle}>Select Action</Text>

            <TouchableOpacity style={styles.optionButton} onPress={selectImageFromCamera}>
              <Camera size={24} color={colors.title} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={selectImageFromGallery}>
              <ImageIcon size={24} color={colors.title} />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => setShowImageOptions(false)}
            >
              <X size={24} color={colors.red} />
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border
    },
    backButton: {
      padding: 8
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: colors.title,
      fontSize: 20,
      fontWeight: '600',
      marginHorizontal: 16
    },
    clearButton: {
      padding: 8
    },

    // Messages
    messagesContainer: {
      flex: 1
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 20
    },
    messageWrapper: {
      flexDirection: 'row',
      marginVertical: 8,
      alignItems: 'flex-start'
    },
    userMessageWrapper: {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse'
    },
    botMessageWrapper: {
      alignSelf: 'flex-start'
    },
    botAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8
    },
    messageContainer: {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12
    },
    userMessage: {
      backgroundColor: colors.tertiary,
      borderWidth: 1,
      borderColor: colors.shadow,
      marginRight: 8
    },
    botMessage: {
      backgroundColor: colors.backgroundSide,
      borderWidth: 1,
      borderColor: colors.shadow
    },
    analysisMessage: {
      maxWidth: '85%',
      padding: 16
    },

    // Message Content
    userMessageContent: {
      alignItems: 'center'
    },
    messageImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 8,
      resizeMode: 'cover'
    },
    userText: {
      fontSize: 16,
      color: colors.secondary,
      lineHeight: 20
    },
    botText: {
      fontSize: 16,
      color: colors.secondary,
      lineHeight: 20
    },

    // Error Result
    errorResult: {
      padding: 16,
      backgroundColor: colors.lightRed,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.red
    },
    errorContent: {
      alignItems: 'center'
    },
    errorText: {
      fontSize: 16,
      color: colors.red,
      textAlign: 'left',
      marginBottom: 8
    },
    suggestion: {
      padding: 8,
      backgroundColor: colors.lightYellow,
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: colors.yellow
    },
    suggestionText: {
      fontSize: 14,
      color: colors.yellow
    },

    // Analysis Result
    analysisResult: {
      width: '100%'
    },
    foodHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.shadow
    },
    foodName: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.secondary,
      flex: 1
    },
    confidenceBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.tertiary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.shadow
    },
    confidenceText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.secondary
    },
    description: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 20,
      marginBottom: 16,
      opacity: 0.8
    },
    nutritionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      gap: 8
    },
    nutritionCard: {
      flex: 1,
      minWidth: '30%',
      padding: 12,
      backgroundColor: colors.tertiary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.shadow,
      alignItems: 'center'
    },
    highlightCard: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary
    },
    nutritionLabel: {
      fontSize: 12,
      color: colors.secondary,
      marginBottom: 4,
      textAlign: 'center'
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.secondary,
      textAlign: 'center'
    },
    highlightText: {
      color: colors.titleWithBg
    },
    healthTip: {
      padding: 12,
      backgroundColor: colors.tertiary,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.secondary,
      marginBottom: 12
    },
    healthTipText: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 18
    },
    analysisMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.shadow
    },
    detectionText: {
      fontSize: 12,
      color: colors.secondary,
      opacity: 0.7
    },
    statusText: {
      fontSize: 12,
      color: colors.green,
      fontWeight: '500'
    },

    // Image Preview
    imagePreview: {
      margin: 16,
      position: 'relative',
      alignSelf: 'center'
    },
    previewImage: {
      width: 150,
      height: 100,
      borderRadius: 8,
      resizeMode: 'cover',
      borderWidth: 2,
      borderColor: colors.shadow
    },
    removeImageButton: {
      position: 'absolute',
      top: -5,
      right: -5,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.red,
      justifyContent: 'center',
      alignItems: 'center'
    },

    // Input Container
    inputContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.tertiary,
      borderRadius: 25,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.shadow
    },
    imageButton: {
      padding: 8,
      marginRight: 8
    },
    uploadPrompt: {
      flex: 1,
      paddingHorizontal: 8
    },
    promptText: {
      fontSize: 14,
      color: colors.secondary,
      opacity: 0.7,
      fontStyle: 'italic'
    },
    analyzeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.description
    },
    analyzeButtonActive: {
      backgroundColor: colors.secondary
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.backgroundSubside,
      justifyContent: 'flex-end'
    },
    optionsModal: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.title,
      textAlign: 'center',
      marginBottom: 20
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginVertical: 4,
      backgroundColor: colors.tertiary,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.shadow,
      shadowColor: colors.shadow,
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 10,
      shadowRadius: 0,
      elevation: 5
    },
    cancelButton: {
      backgroundColor: colors.lightRed,
      borderColor: colors.red,
      marginTop: 8
    },
    optionText: {
      marginLeft: 16,
      fontSize: 16,
      color: colors.title,
      fontWeight: '500'
    },
    cancelText: {
      color: colors.red
    }
  });
