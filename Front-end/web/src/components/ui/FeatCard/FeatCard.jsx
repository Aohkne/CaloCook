import { Icon } from '@iconify/react';
import styles from './FeatCard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function FeatCard({ icon, title, description }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('icon-container')}>
        <Icon icon={icon} width='25' height='25' />
      </div>
      <div className={cx('title')}>{title}</div>
      <div className={cx('description')}>{description}</div>
    </div>
  );
}

export default FeatCard;
