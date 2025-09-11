import { useState } from 'react';

import { Icon } from '@iconify/react';

import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';

import classNames from 'classnames/bind';
import styles from './Dish.module.scss';

const cx = classNames.bind(styles);

function Dish() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  return (
    <div className={cx('wrapper')}>
      <Navbar />

      <div className={cx('chat-icon')} onClick={toggleChat}>
        <Icon icon='line-md:chat-round-filled' />
      </div>
      {isChatOpen && <ChatBox isChatOpen={isChatOpen} toggleChat={toggleChat} />}
    </div>
  );
}

export default Dish;
