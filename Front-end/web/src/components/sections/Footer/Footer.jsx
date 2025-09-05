import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
  return (
    <section className={cx('wrapper')}>
      <footer>
        <img src={'/images/logo-footer.png'} alt='logo' width={1048} height={220} />

        <div className={cx('divider')} />

        <div className={cx('footer-container')}>
          <div className={cx('footer-info')}>
            <div className={cx('footer-description')}>© Copyright - 2025 : All Rights Reserved. CALOCOOK Team</div>

            <div className={cx('footer-social')}>
              <Link to={'https://github.com/Aohkne/CaloCook'} target='blank'>
                <Icon icon='line-md:github' width='30' height='30' />
              </Link>

              <Link to={'/'} target='blank'>
                <Icon icon='line-md:youtube' width='30' height='30' />
              </Link>

              <Link
                to='https://mail.google.com/mail/?view=cm&fs=1&to=contact.aohkne@gmail.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon icon='line-md:email' width='30' height='30' />
              </Link>

              {/* <Link to={''} target='blank'>
                <Icon icon='line-md:facebook' width='30' height='30' />
              </Link> */}
            </div>
          </div>

          <div className={cx('footer-content')}>
            <div className={cx('footer-navi')}>
              <div className={cx('navi-title')}>NAVIGATION</div>
              <div className={cx('navi-list')}>
                <Link to={ROUTES.HOME} className={cx('navi-item')}>
                  Home
                </Link>

                <Link to={ROUTES.SUPPORT} className={cx('navi-item')}>
                  Support
                </Link>

                <Link to={ROUTES.DOWNLOAD} className={cx('navi-item')}>
                  Download
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
export default Footer;
