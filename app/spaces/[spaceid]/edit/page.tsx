'use client';
import { useState } from 'react';
import { Stack } from '@mui/material';
import SpaceEditSidebar from './components/Sidebar';
import { Overview, Invite } from './Tabs';

export default function SpaceEditPage() {
  const [tabName, setTabName] = useState<string>('Overview');

  const renderPage = () => {
    switch (tabName) {
      case 'Overview':
        return <Overview />;
      case 'Invite':
        return <Invite />;
      default:
        return <Overview />;
    }
  };
  console.log('tab', tabName);
  return (
    <Stack
      flexDirection="row"
    >
      <SpaceEditSidebar tabName={tabName} setTabName={setTabName} />
      {renderPage()}
    </Stack>
  );
}
