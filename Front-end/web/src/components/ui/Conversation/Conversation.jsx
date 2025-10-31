import { Icon } from '@iconify/react';

import styles from './Conversation.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Conversation({ avatar, username, lastMessage, updateAt, isRead, isActive, onClick }) {
  return (
    <div className={cx('wrapper')} onClick={onClick}>
      <div className={cx('avatar-container')}>
        <img
          src={avatar || '/images/default-img.png'}
          alt={username}
          className={cx('img')}
          onError={(e) => {
            e.target.src = '/images/default-img.png';
          }}
        />
      </div>

      <div className={cx('info-container')}>
        <div className={cx('username')}>{username}</div>
        <div className={cx('content')}>
          <div className={cx('message')}>
            {!isActive
              ? 'Message off menu'.substring(0, 10) + '...'
              : lastMessage.length > 10
              ? lastMessage.substring(0, 10) + '...'
              : lastMessage}
          </div>
          <Icon icon='mdi:dot' />
          <div className={cx('time')}>{updateAt}</div>
        </div>
      </div>

      {!isRead && (
        <div className={cx('dot-container')}>
          <Icon icon='icon-park-outline:dot' />
        </div>
      )}
    </div>
  );
}

export default Conversation;
