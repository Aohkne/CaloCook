import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import {
  ChevronLeft,
  Send,
  MoreHorizontal,
  Edit3,
  RotateCcw,
  Check,
  X,
  CircleCheck,
  CheckCheck,
  Eye
} from 'lucide-react-native';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserConversation,
  sendMessage,
  editMessage,
  deleteMessage,
  addTemporaryMessage,
  removeTemporaryMessage,
  clearError
} from '@/redux/slices/chatSlice';

import { useSocket } from '@/hooks/useSocket';
import { useTheme } from '@/contexts/ThemeProvider';

import { formatMessageTime, createTemporaryMessage, isUserMessage } from '@/utils/chatUtils';

export default function ChatScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  // Socket connection
  const { isConnected } = useSocket();

  // Redux state
  const { messages, userId, isLoading, error } = useSelector((state) => state.chat);

  // Local state
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [showActionModal, setShowActionModal] = useState(null);

  // Refs
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Effects
  useEffect(() => {
    dispatch(fetchUserConversation());
  }, [dispatch]);

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
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // SENT
  const handleSend = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    const tempMessage = createTemporaryMessage(messageContent, userId);

    dispatch(addTemporaryMessage(tempMessage));
    setInput('');

    try {
      await dispatch(sendMessage(messageContent)).unwrap();
      // Delete temporary message
      dispatch(removeTemporaryMessage(tempMessage._id));
    } catch (error) {
      // Delete temporary message
      dispatch(removeTemporaryMessage(tempMessage._id));
      setInput(messageContent);
      Alert.alert('Error', 'Unable to send the message. Please try again.');
    }
  };

  // UPDATE
  const handleStartEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingContent(message.content);
    setShowActionModal(null);
  };

  const handleSaveEdit = async () => {
    if (!editingContent.trim()) {
      handleCancelEdit();
      return;
    }

    try {
      await dispatch(
        editMessage({
          messageId: editingMessageId,
          content: editingContent.trim()
        })
      ).unwrap();

      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      Alert.alert('Error', 'Can not update message.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  // RECALL
  const handleRecallMessage = async (messageId) => {
    setShowActionModal(null);

    Alert.alert('Confirmation', 'Are you sure you want to recall this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Recall',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteMessage(messageId)).unwrap();
          } catch (error) {
            Alert.alert('Error', 'Unable to recall the message.');
          }
        }
      }
    ]);
  };

  const renderMessage = (message, index) => {
    const isUser = isUserMessage(message, userId);
    const isEditing = editingMessageId === message._id;
    const isLastMessage = index === messages.length - 1;

    return (
      <View key={message._id} style={[styles.message, isUser ? styles.userMessage : styles.adminMessage]}>
        {/* Time */}
        <Text style={styles.messageTime}>
          {formatMessageTime(message.isUpdated ? message.updatedAt : message.createdAt)}
          {message.isActive && message.isUpdated && <Text style={styles.editedLabel}> (edited)</Text>}
        </Text>

        {/* Message Content */}
        <View style={styles.messageContainer}>
          {isEditing ? (
            // Edit Mode
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editingContent}
                onChangeText={setEditingContent}
                multiline
                autoFocus
              />
              <View style={styles.editActions}>
                <TouchableOpacity style={[styles.editButton, styles.saveButton]} onPress={handleSaveEdit}>
                  <Check size={16} color={colors.green} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={handleCancelEdit}>
                  <X size={16} color={colors.red} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Normal Mode
            <>
              <View
                style={[
                  styles.messageContent,
                  !message.isActive && styles.recalledMessage,
                  message.isActive && isUser ? styles.messageUserContent : styles.messageAdminContent,
                  message.isTemporary && styles.temporaryMessage
                ]}
              >
                <Text style={[isUser ? styles.userText : styles.adminText, !message.isActive && styles.recalledText]}>
                  {!message.isActive ? 'This message has been taken off the menu' : message.content}
                </Text>
              </View>

              {/* Actions */}
              {message.isActive && isUser && !isEditing && (
                <TouchableOpacity style={styles.actionButton} onPress={() => setShowActionModal(message._id)}>
                  <MoreHorizontal size={16} color={colors.title} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Status */}
        {message.isTemporary && (
          <View style={styles.messageStatus}>
            <ActivityIndicator size='small' color={colors.secondary} />
          </View>
        )}

        {!message.isTemporary && isLastMessage && isUser && (
          <Text style={styles.messageStatus}>
            {message.status === 'sent' && <CircleCheck size={16} color={colors.secondary} />}
            {message.status === 'delivered' && <CheckCheck size={16} color={colors.secondary} />}
            {message.status === 'seen' && <Eye size={16} color={colors.secondary} />}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft size={24} color={colors.title} />
          </TouchableOpacity>

          <Text style={styles.title}>Chat</Text>

          {/* Connection Status */}
          <View style={[styles.connectionStatus, isConnected ? styles.connected : styles.disconnected]}>
            <Text style={styles.connectionText}>{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && messages.length === 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color={colors.secondary} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}

          {messages.map((message, index) => renderMessage(message, index))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder='Chat with admin...'
            placeholderTextColor={colors.secondary}
            multiline
            maxHeight={100}
            onFocus={scrollToBottom}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Send size={20} color={input.trim() ? colors.secondary : colors.titleWithBg} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Action Modal */}
      <Modal
        visible={showActionModal !== null}
        transparent
        animationType='fade'
        onRequestClose={() => setShowActionModal(null)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowActionModal(null)}>
          <View style={styles.actionModal}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                const message = messages.find((m) => m._id === showActionModal);
                if (message) handleStartEdit(message);
              }}
            >
              <Edit3 size={20} color={colors.title} />
              <Text style={styles.actionText}>Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => handleRecallMessage(showActionModal)}>
              <RotateCcw size={20} color={colors.title} />
              <Text style={styles.actionText}>Thu hồi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    connectionStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12
    },
    connected: {
      backgroundColor: colors.green + '20'
    },
    disconnected: {
      backgroundColor: colors.red + '20'
    },
    connectionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.title
    },

    // Loading
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50
    },
    loadingText: {
      marginTop: 12,
      color: colors.secondary,
      fontSize: 16
    },

    // Messages
    messagesContainer: {
      flex: 1
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 20
    },
    message: {
      marginVertical: 8
    },
    messageTime: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.secondary,
      marginBottom: 8
    },
    editedLabel: {
      fontSize: 12,
      color: colors.secondary,
      fontStyle: 'italic'
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end'
    },

    // Message Content
    messageContent: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.tertiary
    },
    messageAdminContent: {
      backgroundColor: 'transparent'
    },

    recalledMessage: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.shadow,
      borderStyle: 'dashed'
    },
    temporaryMessage: {
      opacity: 0.7
    },

    // Message Types
    userMessage: {
      alignItems: 'flex-end'
    },
    adminMessage: {
      alignItems: 'flex-start'
    },

    // Text Styles
    userText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.secondary
    },
    adminText: {
      fontSize: 16,
      lineHeight: 22,
      color: colors.secondary
    },
    recalledText: {
      color: colors.title,
      fontStyle: 'italic'
    },

    // Action Button
    actionButton: {
      marginLeft: 8,
      padding: 4,
      borderRadius: 12
    },

    // Message Status
    messageStatus: {
      marginTop: 4,
      fontSize: 12,
      color: colors.secondary,
      textAlign: 'right'
    },

    // Edit Mode
    editContainer: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.shadow,
      padding: 8
    },
    editInput: {
      minHeight: 40,
      fontSize: 16,
      color: colors.title,
      paddingHorizontal: 8,
      paddingVertical: 4
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
      gap: 8
    },
    editButton: {
      padding: 6,
      borderRadius: 6
    },
    saveButton: {
      backgroundColor: colors.lightGreen
    },
    cancelButton: {
      backgroundColor: colors.lightRed
    },

    // Input Container
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background
    },
    textInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      fontSize: 16,
      color: colors.title,
      backgroundColor: colors.tertiary,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 12,
      textAlignVertical: 'top'
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.tertiary,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sendButtonDisabled: {
      backgroundColor: colors.description
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.backgroundSide,
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionModal: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.shadow,
      borderRadius: 5,
      padding: 16,
      minWidth: 200,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 4,
        height: 4
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 5
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8
    },
    actionText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.title,
      fontWeight: '500'
    }
  });
