import { io } from 'socket.io-client';
import { store } from '@/redux/store';

import { SOCKET_URL } from '@env';

import {
  addMessage,
  updateMessageSocket,
  deleteMessageSocket,
  updateMessageStatus,
  setConnectionStatus,
  removeTemporaryMessage
} from '@/redux/slices/chatSlice';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // GET: token from Redux store
      const state = store.getState();
      const token = state.auth.token;

      if (!token) {
        console.log('No token found in Redux store, cannot connect socket');
        return;
      }

      console.log('Token found in Redux store, connecting socket...');

      // CONNECT: socket
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        auth: {
          token: token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000
      });

      // LISTEN: CONNECT
      this.socket.on('connect', () => {
        // console.log('Socket connected:', this.socket.id);
        this.isConnected = true;
        store.dispatch(setConnectionStatus(true));
      });

      this.socket.on('disconnect', (reason) => {
        // console.log('Socket disconnected:', reason);
        this.isConnected = false;
        store.dispatch(setConnectionStatus(false));
      });

      this.socket.on('connect_error', (error) => {
        // console.error('Socket connection error:', error.message);
        this.isConnected = false;
        store.dispatch(setConnectionStatus(false));
      });

      // LISTEN: message event
      this.socket.on('new_message', (messageData) => {
        // console.log('New message received:', messageData);
        store.dispatch(addMessage(messageData));
      });

      this.socket.on('message_sent', (messageData) => {
        // console.log('Message sent confirmation:', messageData);
        // DELETE temporary message và add message
        const tempId = `temp_${Date.now()}_${messageData.content.slice(0, 10)}`;
        store.dispatch(removeTemporaryMessage(tempId));
        store.dispatch(addMessage(messageData));
      });

      this.socket.on('message_updated', (updateData) => {
        // console.log('Message updated:', updateData);
        store.dispatch(
          updateMessageSocket({
            messageId: updateData.messageId,
            content: updateData.content,
            updatedAt: updateData.updatedAt
          })
        );
      });

      this.socket.on('message_deleted', (deleteData) => {
        // console.log('Message deleted:', deleteData);
        store.dispatch(
          deleteMessageSocket({
            messageId: deleteData.messageId,
            updatedAt: deleteData.updatedAt
          })
        );
      });

      this.socket.on('messages_seen', (seenMessage) => {
        // console.log('Message seen:', seenMessage);
        store.dispatch(
          updateMessageStatus({
            messageId: seenMessage.messageId,
            status: 'seen'
          })
        );
      });
    } catch (error) {
      console.error('Socket connection failed:', error);
      this.isConnected = false;
      store.dispatch(setConnectionStatus(false));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      store.dispatch(setConnectionStatus(false));
      // console.log('Socket disconnected manually');
    }
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
export default new SocketManager();
