// import { Avatar } from '@mui/material';
import { Button } from '@mui/material';
import styles from './header.module.scss'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles['logo-wrapper']}>
          logoIcon
        </div>
        <div className={styles['moon-icon']}></div>
        <div className={styles['control-panel']}>
        <div className={styles['control-panel']}>
          <Button variant="contained">Save</Button>
        </div>
        </div>
        {/* <div className={styles['user-avatar']}>
          <Avatar src='' />
        </div> */}
      </div>
    </header>
  );
}

export default Header;