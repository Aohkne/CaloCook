import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyzeImageService } from '@/services/model';

// Initial state
const initialState = {
  messages: [
    {
      id: 'welcome',
      from: 'bot',
      text: "Hi, I'm Calobot! Please upload an image of your food and I'll analyze its nutritional content for you.",
      timestamp: new Date().toISOString(),
      type: 'text'
    }
  ],
  isAnalyzing: false,
  isTyping: false,
  error: null
};

// Async thunk for analyzing image
export const analyzeImage = createAsyncThunk('calobot', async (formData, { rejectWithValue }) => {
  try {
    const response = await analyzeImageService(formData);

    return response;
  } catch (error) {
    console.error('Calobot analysis error:', error);
    return rejectWithValue(error);
  }
});

// HELPER: to format analysis response
const formatAnalysisResponse = (data) => {
  if (!data.success) {
    return {
      type: 'error',
      text: data.message || "Sorry, I couldn't analyze this image. Please try again!",
      suggestion: data.suggestion || null
    };
  }

  const { food_detected, description, nutrition_info, recommendations, ai_analysis } = data;

  return {
    type: 'analysis',
    data: {
      foodName: food_detected?.display_name || food_detected?.name || 'Unknown Food',
      confidence: food_detected?.confidence_percentage || 0,
      description: description || 'No description available',
      nutrition: {
        caloriesPer100g: nutrition_info?.calories_per_100g || 0,
        typicalPortion: nutrition_info?.typical_portion_g || 0,
        estimatedCalories: nutrition_info?.estimated_calories || 0
      },
      recommendations: {
        portionNote: recommendations?.portion_note || '',
        calorieNote: recommendations?.calorie_note || '',
        healthTip: recommendations?.health_tip || ''
      },
      aiAnalysis: {
        detectionConfidence: ai_analysis?.detection_confidence || 0,
        status: ai_analysis?.processing_status || 'Unknown'
      }
    }
  };
};

// Calobot slice
const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      const newMessage = {
        id: `user_${Date.now()}`,
        from: 'user',
        text: action.payload.text,
        image: action.payload.image,
        timestamp: new Date().toISOString(),
        type: 'user'
      };
      state.messages.push(newMessage);
    },
    addBotMessage: (state, action) => {
      const newMessage = {
        id: `bot_${Date.now()}`,
        from: 'bot',
        timestamp: new Date().toISOString(),
        ...action.payload
      };
      state.messages.push(newMessage);
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [state.messages[0]]; // Keep welcome message
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Analyze image
      .addCase(analyzeImage.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        const formattedResponse = formatAnalysisResponse(action.payload);
        const botMessage = {
          id: `bot_${Date.now()}`,
          from: 'bot',
          timestamp: new Date().toISOString(),
          ...formattedResponse
        };
        state.messages.push(botMessage);
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload?.message || 'Failed to analyze image';
        const errorMessage = {
          id: `bot_${Date.now()}`,
          from: 'bot',
          type: 'error',
          text: 'Sorry, I encountered an error analyzing your image. Please try again later!',
          timestamp: new Date().toISOString()
        };
        state.messages.push(errorMessage);
      });
  }
});

export const { addUserMessage, addBotMessage, setTyping, clearMessages, clearError } = modelSlice.actions;

export default modelSlice.reducer;
