import FeatCard from '@/components/ui/FeatCard/FeatCard';

import { features } from '@/data/features';

import styles from './Features.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Features() {
  return (
    <div className={cx('wrapper')}>
      {/* FEATURE */}
      <div className={cx('feature-container')}>
        <div className={cx('title')}>Features</div>

        <div className={cx('card-list')}>
          {features.map((item) => (
            <FeatCard key={item.id} icon={item.icon} title={item.title} description={item.description} />
          ))}
        </div>
      </div>

      {/* DOWNLOAD */}
      <div className={cx('download-container')}>
        <div className={cx('title')}>Available on Web & App</div>
      </div>
    </div>
  );
}

export default Features;
