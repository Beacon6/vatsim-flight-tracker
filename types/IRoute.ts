export interface IRoute {
  waypoints: {
    waypoint_identifier: string;
    waypoint_name: string;
    waypoint_latitude: number;
    waypoint_longitude: number;
  }[];
}
