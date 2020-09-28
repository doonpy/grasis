import Head from 'next/head';
import React, { FunctionComponent } from 'react';

interface HeaderProps {
  title: string;
}

const Header: FunctionComponent<HeaderProps> = ({ title }: HeaderProps) => (
  <Head>
    <title>{title}</title>
  </Head>
);

export default Header;
