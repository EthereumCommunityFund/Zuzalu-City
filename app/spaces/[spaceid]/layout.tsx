import { Header, Sidebar } from 'components/layout';
import SubSidebar from 'components/layout/Sidebar/SubSidebar';

interface SpacePageLayoutPropTypes {
  children: React.ReactNode;
}

export default function SpacePageLayout({
  children,
}: SpacePageLayoutPropTypes) {
  return (
    <div style={{ color: 'white' }}>
      <Header></Header>
      <div className="flex justify-between">
        <div className="flex">
          <Sidebar></Sidebar>
          <SubSidebar></SubSidebar>
        </div>
        {children}
      </div>
    </div>
  );
}
