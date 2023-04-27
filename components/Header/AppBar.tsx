import Box from '@mui/system/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SwitchThemeButton from '../SwitchThemeButton';
import SearchField from '../SearchField';
import UserMenu from './UserMenu';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import { useSearchContext } from 'context/SearchContext/SearchContext';
import { useEffect, useState } from 'react';
import { Psychology, Add } from '@mui/icons-material';
import dynamic from 'next/dynamic';

const ChatModal = dynamic(async () => await import('../ChatModal'))

const pages = [
  {
    path: '/',
    label: 'Feeds',
  },
];

const Bar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter()
  const { searchText, setSearchText } = useSearchContext()
  const [searchValue, setSearchValue] = useState(searchText);

  const [chatModalVisible, setChatModalVisible] = useState(false);

  useEffect(() => {
    setSearchValue(searchText)
  }, [searchText]);

  const onSearch = async () => {
    console.log(router.pathname);
    
    if (router.pathname !== '/search') {
      await router.push({
        pathname: '/search',
        query: { searchText: searchValue },
      })
    } else {
      setSearchText(searchValue) // searchText change will call handleSearch
      await router.replace({
        pathname: '/search',
        query: { searchText: searchValue },
      })
    }
  }
  const right = (
    <div className="right flex flex-nowrap items-center ml-1">
      <Tooltip title="ChatGPT">
        <IconButton aria-label="chat" onClick={() => setChatModalVisible(true)} color='inherit'>
          <Psychology />
        </IconButton>
      </Tooltip>
      <ChatModal visible={chatModalVisible} onClose={() => setChatModalVisible(false)} />
      <SwitchThemeButton />
      {status === 'loading' ? (
        <div className="mr-auto">
          <Typography component='span'>Validating session ...</Typography>
        </div>
      ) : !session ? (
        <Button variant="text" sx={{ color: 'inherit' }}>
          <Link href="/api/auth/signin" legacyBehavior>
            <Typography component='span'>Log in</Typography>
          </Link>
        </Button>
      ) : (
        <>
          <Tooltip title="New Post">
            <IconButton sx={{ color: 'inherit' }}>
              <Link href="/create" legacyBehavior>
                <Add />
              </Link>
            </IconButton>
          </Tooltip>
          <p className="inline-block text-sm pr-4">
            <Typography component='span'>
              {session.user?.name} ({session.user?.email})
            </Typography>
          </p>
          <UserMenu user={session.user} />
        </>
      )}
    </div>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page.path} sx={{ my: 2, color: 'inherit' }}>
                <Link className="text-inherit" href={page.path}>
                  <Typography component='span' sx={{ fontWeight: 'bold' }}>{page.label}</Typography>
                </Link>
              </Button>
            ))}
          </Box>
          <SearchField value={searchValue} onChange={setSearchValue} onSearch={onSearch} />
          {right}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Bar;
