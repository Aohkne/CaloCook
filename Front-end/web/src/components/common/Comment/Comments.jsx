import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Icon } from '@iconify/react';
import styles from './Comments.module.scss';
const cx = classNames.bind(styles);

// Helper function to get reaction icon
const getReactionIcon = (type, size = 18) => {
  const iconProps = { width: size, height: size };
  
  switch (type) {
    case 'like':
      return <Icon icon="mdi:thumb-up" {...iconProps} style={{ color: '#4A90E2' }} />;
    case 'love':
      return <Icon icon="mdi:heart" {...iconProps} style={{ color: '#E74C3C' }} />;
    case 'haha':
      return <Icon icon="mdi:emoticon-happy-outline" {...iconProps} style={{ color: '#FDB44B' }} />;
    case 'angry':
      return <Icon icon="mdi:emoticon-angry-outline" {...iconProps} style={{ color: '#D35400' }} />;
    case 'sad':
      return <Icon icon="mdi:emoticon-sad-outline" {...iconProps} style={{ color: '#95A5A6' }} />;
    case 'wow':
      return <Icon icon="mdi:emoticon-surprised-outline" {...iconProps} style={{ color: '#9B59B6' }} />;
    default:
      return null;
  }
};

// Helper function to get reaction color
const getReactionColor = (type) => {
  switch (type) {
    case 'like': return '#4A90E2';
    case 'love': return '#E74C3C';
    case 'haha': return '#FDB44B';
    case 'angry': return '#D35400';
    case 'sad': return '#95A5A6';
    case 'wow': return '#9B59B6';
    default: return '#666';
  }
};

// Helper function to get reaction label
const getReactionLabel = (type) => {
  switch (type) {
    case 'like': return 'Like';
    case 'love': return 'Love';
    case 'haha': return 'Haha';
    case 'angry': return 'Angry';
    case 'sad': return 'Sad';
    case 'wow': return 'Wow';
    default: return '';
  }
};

const timeAgo = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const seconds = Math.floor((now - commentDate) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) {
      return `${interval} ${intervals[i].label}${interval > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const Comment = ({ comment, onDelete, onRequestDelete, onReply, reactions, onReaction, currentUserId, isChild = false }) => {
  const [showReactionOptions, setShowReactionOptions] = useState(false);
  
  // Close reaction options when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowReactionOptions(false);
    };

    if (showReactionOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showReactionOptions]);
  
  // Get reactions for this comment
  const commentReactions = reactions?.[comment._id];
  const userReaction = commentReactions?.reactions?.find(r => r.userId === currentUserId);
  
  // Handle reaction button click
  const handleReactionClick = (reactionType) => {
    if (onReaction) {
      onReaction(comment._id, reactionType);
    }
    setShowReactionOptions(false);
  };

  // Get most reacted type for display
  const getMostReactedType = (reactionCounts) => {
    if (!reactionCounts) return null;
    const entries = Object.entries(reactionCounts);
    if (entries.length === 0) return null;

    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][1] > 0 ? sorted[0][0] : null;
  };

  return (
    <div className={cx('comment')}>
      <div className={cx('comment-header')}>
        <img
          className={cx('comment-avatar')}
          src={comment.user.avatar_url || '/default-avatar.png'}
          alt={comment.user.fullName}
        />
        <p className={cx('comment-author')}>{comment.user.fullName}</p>
      </div>

      <div className={cx('comment-body')}>
        <div className={cx('comment-content')}>{comment.content}</div>
        <div className={cx('comment-footer')}>
          <span className={cx('comment-actions')}>
            <span className={cx('comment-time')}>{timeAgo(comment.createdAt)}</span>
            
            {/* Reaction Button */}
            <div className={cx('reaction-container')} onClick={(e) => e.stopPropagation()}>
              {!userReaction ? (
                <button 
                  className={cx('reaction-button')}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUserId) {
                      alert('Please log in to react to comments');
                      return;
                    }
                    setShowReactionOptions(!showReactionOptions);
                  }}
                >
                  Like
                </button>
              ) : (
                <button 
                  className={cx('reaction-button', 'reacted')}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReactionOptions(!showReactionOptions);
                  }}
                  style={{ color: getReactionColor(userReaction.reactionType) }}
                >
                  {getReactionLabel(userReaction.reactionType)}
                </button>
              )}
              
              {/* Reaction Options */}
              {showReactionOptions && (
                <div className={cx('reaction-options')} onClick={(e) => e.stopPropagation()}>
                  {['like', 'love', 'haha', 'angry', 'sad', 'wow'].map((reactionType) => (
                    <button
                      key={reactionType}
                      className={cx('reaction-option')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReactionClick(reactionType);
                      }}
                      title={getReactionLabel(reactionType)}
                    >
                      {getReactionIcon(reactionType, 24)}
                    </button>
                  ))}
                  {userReaction && (
                    <button
                      className={cx('reaction-option', 'remove-reaction')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReactionClick(userReaction.reactionType);
                      }}
                      title="Remove reaction"
                    >
                      <Icon icon="mdi:close" width={24} height={24} style={{ color: '#E74C3C' }} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Reaction Summary */}
            {commentReactions && commentReactions.totalReaction > 0 && (
              <div className={cx('reaction-summary')}>
                {getMostReactedType(commentReactions.reactionCounts) && (
                  <span className={cx('reaction-icon-small')}>
                    {getReactionIcon(getMostReactedType(commentReactions.reactionCounts), 16)}
                  </span>
                )}
                <span className={cx('reaction-count')}>{commentReactions.totalReaction}</span>
              </div>
            )}

            {/* ✅ Show "Answer" only for top-level comments */}
            {!isChild && <button onClick={() => onReply && onReply(comment._id, comment.user.fullName)}>Answer</button>}

            <button
              className={cx('comment-action-delete')}
              onClick={() => {
                // prefer the request-delete callback (opens confirm modal) if provided
                if (onRequestDelete) return onRequestDelete(comment._id);
                if (onDelete) return onDelete(comment._id);
              }}
            >
              Delete
            </button>
          </span>
        </div>

        {/* Recursive children */}
        {comment.children && comment.children.length > 0 && (
          <div className={cx('comment-children')}>
            {comment.children.map((child) => (
              <Comment
                key={child._id}
                comment={child}
                onDelete={onDelete}
                onRequestDelete={onRequestDelete}
                onReply={onReply}
                reactions={reactions}
                onReaction={onReaction}
                currentUserId={currentUserId}
                isChild={true} // ✅ mark as child
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsList = ({ comments, onDelete, onReply, reactions, onReaction, currentUserId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);

  const handleRequestDelete = (id) => {
    setPendingId(id);
    setConfirmOpen(true);
  };

  const handleCancel = () => {
    setPendingId(null);
    setConfirmOpen(false);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      if (onDelete && pendingId) await onDelete(pendingId);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className={cx('comments-list')}>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onDelete={onDelete}
          onRequestDelete={handleRequestDelete}
          onReply={onReply}
          reactions={reactions}
          onReaction={onReaction}
          currentUserId={currentUserId}
        />
      ))}

      {confirmOpen && (
        <div className={cx('confirm-overlay')}>
          <div className={cx('confirm-modal')}>
            <p className={cx('confirm-message')} style={{ marginBottom: '1rem' }}>
              Are you sure you want to delete this comment?
            </p>
            <div className={cx('confirm-actions')}>
              <button className={cx('cancel-btn')} onClick={handleCancel}>
                Cancel
              </button>
              <button className={cx('confirm-btn')} onClick={handleConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
