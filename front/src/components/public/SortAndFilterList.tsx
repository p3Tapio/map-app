import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';

const SortAndFilterList: React.FC<{
  countries: string[];
  setCountryFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  sortCriteria: string;
  setSortCriteria: React.Dispatch<React.SetStateAction<string>>;
  sortDirection: string;
  setSortDirection: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  countries, setCountryFilter, sortCriteria, setSortCriteria, sortDirection, setSortDirection,
}) => {
  const sortingOptions = ['Comments', 'Country', 'Date', 'Favorited', 'Name'];
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          size="sm"
          className="m-1"
        >
          Filter by country
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={(): void => setCountryFilter(undefined)}>All</Dropdown.Item>
          {countries.map((c) => (
            <Dropdown.Item
              key={c}
              onClick={(): void => setCountryFilter(c)}
            >
              {c}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-secondary"
          size="sm"
          className="m-1"
        >
          Sorted by
          {' '}
          {sortCriteria.charAt(0).toLowerCase() + sortCriteria.slice(1)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {sortingOptions.map((s) => (
            <Dropdown.Item
              key={s}
              onClick={(): void => setSortCriteria(s)}
            >
              {s}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <Button
        variant="outline-secondary"
        size="sm"
        className="m-1"
        onClick={(): void => {
          setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
        }}
      >
        {sortDirection === 'asc'
          ? <ChevronUp />
          : <ChevronDown />}
      </Button>
    </>
  );
};

export default SortAndFilterList;
