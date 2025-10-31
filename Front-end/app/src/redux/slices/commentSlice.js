import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getCommentsByDishService,
    createCommentService,
    updateCommentService,
    deleteCommentService,
    addReactionService,
    updateReactionService,
    deleteReactionService,
    getReactionsByCommentService
} from '@/services/comment';

// Initial state
const initialState = {
    comments: [],
    totalRoot: 0,
    totalComment: 0,
    reactions: {},
    isLoading: false,
    error: null
};

// Thêm async thunks cho reaction
export const addReaction = createAsyncThunk(
    'comment/addReaction',
    async ({ commentId, reactionType }, { rejectWithValue }) => {
        try {
            const response = await addReactionService({ commentId, reactionType });
            const reactions = await getReactionsByCommentService(commentId);
            return { commentId, ...reactions };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateReaction = createAsyncThunk(
    'comment/updateReaction',
    async ({ reactionId, commentId, reactionType }, { rejectWithValue }) => {
        try {
            const response = await updateReactionService(reactionId, { reactionType });
            const reactions = await getReactionsByCommentService(commentId);
            return { commentId, ...reactions };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const removeReaction = createAsyncThunk(
    'comment/removeReaction',
    async ({ reactionId, commentId }, { rejectWithValue }) => {
        try {
            await deleteReactionService(reactionId);
            const reactions = await getReactionsByCommentService(commentId);
            return { commentId, ...reactions };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getReactionsByComment = createAsyncThunk(
    'comment/getReactions',
    async (commentId, { rejectWithValue }) => {
        try {
            const reactions = await getReactionsByCommentService(commentId);
            return { commentId, ...reactions };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Async thunks
export const getCommentsByDish = createAsyncThunk(
    'comment/getByDish',
    async (dishId, { rejectWithValue }) => {
        try {
            const response = await getCommentsByDishService(dishId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createComment = createAsyncThunk(
    'comment/create',
    async (commentData, { rejectWithValue }) => {
        try {
            const response = await createCommentService(commentData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateComment = createAsyncThunk(
    'comment/update',
    async ({ commentId, content }, { rejectWithValue }) => {
        try {
            const response = await updateCommentService(commentId, { content });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comment/delete',
    async (commentId, { rejectWithValue }) => {
        try {
            const response = await deleteCommentService(commentId);
            return { commentId, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Comment slice
const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetComments: (state) => {
            state.comments = [];
            state.totalRoot = 0;
            state.totalComment = 0;
            state.error = null;
        },
        // Optimistic update for creating comment
        addCommentOptimistic: (state, action) => {
            const { comment, parentId } = action.payload;

            if (!parentId) {
                // Add as root comment
                state.comments.unshift(comment);
                state.totalRoot += 1;
            } else {
                // Add as reply
                const addReplyToComment = (comments) => {
                    for (let c of comments) {
                        if (c._id === parentId) {
                            if (!c.children) c.children = [];
                            c.children.push(comment);
                            return true;
                        }
                        if (c.children && c.children.length > 0) {
                            if (addReplyToComment(c.children)) return true;
                        }
                    }
                    return false;
                };
                addReplyToComment(state.comments);
            }
            state.totalComment += 1;
        },
        // Optimistic update for editing comment
        updateCommentOptimistic: (state, action) => {
            const { commentId, content } = action.payload;

            const updateInComments = (comments) => {
                for (let c of comments) {
                    if (c._id === commentId) {
                        c.content = content;
                        return true;
                    }
                    if (c.children && c.children.length > 0) {
                        if (updateInComments(c.children)) return true;
                    }
                }
                return false;
            };
            updateInComments(state.comments);
        },
        // Optimistic update for deleting comment
        deleteCommentOptimistic: (state, action) => {
            const commentId = action.payload;

            // Recursive function to count all comments (parent + children)
            const countComments = (comment) => {
                let count = 1; // Count the comment itself
                if (comment.children && comment.children.length > 0) {
                    comment.children.forEach(child => {
                        count += countComments(child);
                    });
                }
                return count;
            };

            // Find and remove comment, return count of deleted comments
            const removeComment = (comments, parentComments = null) => {
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._id === commentId) {
                        const deletedCount = countComments(comments[i]);
                        const isRoot = parentComments === null;
                        comments.splice(i, 1);
                        return { found: true, deletedCount, isRoot };
                    }
                    if (comments[i].children && comments[i].children.length > 0) {
                        const result = removeComment(comments[i].children, comments);
                        if (result.found) return result;
                    }
                }
                return { found: false, deletedCount: 0, isRoot: false };
            };

            const result = removeComment(state.comments);
            if (result.found) {
                state.totalComment -= result.deletedCount;
                if (result.isRoot) {
                    state.totalRoot -= 1;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder

            // Thêm vào extraReducers
            .addCase(addReaction.fulfilled, (state, action) => {
                const { commentId, reactions, totalReaction, reactionCounts } = action.payload;
                state.reactions[commentId] = { reactions, totalReaction, reactionCounts };
            })
            .addCase(updateReaction.fulfilled, (state, action) => {
                const { commentId, reactions, totalReaction, reactionCounts } = action.payload;
                state.reactions[commentId] = { reactions, totalReaction, reactionCounts };
            })
            .addCase(removeReaction.fulfilled, (state, action) => {
                const { commentId, reactions, totalReaction, reactionCounts } = action.payload;
                state.reactions[commentId] = { reactions, totalReaction, reactionCounts };
            })
            .addCase(getReactionsByComment.fulfilled, (state, action) => {
                const { commentId, reactions, totalReaction, reactionCounts } = action.payload;
                state.reactions[commentId] = { reactions, totalReaction, reactionCounts };
            })
            // Get comments cases
            .addCase(getCommentsByDish.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCommentsByDish.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.comments = action.payload.comments || [];
                state.totalRoot = action.payload.totalRoot || 0;
                state.totalComment = action.payload.totalComment || 0;
            })
            .addCase(getCommentsByDish.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to get comments';
            })

            // Create comment cases
            .addCase(createComment.pending, (state) => {
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.error = null;
                // Comment was already added optimistically, just update if needed
            })
            .addCase(createComment.rejected, (state, action) => {
                state.error = action.payload?.message || 'Failed to create comment';
            })

            // Update comment cases
            .addCase(updateComment.pending, (state) => {
                state.error = null;
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.error = null;
                // Comment was already updated optimistically
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.error = action.payload?.message || 'Failed to update comment';
            })

            // Delete comment cases
            .addCase(deleteComment.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.error = null;
                // Comment was already deleted optimistically
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.payload?.message || 'Failed to delete comment';
            });
    }
});

export const {
    clearError,
    resetComments,
    addCommentOptimistic,
    updateCommentOptimistic,
    deleteCommentOptimistic
} = commentSlice.actions;

export default commentSlice.reducer;