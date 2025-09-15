import FeatCard from '@/components/ui/FeatCard/FeatCard';

import { features } from '@/data/features';

import styles from './Features.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

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
        <div className={cx('download-content')}>
          <div className={cx('title')}>Available on Web & App</div>
          <div className={cx('description')}>
            Access CaloCook anytime, anywhere – whether on your laptop or your smartphone.
          </div>
          <Link to={''} className={cx('action')}>
            <img src='/images/google-play.png' alt='google-play' />
          </Link>
        </div>
        <div className={cx('download-image')}>
          <img src='/images/download-sample.png' alt='download' />
        </div>
      </div>
    </div>
  );
}

export default Features;
