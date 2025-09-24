import { Icon } from '@iconify/react';

import styles from './ModelCard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ModelCard({ icon, image, title, type, description, onClick, isActive }) {
  return (
    <div className={cx('wrapper', { active: isActive })} title={description} onClick={onClick}>
      <div className={cx('icon-container')}>
        {icon ? <Icon icon={icon} width='25' height='25' /> : <img src={image} alt={title} />}
      </div>
      <div className={cx('title', type)}>{title}</div>
    </div>
  );
}

export default ModelCard;
