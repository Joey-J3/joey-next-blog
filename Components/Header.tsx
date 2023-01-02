// Header.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, Button } from '@mui/material';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <Link href="/" legacyBehavior>
        <a className="font-bold no-underline inline-block" data-active={isActive('/')}>
          Feed
        </a>
      </Link>
      <style jsx>{`
        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    right = (
      <div className="mr-auto">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="mr-auto">
        <Link href="/api/auth/signin" legacyBehavior>
          <a className='no-underline inline-block ml-4 border border-solid px-4 py-2 rounded' data-active={isActive('/signup')}>Log in</a>
        </Link>
        <style jsx>{`
          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        <Link href="/" legacyBehavior>
          <a className="font-bold no-underline inline-block" data-active={isActive('/')}>
            Feed
          </a>
        </Link>
        <Link href="/drafts" legacyBehavior>
          <a className='no-underline inline-block' data-active={isActive('/drafts')}>My drafts</a>
        </Link>
        <style jsx>{`
          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right flex flex-nowrap items-center">
        <Avatar src={session.user?.image || '/images/avatar.jpg'} alt={session.user?.name || ''} sx={{ display: 'inline-block', marginRight: '1rem'}}/>
        <p className='inline-block text-sm pr-4'>
          {session.user?.name} ({session.user?.email})
        </p>
        <Link href="/create" legacyBehavior>
          <Button variant='outlined'>
            <span className="text-gray-900">New post</span>
          </Button>
        </Link>
        <Button variant="text" onClick={() => signOut()}><span className="text-gray-900">Log out</span></Button>
      </div>
    );
  }

  return (
    <nav className='flex p-4 items-center justify-between'>
      {left}
      {right}
    </nav>
  );
};

export default Header;
