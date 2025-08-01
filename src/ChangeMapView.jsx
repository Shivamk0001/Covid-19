// ChangeMapView.jsx
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function ChangeMapView({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

export default ChangeMapView;
