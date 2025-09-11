import Navbar from '@/components/ui/Navbar/Navbar';
import ChatBox from '@/components/ui/ChatBox/ChatBox';

import classNames from 'classnames/bind';
import styles from './Dish.module.scss';

const cx = classNames.bind(styles);

function Dish() {
  return (
    <div className={cx('wrapper')}>
      <Navbar />
      <ChatBox />
    </div>
  );
}

export default Dish;
