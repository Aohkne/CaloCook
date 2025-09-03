import Navbar from '@/components/ui/Navbar/Navbar';

import Hero from '@/components/sections/Hero/Hero';

import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Features from '@/components/sections/Features/Features';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('wrapper')}>
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

export default Home;
