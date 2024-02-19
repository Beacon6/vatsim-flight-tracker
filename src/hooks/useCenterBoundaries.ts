import { useEffect, useState } from 'react';

export default function useCenterBoundaries() {
  const [boundariesRaw, setBoundariesRaw] = useState<{
    features: [
      {
        properties: { id: string };
        geometry: { coordinates: [[[[number, number]]]] };
      }
    ];
  }>();

  useEffect(() => {
    fetch('../fir_boundaries.json')
      .then((res) => res.json())
      .then((data) => setBoundariesRaw(data));
  }, []);

  const [boundaries, setBoundaries] = useState<{
    [stationId: string]: [number, number][];
  }>();

  useEffect(() => {
    if (boundariesRaw) {
      const centerStations: { [stationId: string]: [number, number][] } = {};

      for (let i = 0; i < boundariesRaw?.features.length; i++) {
        const stationId = boundariesRaw.features[i].properties.id;
        centerStations[stationId] = boundariesRaw.features[
          i
        ].geometry.coordinates[0][0].map((coord) => [coord[1], coord[0]]);
      }

      setBoundaries(centerStations);
    }
  }, [boundariesRaw]);

  return { boundaries };
}
