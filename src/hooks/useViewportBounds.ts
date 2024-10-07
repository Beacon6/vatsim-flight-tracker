import { LatLngBounds, Map } from "leaflet";
import { useState } from "react";
import { useMapEvent } from "react-leaflet";

function useViewportBounds(map: Map) {
    const [viewportBounds, setViewportBounds] = useState<LatLngBounds>();

    if (!viewportBounds) {
        setViewportBounds(map.getBounds());
    }

    const mapMovementHandler = useMapEvent("moveend", () => {
        setViewportBounds(mapMovementHandler.getBounds());
    });

    return viewportBounds;
}

export default useViewportBounds;
