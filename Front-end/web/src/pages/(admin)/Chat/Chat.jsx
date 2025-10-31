import { Icon } from '@iconify/react';

import { useEffect, useState } from 'react';

import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Conversation from '@/components/ui/Conversation/Conversation';
import ConversationDetail from '@/components/ui/ConversationDetail/ConversationDetail';

import { getCookie } from '@/utils/cookies';
import { getAdminConversation } from '@/api/chat';

import { formatTime } from '@/utils/formatTimeMongo';

// SOCKET
import { io } from 'socket.io-client';

import styles from './Chat.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Chat() {
  const NODE_ENV = import.meta.env.NODE_ENV;

  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState();

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

    // CONVERSATION UPDATE
    newSocket.on('conversations_updated', (updatedConversations) => {
      // console.log('Admin - Conversations list updated:', updatedConversations);
      setConversations(updatedConversations);
    });

    return () => {
      newSocket.close();
    };
  }, [NODE_ENV]);

  // ADMIN CONVERSATION
  useEffect(() => {
    handleGetAdminConversation();
  }, [conversationId]);

  // HANDLE ADMIN CONVERSATION
  const handleGetAdminConversation = async () => {
    try {
      const response = await getAdminConversation();

      setConversations(response.data || []);
    } catch (error) {
      console.error(error.response?.data?.message || 'Get user conversation failed.');
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const filteredConversations = search.trim()
    ? conversations.filter((conv) => {
      const username = conv?.user?.username?.toLowerCase() || '';
      return username.includes(search.toLowerCase());
    })
    : conversations;

  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      <div className={cx('chat-container')}>
        {/* CONVERSATION */}
        <div className={cx('conversation-container')}>
          <div className={cx('conversation-title')}>Chat</div>
          {/* SEARCH */}
          <div className={cx('search-container')}>
            <Icon icon='mingcute:search-line' className={cx('search-icon')} />
            <input
              type='text'
              placeholder={'Find Message'}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className={cx('search-input')}
            />
          </div>

          {/* CONVERSATION LIST */}
          <div className={cx('conversation-list')}>
            {filteredConversations.map((conversation, index) => {
              return (
                <Conversation
                  key={index + conversation?.user.username || ''}
                  avatar={conversation?.user.avatar_url || ''}
                  username={conversation?.user.username || ''}
                  lastMessage={conversation?.lastMessage?.content || ''}
                  updateAt={formatTime(conversation.updatedAt) || ''}
                  isRead={conversation.isRead || ''}
                  isActive={conversation?.lastMessage?.isActive}
                  onClick={() => {
                    setConversationId(conversation._id);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        {conversationId && (
          <div className={cx('conversation-content')}>
            <ConversationDetail conversationId={conversationId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
