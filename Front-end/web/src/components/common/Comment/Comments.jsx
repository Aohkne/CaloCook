import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Comments.module.scss';
const cx = classNames.bind(styles);

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

const Comment = ({ comment, onDelete, onRequestDelete, onReply, isChild = false }) => {
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
            <button>Like</button>

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
                isChild={true} // ✅ mark as child
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsList = ({ comments, onDelete, onReply }) => {
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
