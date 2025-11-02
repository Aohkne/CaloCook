import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeProvider';
import { ChevronLeft, Heart, ThumbsUp, Smile, Angry, X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCommentsByDish,
    createComment,
    updateComment,
    deleteComment,
    addCommentOptimistic,
    updateCommentOptimistic,
    deleteCommentOptimistic,
    resetComments,
    addReaction,
    updateReaction,
    removeReaction,
    getReactionsByComment
} from '@redux/slices/commentSlice';

export default function Comment({ route, navigation }) {
    const { dishId, dishName } = route.params;
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const dispatch = useDispatch();

    // States
    const [showLikeOptions, setShowLikeOptions] = useState({});
    const [showReactionModal, setShowReactionModal] = useState(null);

    // Get user info from auth
    const { user } = useSelector((state) => state.auth);
    const userId = user?._id;

    // Get comments and reactions from Redux
    const { comments, totalRoot, totalComment, reactions, isLoading, error } = useSelector((state) => state.comment);

    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const textInputRef = React.useRef(null);

    // Load comments and reactions when component mounts
    useEffect(() => {
        if (dishId) {
            dispatch(getCommentsByDish(dishId)).then((result) => {
                if (result.payload?.comments) {
                    // Load reactions for all comments
                    const loadReactions = (commentsList) => {
                        commentsList.forEach(comment => {
                            dispatch(getReactionsByComment(comment._id));
                            if (comment.children && comment.children.length > 0) {
                                loadReactions(comment.children);
                            }
                        });
                    };
                    loadReactions(result.payload.comments);
                }
            });
        }

        return () => {
            dispatch(resetComments());
        };
    }, [dishId, dispatch]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const toggleLikeOptions = (commentId) => {
        setShowLikeOptions(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const getReactionIcon = (type, size = 18, filled = false) => {
        const iconProps = { size, strokeWidth: 2 };

        switch (type) {
            case 'like':
                return <ThumbsUp {...iconProps} color="#4A90E2" fill={filled ? "#4A90E2" : "none"} />;
            case 'love':
                return <Heart {...iconProps} color="#E74C3C" fill={filled ? "#E74C3C" : "none"} />;
            case 'haha':
                return <Smile {...iconProps} color="#FDB44B" fill="none" />;
            case 'angry':
                return <Angry {...iconProps} color="#D35400" fill="none" />;
            default:
                return null;
        }
    };
    const getReactionColor = (type) => {
        switch (type) {
            case 'like': return '#4A90E2';
            case 'love': return '#E74C3C';
            case 'haha': return '#FDB44B';
            case 'angry': return '#D35400';
            default: return colors.description;
        }
    };

    const getReactionLabel = (type) => {
        switch (type) {
            case 'like': return 'Like';
            case 'love': return 'Love';
            case 'haha': return 'Haha';
            case 'angry': return 'Angry';
            default: return '';
        }
    };

    const handleReactionPress = async (commentId, reactionType) => {
        const commentReactions = reactions[commentId];
        const userReaction = commentReactions?.reactions?.find(r => r.userId === userId);

        try {
            if (userReaction) {
                if (userReaction.reactionType === reactionType) {
                    // Remove reaction nếu click vào cùng loại
                    await dispatch(removeReaction({
                        reactionId: userReaction._id,
                        commentId
                    })).unwrap();
                } else {
                    // Update reaction nếu đổi sang loại khác
                    await dispatch(updateReaction({
                        reactionId: userReaction._id,
                        commentId,
                        reactionType
                    })).unwrap();
                }
            } else {
                // Add new reaction
                await dispatch(addReaction({ commentId, reactionType })).unwrap();
            }

            setShowLikeOptions(prev => ({ ...prev, [commentId]: false }));
        } catch (error) {
            console.error('Failed to handle reaction:', error);
            Alert.alert('Error', 'Failed to update reaction. Please try again.');
        }
    };

    const getMostReactedType = (reactionCounts) => {
        if (!reactionCounts) return null;
        const entries = Object.entries(reactionCounts);
        if (entries.length === 0) return null;

        const sorted = entries.sort((a, b) => b[1] - a[1]);
        return sorted[0][1] > 0 ? sorted[0][0] : null;
    };

    const renderReactionSummary = (commentId) => {
        const commentReactions = reactions[commentId];
        if (!commentReactions || commentReactions.totalReaction === 0) return null;

        const mostReacted = getMostReactedType(commentReactions.reactionCounts);

        return (
            <TouchableOpacity
                style={styles.reactionSummary}
                onPress={() => setShowReactionModal(commentId)}
            >
                {mostReacted && (
                    <View style={styles.reactionIconSmall}>
                        {getReactionIcon(mostReacted, 14, true)}
                    </View>
                )}
                <Text style={styles.reactionCount}>{commentReactions.totalReaction}</Text>
            </TouchableOpacity>
        );
    };

    const handleAnswer = (comment) => {
        setReplyingTo(comment);
        setEditingComment(null);
        setCommentText('');
        textInputRef.current?.focus();
    };

    const handleEdit = (comment) => {
        setEditingComment(comment);
        setReplyingTo(null);
        setCommentText(comment.content);
        textInputRef.current?.focus();
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setCommentText('');
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setCommentText('');
    };

    const handleSaveEdit = async () => {
        if (!editingComment || !commentText.trim()) return;

        try {
            dispatch(updateCommentOptimistic({
                commentId: editingComment._id,
                content: commentText.trim()
            }));

            await dispatch(updateComment({
                commentId: editingComment._id,
                content: commentText.trim()
            })).unwrap();

            setEditingComment(null);
            setCommentText('');
        } catch (error) {
            console.error('Failed to update comment:', error);
            Alert.alert('Error', 'Failed to update comment. Please try again.');
            dispatch(getCommentsByDish(dishId));
        }
    };

    const handleSendComment = async () => {
        if (!commentText.trim() || !userId) return;

        try {
            const newCommentData = {
                dishId,
                content: commentText.trim(),
                parentId: replyingTo?._id || null,
                image: ''
            };

            const tempComment = {
                _id: `temp_${Date.now()}`,
                dishId,
                userId,
                content: commentText.trim(),
                parentId: replyingTo?._id || null,
                image: null,
                createdAt: new Date().toISOString(),
                children: [],
                user: {
                    _id: userId,
                    username: user?.username || 'You',
                    fullName: user?.fullName || 'You',
                    avatar_url: user?.avatar_url || ''
                }
            };

            dispatch(addCommentOptimistic({
                comment: tempComment,
                parentId: replyingTo?._id || null
            }));

            await dispatch(createComment(newCommentData)).unwrap();
            dispatch(getCommentsByDish(dishId));

            setCommentText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Failed to create comment:', error);
            Alert.alert('Error', 'Failed to post comment. Please try again.');
            dispatch(getCommentsByDish(dishId));
        }
    };

    const handleDeleteComment = (commentId) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment? All replies will also be deleted.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            dispatch(deleteCommentOptimistic(commentId));
                            await dispatch(deleteComment(commentId)).unwrap();
                        } catch (error) {
                            console.error('Failed to delete comment:', error);
                            Alert.alert('Error', 'Failed to delete comment. Please try again.');
                            dispatch(getCommentsByDish(dishId));
                        }
                    }
                }
            ]
        );
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        const firstInitial = words[0].charAt(0).toUpperCase();
        const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
        return firstInitial + lastInitial;
    };

    const getAvatarColor = (name) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        const index = (name || '').length % colors.length;
        return colors[index];
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;
        const years = Math.floor(days / 365);
        return `${years}y ago`;
    };

    const renderComment = (comment, isReply = false) => {
        const isOwnComment = comment.userId === userId;
        const userName = comment.user?.fullName || comment.user?.username || 'Unknown User';
        const avatarUrl = comment.user?.avatar_url;
        const commentReactions = reactions[comment._id];
        const userReaction = commentReactions?.reactions?.find(r => r.userId === userId);

        return (
            <View key={comment._id}>
                <View style={[
                    styles.commentContainer,
                    isReply && styles.replyContainer
                ]}>
                    {avatarUrl ? (
                        <Image
                            source={{ uri: avatarUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: getAvatarColor(userName) }]}>
                            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
                        </View>
                    )}
                    <View style={styles.commentContent}>
                        <Text style={styles.userName}>
                            {userName}
                        </Text>
                        <Text style={styles.commentText}>
                            {comment.content}
                        </Text>
                        <View style={styles.commentActions}>
                            <Text style={styles.timeAgo}>{getTimeAgo(comment.createdAt)}</Text>

                            {!userReaction ? (
                                <TouchableOpacity
                                    onPress={() => toggleLikeOptions(comment._id)}
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionText}>Like</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => toggleLikeOptions(comment._id)}
                                    style={styles.actionButton}
                                >
                                    <Text style={[styles.actionText, { color: getReactionColor(userReaction.reactionType) }]}>
                                        {getReactionLabel(userReaction.reactionType)}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {showLikeOptions[comment._id] && (
                                <View style={styles.likeOptions}>
                                    <TouchableOpacity
                                        onPress={() => handleReactionPress(comment._id, 'like')}
                                        style={styles.likeOption}
                                    >
                                        {getReactionIcon('like', 20)}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleReactionPress(comment._id, 'love')}
                                        style={styles.likeOption}
                                    >
                                        {getReactionIcon('love', 20)}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleReactionPress(comment._id, 'haha')}
                                        style={styles.likeOption}
                                    >
                                        {getReactionIcon('haha', 20)}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleReactionPress(comment._id, 'angry')}
                                        style={styles.likeOption}
                                    >
                                        {getReactionIcon('angry', 20)}
                                    </TouchableOpacity>
                                    {userReaction && (
                                        <TouchableOpacity
                                            onPress={() => handleReactionPress(comment._id, userReaction.reactionType)}
                                            style={[styles.likeOption, styles.removeReaction]}
                                        >
                                            <X size={20} color="#E74C3C" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {renderReactionSummary(comment._id)}

                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleAnswer(comment)}
                            >
                                <Text style={styles.actionText}>Ans</Text>
                            </TouchableOpacity>

                            {isOwnComment && (
                                <>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleEdit(comment)}
                                    >
                                        <Text style={styles.actionText}>Edt</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleDeleteComment(comment._id)}
                                        style={styles.actionButton}
                                    >
                                        <Text style={styles.deleteText}>Del</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>
                {comment.children && comment.children.length > 0 && (
                    comment.children.map(reply => renderComment(reply, true))
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <ChevronLeft size={24} color={colors.title} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Comments</Text>
                    <View style={styles.commentBadge}>
                        <Text style={styles.commentCount}>{totalComment}</Text>
                    </View>
                </View>

                {/* Loading indicator */}
                {isLoading && comments.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0A6E5C" />
                    </View>
                ) : (
                    <ScrollView style={styles.content}>
                        {comments.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
                            </View>
                        ) : (
                            comments.map(comment => renderComment(comment))
                        )}
                    </ScrollView>
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    {replyingTo && (
                        <View style={styles.replyingBanner}>
                            <Text style={styles.replyingText}>
                                Replying to <Text style={styles.replyingUser}>
                                    {replyingTo.user?.fullName || replyingTo.user?.username || 'User'}
                                </Text>
                            </Text>
                            <TouchableOpacity onPress={handleCancelReply}>
                                <Text style={styles.cancelReply}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {editingComment && (
                        <View style={[styles.replyingBanner, styles.editingBanner]}>
                            <Text style={styles.replyingText}>
                                Editing comment
                            </Text>
                            <TouchableOpacity onPress={handleCancelEdit}>
                                <Text style={styles.cancelReply}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.inputRow}>
                        <TextInput
                            ref={textInputRef}
                            style={styles.textInput}
                            placeholder={
                                editingComment
                                    ? "Edit your comment..."
                                    : replyingTo
                                        ? `Reply to ${replyingTo.user?.username || 'user'}...`
                                        : "Text....."
                            }
                            placeholderTextColor={colors.description + '60'}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!commentText.trim() || !userId) && styles.sendButtonDisabled
                            ]}
                            onPress={editingComment ? handleSaveEdit : handleSendComment}
                            disabled={!commentText.trim() || !userId}
                        >
                            <Text style={styles.sendButtonText}>
                                {editingComment ? 'SAVE' : 'SEND'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reaction Modal */}
                <Modal
                    visible={!!showReactionModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowReactionModal(null)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowReactionModal(null)}
                    >
                        <View style={styles.reactionModal}>
                            <Text style={styles.modalTitle}>Reactions</Text>
                            {showReactionModal && reactions[showReactionModal] && (
                                <>
                                    <View style={styles.reactionStats}>
                                        {Object.entries(reactions[showReactionModal].reactionCounts).map(([type, count]) => (
                                            count > 0 && (
                                                <View key={type} style={styles.reactionStatItem}>
                                                    {getReactionIcon(type, 24, true)}
                                                    <Text style={styles.reactionStatCount}>{count}</Text>
                                                    <Text style={styles.reactionStatLabel}>{getReactionLabel(type)}</Text>
                                                </View>
                                            )
                                        ))}
                                    </View>
                                    <View style={styles.reactionUserList}>
                                        <ScrollView>
                                            {reactions[showReactionModal].reactions.map((reaction) => (
                                                <View key={reaction._id} style={styles.reactionUserItem}>
                                                    {reaction.user?.avatar_url ? (
                                                        <Image
                                                            source={{ uri: reaction.user.avatar_url }}
                                                            style={styles.reactionUserAvatar}
                                                        />
                                                    ) : (
                                                        <View style={[styles.avatarPlaceholder, styles.reactionUserAvatar,
                                                        { backgroundColor: getAvatarColor(reaction.user?.fullName || '') }]}>
                                                            <Text style={styles.avatarText}>
                                                                {getInitials(reaction.user?.fullName || reaction.user?.username)}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <Text style={styles.reactionUserName}>
                                                        {reaction.user?.fullName || reaction.user?.username}
                                                    </Text>
                                                    <View style={styles.reactionUserIcon}>
                                                        {getReactionIcon(reaction.reactionType, 16, true)}
                                                    </View>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </>
                            )}
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowReactionModal(null)}
                            >
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '20',
        },
        backButton: {
            padding: 8,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.title,
            flex: 1,
            textAlign: 'center',
        },
        commentBadge: {
            backgroundColor: '#0A6E5C',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 4,
            minWidth: 28,
            alignItems: 'center',
        },
        commentCount: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '600',
        },
        content: {
            flex: 1,
            paddingTop: 15,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
            paddingHorizontal: 40,
        },
        emptyText: {
            fontSize: 16,
            color: colors.description,
            textAlign: 'center',
        },
        commentContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 15,
            gap: 12,
        },
        replyContainer: {
            paddingLeft: 65,
            backgroundColor: colors.background,
            borderLeftWidth: 2,
            borderLeftColor: colors.border + '30',
        },
        avatar: {
            width: 45,
            height: 45,
            borderRadius: 22.5,
            backgroundColor: '#E0E0E0',
        },
        avatarPlaceholder: {
            width: 45,
            height: 45,
            borderRadius: 22.5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        commentContent: {
            flex: 1,
        },
        userName: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.title,
            marginBottom: 6,
        },
        commentText: {
            fontSize: 14,
            color: colors.description,
            lineHeight: 20,
            marginBottom: 10,
        },
        commentActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            position: 'relative',
        },
        timeAgo: {
            fontSize: 12,
            color: colors.description + '80',
        },
        actionButton: {
            paddingVertical: 2,
        },
        actionText: {
            fontSize: 13,
            color: colors.description,
            fontWeight: '500',
        },
        actionTextActive: {
            color: '#4A90E2',
        },
        likedIconButton: {
            paddingVertical: 2,
        },
        deleteText: {
            fontSize: 13,
            color: '#E74C3C',
            fontWeight: '500',
        },
        likeOptions: {
            position: 'absolute',
            bottom: 25,
            left: 60,
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 6,
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
        likeOption: {
            padding: 4,
        },
        likedIcon: {
            marginLeft: -10,
        },
        inputContainer: {
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: colors.border + '20',
            backgroundColor: colors.background,
        },
        replyingBanner: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.secondary + '10',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            marginBottom: 10,
        },
        editingBanner: {
            backgroundColor: '#FFA07A20',
        },
        replyingText: {
            fontSize: 13,
            color: colors.description,
        },
        replyingUser: {
            fontWeight: '600',
            color: colors.title,
        },
        cancelReply: {
            fontSize: 18,
            color: colors.description,
            fontWeight: '600',
            paddingHorizontal: 8,
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 12,
        },
        textInput: {
            flex: 1,
            backgroundColor: colors.cardBg,
            borderRadius: 8,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: 14,
            color: colors.title,
            maxHeight: 100,
            minHeight: 44,
        },
        sendButton: {
            backgroundColor: '#0A6E5C',
            borderRadius: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 44,
        },
        sendButtonDisabled: {
            backgroundColor: '#0A6E5C80',
        },
        sendButtonText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        reactionSummary: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingVertical: 2,
        },
        reactionIconSmall: {
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border + '20',
        },
        reactionCount: {
            fontSize: 12,
            color: colors.description,
            fontWeight: '500',
        },
        removeReaction: {
            borderLeftWidth: 1,
            borderLeftColor: colors.border + '30',
            paddingLeft: 8,
            marginLeft: 4,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        reactionModal: {
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 20,
            width: '85%',
            maxHeight: '70%',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.title,
            marginBottom: 15,
            textAlign: 'center',
        },
        reactionStats: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 15,
            marginBottom: 20,
            justifyContent: 'center',
        },
        reactionStatItem: {
            alignItems: 'center',
            gap: 4,
        },
        reactionStatCount: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.title,
        },
        reactionStatLabel: {
            fontSize: 12,
            color: colors.description,
        },
        reactionUserList: {
            maxHeight: 300,
        },
        reactionUserItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            gap: 12,
        },
        reactionUserAvatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
        },
        reactionUserName: {
            flex: 1,
            fontSize: 14,
            color: colors.title,
            fontWeight: '500',
        },
        reactionUserIcon: {
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalCloseButton: {
            backgroundColor: '#0A6E5C',
            borderRadius: 8,
            paddingVertical: 12,
            marginTop: 15,
            alignItems: 'center',
        },
        modalCloseText: {
            color: '#FFF',
            fontSize: 14,
            fontWeight: '600',
        },
    });