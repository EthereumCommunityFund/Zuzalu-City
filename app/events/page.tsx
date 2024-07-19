import dynamic from 'next/dynamic';

const DynamicEventsPage = dynamic(() => import('./event'), { ssr: false });
const Home = () => {
  return <DynamicEventsPage />;
};

export default Home;
