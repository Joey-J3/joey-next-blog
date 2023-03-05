import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Session } from 'next-auth';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Router from 'next/router';

interface Props {
  user: Session['user'];
}

enum MenuItemEnum {
  LOG_OUT = 0,
  DRAFT = 1,
}

const settings = [
  {
    label: 'Drafts',
    value: MenuItemEnum.DRAFT
  },
  {
    label: 'Log out',
    value: MenuItemEnum.LOG_OUT
  }
]

const UserMenu: React.FC<Props> = ({ user }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(e.currentTarget);
  }

  const handleClickMenuItem = (value: MenuItemEnum) => {
    if (value === MenuItemEnum.LOG_OUT) {
      signOut()
    } else if (value === MenuItemEnum.DRAFT) {
      Router.push('/drafts')
    }
  }
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            src={user?.image || '/images/avatar.jpg'}
            alt={user?.name || ''}
            sx={{ display: 'inline-block', marginRight: '1rem' }}
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        {settings.map((setting) => (
          <MenuItem key={setting.value} onClick={() => handleClickMenuItem}>
            <Typography component='span' textAlign="center">{setting.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default UserMenu;
