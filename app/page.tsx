import dynamic from 'next/dynamic';

const DynamicHomePage = dynamic(() => import('./home'), { ssr: false });
const Home = () => {
  return <DynamicHomePage />;
};

export default Home;
