import { useEffect, useState } from 'react';
import { CenterBoundaries } from '../typings/VatsimData';

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

  const [centerBoundaries, setCenterBoundaries] = useState<CenterBoundaries>();

  useEffect(() => {
    if (boundariesRaw) {
      const sectors: CenterBoundaries = {};

      for (let i = 0; i < boundariesRaw?.features.length; i++) {
        const centerId = boundariesRaw.features[i].properties.id;
        sectors[centerId] = boundariesRaw.features[
          i
        ].geometry.coordinates[0][0].map((coord) => [coord[1], coord[0]]);
      }

      setCenterBoundaries(sectors);
    }
  }, [boundariesRaw]);

  return centerBoundaries;
}
