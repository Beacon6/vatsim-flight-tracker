export default function parseRoute(routeString: string): string[] {
  const flightPlan = routeString.split(" ");
  const waypoints = [];

  for (let element of flightPlan) {
    if (element.includes("/")) {
      const idx = element.indexOf("/");
      element = element.substring(0, idx);
    }

    if (element.length === 0 || element === "DCT") {
      continue;
    }

    waypoints.push(element);
  }

  return waypoints;
}
