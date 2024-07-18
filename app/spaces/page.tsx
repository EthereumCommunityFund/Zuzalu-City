import dynamic from 'next/dynamic';

const DynamicSpacesPage = dynamic(() => import('./space'), { ssr: false });
const Home = () => {
  return <DynamicSpacesPage />;
};

export default Home;
