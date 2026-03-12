import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  socket: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setConversations, setCurrentConversation, addMessage, setSocket } = chatSlice.actions;
export default chatSlice.reducer;
