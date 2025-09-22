import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUserConversation, sentMessage, updateMessage, recallMessage } from '@/services/chat';

// Initial state
const initialState = {
  messages: [],
  userId: null,
  isLoading: false,
  error: null,
  isConnected: false
};

// Async thunks
export const fetchUserConversation = createAsyncThunk('chat/fetchUserConversation', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserConversation();

    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async (content, { rejectWithValue }) => {
  try {
    const response = await sentMessage(content);

    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const editMessage = createAsyncThunk('chat/editMessage', async ({ messageId, content }, { rejectWithValue }) => {
  try {
    const response = await updateMessage(messageId, content);
    return { messageId, content, response };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteMessage = createAsyncThunk('chat/deleteMessage', async (messageId, { rejectWithValue }) => {
  try {
    const response = await recallMessage(messageId);
    return { messageId, response };
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // NEW MESSAGE: socket
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // UPDATEA MESSAGE: socket
    updateMessageSocket: (state, action) => {
      const { messageId, content, updatedAt } = action.payload;
      const messageIndex = state.messages.findIndex((msg) => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          content,
          isUpdated: true,
          updatedAt
        };
      }
    },

    // RECALL MESSAGE: socket
    deleteMessageSocket: (state, action) => {
      const { messageId, updatedAt } = action.payload;
      const messageIndex = state.messages.findIndex((msg) => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          isActive: false,
          updatedAt
        };
      }
    },

    // UPDATE STATUS MESSAGE
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const messageIndex = state.messages.findIndex((msg) => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].status = status;
      }
    },

    // Set connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },

    // Add temporary message
    addTemporaryMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // Remove temporary message
    removeTemporaryMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user conversation
      .addCase(fetchUserConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.user._id;
        state.messages = action.payload.message || [];
      })
      .addCase(fetchUserConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch conversation';
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send message';
      })

      // Edit message
      .addCase(editMessage.fulfilled, (state, action) => {
        // Message sẽ được cập nhật qua socket
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to edit message';
      })

      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        // Message sẽ được cập nhật qua socket
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete message';
      });
  }
});

export const {
  addMessage,
  updateMessageSocket,
  deleteMessageSocket,
  updateMessageStatus,
  setConnectionStatus,
  addTemporaryMessage,
  removeTemporaryMessage,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;
