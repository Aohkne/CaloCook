// Format Time
export const formatMessageTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 24 * 7) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return `${days[date.getDay()]} ${date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Create tmp ID message
export const generateTempMessageId = (content) => {
  return `temp_${Date.now()}_${content.slice(0, 10)}`;
};

// Check user's message
export const isUserMessage = (message, userId) => {
  return message.senderId === userId;
};

// Create tmp message
export const createTemporaryMessage = (content, userId) => {
  return {
    _id: generateTempMessageId(content),
    senderId: userId,
    content,
    status: 'sending',
    isUpdated: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    isTemporary: true
  };
};
