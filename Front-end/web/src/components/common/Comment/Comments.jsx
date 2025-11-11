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

const Comment = ({ comment, onDelete, isChild = false }) => {
  return (
    <div className={cx('comment')}>
      <div className={cx('comment-header')}>
        <img
          className={cx('comment-avatar')}
          src={comment.user.avatar_url || '/default-avatar.png'}
          alt={comment.user.fullName}
        />
        <p className={cx('comment-author')}>{comment.user.fullName.toUpperCase()}</p>
      </div>

      <div className={cx('comment-body')}>
        <div className={cx('comment-content')}>{comment.content}</div>
        <div className={cx('comment-footer')}>
          <span className={cx('comment-actions')}>
            <span className={cx('comment-time')}>{timeAgo(comment.createdAt)}</span>
            <button>Like</button>

            {/* ✅ Show "Answer" only for top-level comments */}
            {!isChild && <button>Answer</button>}

            <button className={cx('comment-action-delete')} onClick={() => onDelete && onDelete(comment._id)}>
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
                isChild={true} // ✅ mark as child
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentsList = ({ comments, onDelete }) => {
  return (
    <div className={cx('comments-list')}>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CommentsList;
