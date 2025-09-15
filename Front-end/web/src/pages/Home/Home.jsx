import Header from '@/components/sections/Header/Header';
import Hero from '@/components/sections/Hero/Hero';
import Features from '@/components/sections/Features/Features';
import Guide from '@/components/sections/Guide/Guide';
import FAQ from '@/components/sections/FAQ/FAQ';
import Footer from '@/components/sections/Footer/Footer';

import styles from './Home.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('wrapper')}>
      <Header />
      <Hero />
      <Features />
      <Guide />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Home;
