import {
  Pagination,
  PaginationContent,
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

export const CustomPagination = ({ totalPages, currentPage, handlePageChange, nextPage, prevPage }: Props) => {
  return (
    <Pagination className="py-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={!prevPage} onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              disabled={currentPage === page}
            >
              {page}
            </PaginationLink>
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
