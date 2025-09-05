import Sidebar from '@/components/ui/Sidebar/Sidebar';

import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      <div className={cx('title')}>Dashboard</div>
    </div>
  );
}

export default Dashboard;
