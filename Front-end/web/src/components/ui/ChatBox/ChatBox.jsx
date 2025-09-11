import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import { getUserConversation, sentMessage } from '@/api/chat';
import { formatTime } from '@/utils/formatTimeMongo';
// import { getCookie } from '@/utils/cookies';

// SOCKET
// import { io } from 'socket.io-client';

import classNames from 'classnames/bind';
import styles from './ChatBox.module.scss';

const cx = classNames.bind(styles);

function ChatBox({ isChatOpen, toggleChat }) {
  // const [socket, setSocket] = useState(null);

  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // SOCKET CONNECT
  // useEffect(() => {
  //   // production nhớ đổi URL
  //   const newSocket = io('http://localhost:8080', {
  //     transports: ['websocket'],
  //     auth: {
  //       token: getCookie('accessToken') // token bạn lưu sau login
  //     }
  //   });
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  // USER CONVERSATION
  useEffect(() => {
    handleGetUserConversation();
  }, []);

  const handleGetUserConversation = async () => {
    try {
      const response = await getUserConversation();
      setUserId(response.data.user._id);
      setMessages(response.data.message || []);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get user conversation failed.');
    }
  };

  const getMessageType = (senderId) => {
    return senderId === userId ? 'user' : 'admin';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await sentMessage(input);

      setInput('');
    } catch (error) {
      console.error(error.response?.data?.message || 'Sent Message failed.');
    }
  };

  return (
    <div className={cx('chat-wrapper')}>
      <div className={cx('chat-box', { open: isChatOpen })}>
        <button className={cx('toggle-btn')} onClick={toggleChat}>
          <Icon icon='tabler:x' width='16' height='16' />
        </button>

        {/* Message */}
        <div className={cx('chat-container')}>
          <div className={cx('messages')}>
            {messages.map((message) => {
              const messageType = getMessageType(message.senderId);

              return (
                <div key={message._id} className={cx('messages-item', messageType)}>
                  <div className={cx('messages-time')}>{formatTime(message.createdAt || message.updatedAt)}</div>
                  <div className={cx('messages-container')}>
                    <div className={cx('messages-content', { recall: !message.isActive })}>
                      {!message.isActive ? 'Tin nhắn đã được thu hồi' : message.content}
                    </div>

                    {message.isActive && (
                      <div className={cx('action')}>
                        <Icon icon='ant-design:more-outlined' width='20' height='20' className={cx('more-icon')} />

                        <div className={cx('action-item')}>
                          <div className={cx('item')} title='recall'>
                            <Icon icon='ri:reset-left-line' width='18' height='18' />
                          </div>

                          {messageType === 'user' && (
                            <div className={cx('item')} title='edit'>
                              <Icon icon='bitcoin-icons:edit-filled' width='18' height='18' />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className={cx('input-box')}>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Chat with admin'
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>
              <Icon icon='mingcute:send-fill' width='24' height='24' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
