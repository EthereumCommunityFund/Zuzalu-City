import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import getLatLngFromAddress from '@/utils/osm';
import { LatLngLiteral } from 'leaflet';

interface Coordinates {
  lat: number;
  lng: number;
}

interface IProps {
  address: string;
}

const LocationFinder: React.FC<IProps> = ({ address }) => {
  const [coordinates, setCoordinates] = useState<LatLngLiteral | undefined>({
    lat: 0,
    lng: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLatLngFromAddress(address);
      console.log("eventlocatino", address, res)
      setCoordinates(res);
    }
    fetchData();
  }, [address])

  return (
    <div>
      {coordinates && (
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={7}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "182px", borderRadius: "10px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
    </div>
  );
};

export default LocationFinder;
