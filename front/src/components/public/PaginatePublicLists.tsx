import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { PaginatePublicListProps } from './publicListTypes';

const PaginatePublicLists: React.FC<PaginatePublicListProps> = ({
  listsPerPage, totalLists, setCurrentPage, currentPage, setActive, active,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalLists / listsPerPage); i += 1) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <hr />
      <nav className="d-flex justify-content-center">
        <button
          className="paginationArrowBtn"
          type="button"
          onClick={(): void => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              setActive(active - 1);
            }
          }}
        >
          <ChevronLeft />
        </button>
        <ul className="pagination ">
          {pageNumbers.map((no) => (
            <li className="page-item" key={no}>
              <button
                style={no === active ? { backgroundColor: '#eee' } : {}}
                className="page-link"
                type="button"
                onClick={(): void => {
                  setCurrentPage(no);
                  setActive(no);
                }}
              >
                {no}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="paginationArrowBtn"
          type="button"
          onClick={(): void => {
            if (currentPage < Math.ceil(totalLists / listsPerPage)) {
              setCurrentPage(currentPage + 1);
              setActive(active + 1);
            }
          }}
        >
          <ChevronRight />
        </button>
      </nav>
    </div>
  );
};

export default PaginatePublicLists;
