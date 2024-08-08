import { useEffect, useState } from 'react';

import { AirportsInterface } from '../../types/AirportsInterface';
import { ControllersInterface } from '../../types/ControllersInterface';

interface Props {
  vatsimControllers?: ControllersInterface['controllers'];
  airports?: AirportsInterface['airports'];
}

function Controllers(props: Props) {
  const { vatsimControllers, airports } = props;

  const [displayedControllers, setDisplayedControllers] = useState<ControllersInterface['controllers']>();

  useEffect(() => {
    console.log(airports);
  }, [vatsimControllers, airports]);

  // Grab the list of currently logged in controllers
  // Filter out bad entries
  // Get airport coords
  // Profit

  return <></>;
}

export default Controllers;
