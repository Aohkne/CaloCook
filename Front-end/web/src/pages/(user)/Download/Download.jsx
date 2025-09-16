import classNames from 'classnames/bind';

import { Icon } from '@iconify/react';

const cx = classNames.bind(styles);

import styles from './Download.module.scss';
import Footer from '@/components/sections/Footer/Footer';

export default function Download() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('left-container')}>
        <h1 className={cx('main-text')}>Calocook</h1>
        <h2 className={cx('secondary-text')}>Eat what you love, track what you eat</h2>
        <button className={cx('download-button')}>Download</button>
      </div>
      <div className={cx('right-container')}>
        <img src='/images/phone.png' className={cx('phone')} />
        <div className={cx('ring')}></div>
        <div className={cx('feature-1')}>
          <div>
            <h3 className={cx('tertiary-text')}>Tinder Like Scrolling</h3>
            <p className={cx('short-description-text')}>
              A swipe-based app for matching, inspired by Tinder’s simple left/right interaction model
            </p>
          </div>
          <div className={cx('icon')}>
            <Icon icon='line-md:chat-round-filled' />
          </div>
        </div>
        <div className={cx('feature-2')}>
          <div>
            <h3 className={cx('tertiary-text')}>AI Assistant</h3>
            <p className={cx('short-description-text')}>
              A swipe-based app for matching, inspired by Tinder’s simple left/right interaction model
            </p>
          </div>
          <div className={cx('icon')}>
            <Icon icon='line-md:chat-round-filled' />
          </div>
        </div>
        <div className={cx('feature-3')}>
          <div>
            <h3 className={cx('tertiary-text')}>Track Calories</h3>
            <p className={cx('short-description-text')}>
              A tool to record food and track calorie consumption for better diet management
            </p>
          </div>
          <div className={cx('icon')}>
            <Icon icon='line-md:chat-round-filled' />
          </div>
        </div>
      </div>
      <div className={cx('bottom-container')}>
        <h3 className={cx('tertiary-text')}>Supported Platforms and Devices</h3>
        <p className={cx('short-description-text')}>
          Calocook is available on Android. Apart from mobile apps, you can also visit Calocook.com to use the Calocook
          web version
        </p>
        <p className={cx('short-description-text')}>
          Calocook currently supports all Android versions and newest updates of the popular browsers (Chrome, Firefox,
          Safari, Edge, etc...
        </p>
      </div>
      <div className={cx('footer-container')}>
        <Footer />
      </div>
    </div>
  );
}
