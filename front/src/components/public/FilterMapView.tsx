import React from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { List } from '../../state/reducers/list/listTypes';

const FilterMapView: React.FC<{
  publicLists: List[];
  setMapView: React.Dispatch<React.SetStateAction<string>>;
}> = ({ publicLists, setMapView }) => {
  let regionsInUse: string[] = publicLists.map((r) => {
    if (r.subregion.includes('Africa')) return 'Africa';
    if (r.subregion.includes('Europe')) return 'Europe';
    if (r.subregion.includes('Asia')) return 'Asia';
    if (r.subregion.includes('Australia')) return 'Australia';
    if (r.subregion === 'Central America' || r.subregion === 'North America') return 'North and Central America';
    return r.subregion;
  });

  regionsInUse = Array.from(new Set(regionsInUse.map((r) => r))).filter((r) => r !== 'unknown').concat('World');
  const regionOptions = ['World', 'Africa', 'Australia', 'Asia', 'Europe', 'North and Central America', 'South America'];
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          size="sm"
          className="m-1"
        >
          Choose region
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {regionOptions.map((r) => (regionsInUse.includes(r)
            ? <ActiveOption key={r} option={r} setMapView={setMapView} />
            : <DisabledOption key={r} option={r} />))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

const ActiveOption: React.FC<{
  option: string;
  setMapView: React.Dispatch<React.SetStateAction<string>>;
}> = ({ option, setMapView }) => (
  <Dropdown.Item
    onClick={(): void => setMapView(option)}
  >
    {option}
  </Dropdown.Item>
);
const DisabledOption: React.FC<{ option: string }> = ({ option }) => (
  <OverlayTrigger
    placement="auto"
    overlay={(
      <Tooltip id="editTooltip">
        Nothing here yet!
      </Tooltip>
    )}
  >
    <Dropdown.Item style={{ color: 'gray' }}>
      {option}
    </Dropdown.Item>
  </OverlayTrigger>
);

export default FilterMapView;
