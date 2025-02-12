import { Link, router } from '@inertiajs/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { PaginationLink as LinkProp } from '@/types/data-table'

export function TablePagination({ links }: { links: LinkProp[] }) {
  function handleNavigation(url: string | null) {
    if (url === null) return

    router.visit(url, { preserveScroll: true })
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={links[0].url === null}
            onClick={() => handleNavigation(links[0].url)}
            className="cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-default aria-disabled:hover:bg-transparent"
          />
        </PaginationItem>

        {links
          .filter(link => !link.label.includes('Next') && !link.label.includes('Previous'))
          .map((link, index) => {
            return (
              <PaginationItem key={index}>
                {link.active ? (
                  <PaginationLink href="#" isActive>
                    {link.label}
                  </PaginationLink>
                ) : (
                  <PaginationLink
                    aria-disabled={link.url === null}
                    onClick={() => handleNavigation(link.url)}
                    className="cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-default aria-disabled:hover:bg-transparent"
                  >
                    {link.label}
                  </PaginationLink>
                )}
              </PaginationItem>
            )
          })}

        <PaginationItem>
          <PaginationNext
            aria-disabled={links[links.length - 1].url === null}
            onClick={() => handleNavigation(links[links.length - 1].url)}
            className="cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-default aria-disabled:hover:bg-transparent"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
