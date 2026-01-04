import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserPagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const goToPage = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, start + maxVisible - 1);

    start = Math.max(0, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              goToPage(i);
            }}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 0) goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages - 1) goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default UserPagination;
