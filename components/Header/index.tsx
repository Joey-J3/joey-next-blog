import React from 'react';
import Bar from './AppBar';

const Header: React.FC = () => {

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <Bar />
      </nav>
      <div className="h-16 p-2 m-2 content-none" />
    </>
  );
};

export default Header;
