import { useEffect, useState } from 'react';

export default function useCenterBoundaries() {
  const [jsonData, setJsonData] = useState<any>();

  useEffect(() => {
    fetch('../fir_boundaries.json')
      .then((res) => res.json())
      .then((data) => setJsonData(data));
  }, []);

  const [centerBoundaries, setCenterBoundaries] = useState<any>();

  useEffect(() => {
    const atcCenterStations: any = {};

    for (let i = 0; i < jsonData?.features.length; i++) {
      const stationId = jsonData.features[i].properties.id;

      atcCenterStations[stationId] =
        jsonData.features[i].geometry.coordinates[0];
    }

    console.log(atcCenterStations);
    setCenterBoundaries(atcCenterStations);
  }, [jsonData]);

  return { centerBoundaries };
}
