import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';

interface Props {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  nextPage: number | null;
  prevPage: number | null;
}

const GROUP_PAGINATION = 1;

export const CustomPagination = ({ totalPages, currentPage, handlePageChange, nextPage, prevPage }: Props) => {
  const paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  let paginationToDisplay = [
    1,
    ...paginationArray.slice(
      Math.max(1, currentPage - 1 - GROUP_PAGINATION),
      Math.min(totalPages - 1, currentPage + GROUP_PAGINATION)
    ),
    totalPages
  ];

  if (paginationToDisplay[1] - paginationToDisplay[0] > 1) paginationToDisplay.splice(1, 0, 0);

  if (paginationToDisplay.at(-1)! - paginationToDisplay.at(-2)! > 1) {
    paginationToDisplay.splice(paginationToDisplay.length - 1, 0, 0);
  }

  return (
    <Pagination className="py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={!prevPage} onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
        </PaginationItem>
        {paginationToDisplay.map((page, index) => (
          <PaginationItem key={index}>
            {page === 0 ? (
              <PaginationEllipsis></PaginationEllipsis>
            ) : (
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                disabled={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={!nextPage}
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
