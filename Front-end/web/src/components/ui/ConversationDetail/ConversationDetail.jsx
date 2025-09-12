import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import { adminSentMessage, getDetailConversation, recallMessage, updateMessage } from '@/api/chat';

import { formatTime } from '@/utils/formatTimeMongo';
import { getCookie } from '@/utils/cookies';

// SOCKET
import { io } from 'socket.io-client';

import styles from './ConversationDetail.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ConversationDetail({ conversationId }) {
  const NODE_ENV = import.meta.env.NODE_ENV;

  const [conversationDetail, setConversationDetail] = useState();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState();
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom:  new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SOCKET CONNECT
  useEffect(() => {
    const token = getCookie('accessToken');

    if (!token) {
      return;
    }

    // Create socket connection
    const newSocket = io(NODE_ENV === 'production' ? 'https://calocook.onrender.com' : 'http://localhost:8080', {
      transports: ['websocket', 'polling'],
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    });

    // Connection event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected');
      // console.log('Socket connected:', newSocket.id);

      newSocket.emit('join_admin_room');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // MESSAGE EVENT: Real-time
    // NEW MESSAGE
    newSocket.on('new_message', (messageData) => {
      // console.log('New message received:', messageData);
      setMessages((prev) => [...prev, messageData]);
    });

    // SENT
    newSocket.on('message_sent', (messageData) => {
      // console.log('Message sent confirmation:', messageData);
      setMessages((prev) => {
        const exists = prev.find((msg) => msg._id === messageData._id);
        if (exists) {
          return prev.map((msg) => (msg._id === messageData._id ? { ...msg, status: messageData.status } : msg));
        }
        return [...prev, messageData];
      });
    });

    // UPDATE
    newSocket.on('message_updated', (updateData) => {
      // console.log('Message updated:', updateData);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updateData.messageId
            ? { ...msg, content: updateData.content, isUpdated: true, updatedAt: updateData.updatedAt }
            : msg
        )
      );
    });

    // DELETE
    newSocket.on('message_deleted', (deleteData) => {
      // console.log('Message deleted:', deleteData);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === deleteData.messageId ? { ...msg, isActive: false, updatedAt: deleteData.updatedAt } : msg
        )
      );
    });

    // SEEN
    newSocket.on('messages_seen', (seenMessage) => {
      // Update seen status for messages
      setMessages((prev) => prev.map((msg) => (msg._id === seenMessage.messageId ? { ...msg, status: 'seen' } : msg)));
    });

    return () => {
      newSocket.close();
    };
  }, [userId, NODE_ENV]);

  // ADMIN CONVERSATION
  useEffect(() => {
    handleGetDetailConversation();
  }, [conversationId]);

  // HANDLE DETAIL CONVERSATION
  const handleGetDetailConversation = async () => {
    try {
      const response = await getDetailConversation(conversationId);

      setConversationDetail(response.data);
      setMessages(response.data.message);
      setUserId(response.data.user._id);
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get user conversation failed.');
    }
  };

  const getMessageType = (senderId) => {
    return senderId === userId ? 'user' : 'admin';
  };

  // SENT
  const handleSend = async () => {
    if (!input.trim()) return;
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      senderId: userId,
      content: input,
      status: 'sending',
      isUpdated: false,
      isActive: true,
      createdAt: new Date(),
      isTemporary: true
    };

    setMessages((prev) => [...prev, tempMessage]);

    const messageContent = input;
    setInput('');

    try {
      // API SEND
      await adminSentMessage(userId, messageContent);

      // Remove temporary message since real message will come via socket
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));

      setInput('');
    } catch (error) {
      console.error(error.response?.data?.message || 'Sent Message failed.');

      // Remove temporary message and show error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
      setInput(messageContent);
    }
  };

  // RECALL
  const handleRecallMessage = async (messageId) => {
    try {
      await recallMessage(messageId);
    } catch (error) {
      console.error('Recall message failed:', error.response?.data?.message || 'Failed to recall message');
    }
  };

  // EDIT: START
  const handleStartEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingContent(message.content);
  };

  // EDIT: SAVE
  const handleSaveEdit = async (messageId) => {
    if (!editingContent.trim()) {
      handleCancelEdit();
      return;
    }

    try {
      await updateMessage(messageId, editingContent);

      setEditingMessageId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Update message failed:', error.response?.data?.message || 'Failed to update message');
    }
  };

  // EDIT: CANCEL
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Handle typing indicator
    //   if (socket && userId) {
    //     socket.emit('typing', {
    //       conversationId: 'current_conversation',
    //       isTyping: true
    //     });

    //     // Clear previous timeout
    //     if (typingTimeoutRef.current) {
    //       clearTimeout(typingTimeoutRef.current);
    //     }

    //     // Stop typing after 1 second of inactivity
    //     typingTimeoutRef.current = setTimeout(() => {
    //       socket.emit('typing', {
    //         conversationId: 'current_conversation',
    //         isTyping: false
    //       });
    //     }, 1000);
    //   }
  };

  // SENT: ENTER
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // EDIT: ENTER
  const handleEditKeyPress = (e, messageId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit(messageId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={cx('wrapper')}>
      {/* HEADER */}
      <div className={cx('header')}>
        <img
          src={conversationDetail?.user.avatar_url || '/images/default-img.png'}
          alt={'username'}
          className={cx('img')}
          onError={(e) => {
            e.target.src = '/images/default-img.png';
          }}
        />
        <div className={cx('username')}>{conversationDetail?.user.username}</div>
      </div>

      {/* CONTAINER */}
      <div className={cx('chat-container')}>
        <div className={cx('messages')}>
          {messages.map((message, index) => {
            const messageType = getMessageType(message.senderId);
            const isLastMessage = index === messages.length - 1;

            return (
              <div key={message._id} className={cx('messages-item', messageType)}>
                {/* TIME */}
                <div className={cx('messages-time')}>
                  {formatTime(message.isUpdated ? message.updatedAt : message.createdAt)}
                  {message.isActive && message.isUpdated && <span className={cx('edited-label')}> (edited)</span>}
                </div>

                {/* MESSAGE */}
                <div className={cx('messages-container')}>
                  {editingMessageId === message._id ? (
                    // Edit mode
                    <div className={cx('messages-content', 'editing')}>
                      <input
                        type='text'
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(e, message._id)}
                        onBlur={() => handleSaveEdit(message._id)}
                        autoFocus
                        className={cx('edit-input')}
                      />
                      <div className={cx('edit-actions')}>
                        <button onClick={() => handleSaveEdit(message._id)} className={cx('save-btn')}>
                          <Icon icon='material-symbols:check-rounded' width='16' height='16' />
                        </button>
                        <button onClick={handleCancelEdit} className={cx('cancel-btn')}>
                          <Icon icon='material-symbols:close-rounded' width='16' height='16' />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal mode
                    <>
                      <div
                        className={cx('messages-content', {
                          recall: !message.isActive,
                          updated: message.isUpdated,
                          temporary: message.isTemporary
                        })}
                      >
                        {!message.isActive ? 'Message off menu' : message.content}
                      </div>

                      {message.isActive && editingMessageId !== message._id && messageType === 'admin' && (
                        <div className={cx('action')}>
                          <Icon icon='ant-design:more-outlined' width='20' height='20' className={cx('more-icon')} />

                          <div className={cx('action-item')}>
                            <div className={cx('item')} title='recall' onClick={() => handleRecallMessage(message._id)}>
                              <Icon icon='ri:reset-left-line' width='18' height='18' />
                            </div>

                            <div className={cx('item')} title='edit' onClick={() => handleStartEdit(message)}>
                              <Icon icon='bitcoin-icons:edit-filled' width='18' height='18' />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* STATUS */}
                {!message.isTemporary && isLastMessage && editingMessageId !== message._id && (
                  <span className={cx('message-status', message.status)}>
                    {message.status === 'sent' && <Icon icon='material-symbols:check-rounded' width='15' height='15' />}
                    {message.status === 'delivered' && <Icon icon='meteor-icons:check-double' width='15' height='15' />}
                    {message.status === 'seen' && <Icon icon='mdi:eye' width='15' height='15' />}
                  </span>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={cx('input-box')}>
          <input
            type='text'
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder='Answer User'
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            <Icon icon='mingcute:send-fill' width='24' height='24' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationDetail;
