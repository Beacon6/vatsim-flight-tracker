export default function parseRoute(routeString: string): string[] {
    const waypoints = routeString.split(" ");

    for (let i = 0; i < waypoints.length; i++) {
        if (waypoints[i].includes("/")) {
            const idx = waypoints[i].indexOf("/");
            waypoints[i] = waypoints[i].substring(0, idx);
        }
    }

    return waypoints;
}

console.log(parseRoute("waypoint1 waypoint2/restriction  "));
