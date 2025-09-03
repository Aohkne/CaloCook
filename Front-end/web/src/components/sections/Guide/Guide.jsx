import styles from './Guide.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Guide() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}> How It Works</div>
      <div className={cx('video-container')}>
        <iframe
          width='100%'
          height='100%'
          src={'https://www.youtube.com/watch?v=dZn2OPClFJw'.replace('watch?v=', 'embed/')}
          title={'Calocook-howitworks'}
          allow='accelerometer; autoplay; encrypted-media; gyroscope;'
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default Guide;
