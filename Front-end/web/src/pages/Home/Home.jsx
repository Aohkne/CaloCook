import { useTheme } from '@hooks/useTheme';

import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Home() {
  const { toggleTheme } = useTheme();

  return (
    <div className={cx('wrapper')}>
      <h1>Hello</h1>
      <button className={cx('btn')} onClick={toggleTheme}>
        Toggle Dark/Light
      </button>
    </div>
  );
}

export default Home;
