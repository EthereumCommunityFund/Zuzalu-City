import dynamic from 'next/dynamic';
const DynamicCreate = dynamic(() => import('./create'), { ssr: false });
const Home = () => {
  return <DynamicCreate />;
};
export default Home;
