import { Icon } from '@iconify/react';

import styles from './Panel.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const formatNumber = (num) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num?.toString();
};

function Panel({ type, title, icon, total, onClick }) {
  return (
    <div className={cx('wrapper', type)} onClick={onClick}>
      <div className={cx('container')}>
        <div className={cx('content')}>
          <div className={cx('icon')}>
            <Icon icon={icon} width='35' height='35' />
          </div>
          <h2 className={cx('title')}>{title}</h2>
        </div>
        <span className={cx('total')}>{formatNumber(total)}</span>
      </div>
    </div>
  );
}

export default Panel;
