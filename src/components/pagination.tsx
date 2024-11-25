import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from 'lucide-react'
  import { Button } from './ui/button'
  
  export interface PaginationProps {
    pageIndex: number
    totalCount: number
    perPage: number
    onPageChange: (newPage: number) => void
  }
  
  export function Pagination({
    pageIndex,
    totalCount,
    perPage,
    onPageChange,
  }: PaginationProps) {
    const pages = Math.ceil(totalCount / perPage) || 1
  
    const handleFirstPage = () => {
      if (pageIndex > 0) onPageChange(0)
    }
  
    const handlePreviousPage = () => {
      if (pageIndex > 0) onPageChange(pageIndex - 1)
    }
  
    const handleNextPage = () => {
      if (pageIndex < pages - 1) onPageChange(pageIndex + 1)
    }
  
    const handleLastPage = () => {
      if (pageIndex < pages - 1) onPageChange(pages - 1)
    }
  
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total de {totalCount} item(s)
        </span>
  
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="text-sm font-medium">
            Página {pageIndex + 1} de {pages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleFirstPage}
              disabled={pageIndex === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handlePreviousPage}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleNextPage}
              disabled={pageIndex >= pages - 1}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleLastPage}
              disabled={pageIndex >= pages - 1}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }
  