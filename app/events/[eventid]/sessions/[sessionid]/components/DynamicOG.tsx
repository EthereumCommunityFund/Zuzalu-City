import { useParams } from 'next/navigation';

function DynamicOG() {
  const params = useParams();
  return (
    <meta
      property="og:image"
      content={`/api/og?id=${params.sessionid.toString()}`}
    />
  );
}

export default DynamicOG;
