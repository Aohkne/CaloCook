import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import styles from './Hero.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Hero() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('content')}>
        <div className={cx('title')}>Hungry? Swipe left!</div>
        <div className={cx('description')}>Eat what you love, track what you need</div>

        <Link to={ROUTES.REGISTER} className={cx('action')}>
          Create account
        </Link>
      </div>
    </div>
  );
}

export default Hero;
