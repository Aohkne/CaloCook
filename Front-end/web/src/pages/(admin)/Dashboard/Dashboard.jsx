import Panel from '@/components/ui/Panel/Panel';
import Sidebar from '@/components/ui/Sidebar/Sidebar';

import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Dashboard() {
  return (
    <div className={cx('wrapper')}>
      <Sidebar />

      <div className={cx('title')}>Dashboard</div>

      <div className={cx('content')}>
        <Panel type='user' title='Users' icon='mdi:user-group' total={1000} />
        <Panel type='dish' title='Dishs' icon='bxs:dish' total={10} />
        <Panel type='favorite' title='Top Favorite' icon='line-md:heart-filled' total={10} />
        <Panel type='rating' title='Top Rating' icon='line-md:star-filled' total={10} />
      </div>
    </div>
  );
}

export default Dashboard;
