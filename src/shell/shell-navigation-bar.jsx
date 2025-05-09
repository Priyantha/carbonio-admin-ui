import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Responsive } from '@zextras/carbonio-design-system';
import ShellMobileNav from './shell-mobile-nav';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
export default function ShellNavigationBar({ mobileNavIsOpen, activeRoute }) {
  return (\
    <Container
      orientation="horizontal"
      background="gray5"
      width="fit"
      height="fill"
      mainAlignment="flex-start"
      crossAlignment="flex-start"
    >
      <Responsive mode="desktop">
        <ShellPrimaryBar activeRoute={activeRoute} />
        <ShellSecondaryBar activeRoute={activeRoute} />
        <Link to="/delegated-admin">Delegated Admins</Link>
      </Responsive>
      <Responsive mode="mobile">
        <ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} activeRoute={activeRoute} />
      </Responsive>
    </Container>
  );
}
