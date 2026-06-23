'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from './button';
import { cn } from '@/lib/utils';


type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  className?: string;
};


export function Pagination({
  currentPage,
  totalPages,
  baseUrl = '',
  className,
}: PaginationProps) {


  const searchParams = useSearchParams();


  const createPageUrl = (page:number) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(
      'page',
      page.toString()
    );

    return `${baseUrl}?${params.toString()}`;
  };



  const getVisiblePages = () => {

    const pages:(number | 'ellipsis')[] = [];


    if(totalPages <= 7){
      return Array.from(
        {length: totalPages},
        (_,i)=>i+1
      );
    }


    if(currentPage <= 3){

      pages.push(
        1,
        2,
        3,
        4,
        'ellipsis',
        totalPages
      );

    }
    else if(currentPage >= totalPages - 2){

      pages.push(
        1,
        'ellipsis',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );

    }
    else {

      pages.push(
        1,
        'ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis',
        totalPages
      );

    }


    return pages;

  };



  const visiblePages = getVisiblePages();



  return (

    <nav
      className={cn(
        'flex items-center justify-center gap-1',
        className
      )}
      aria-label="Pagination"
    >


      {
        currentPage > 1 ? (

          <Button
            variant="outline"
            size="icon"
            asChild
            aria-label="Previous page"
          >
            <Link
              href={createPageUrl(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4"/>
            </Link>
          </Button>

        ) : (

          <Button
            variant="outline"
            size="icon"
            disabled
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4"/>
          </Button>

        )
      }




      <div className="hidden sm:flex items-center gap-1">

        {
          visiblePages.map((page,i)=>{


            if(page === 'ellipsis'){

              return (

                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-muted-foreground"
                >
                  <MoreHorizontal className="w-4 h-4"/>
                </span>

              );

            }



            return (

              <Button
                key={page}
                variant={
                  currentPage === page
                  ? 'default'
                  : 'outline'
                }
                size="icon"
                asChild
                aria-label={`Page ${page}`}
                aria-current={
                  currentPage === page
                  ? 'page'
                  : undefined
                }
              >

                <Link
                  href={createPageUrl(page)}
                >
                  {page}
                </Link>

              </Button>

            );

          })
        }

      </div>




      <div className="sm:hidden text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>




      {
        currentPage < totalPages ? (

          <Button
            variant="outline"
            size="icon"
            asChild
            aria-label="Next page"
          >

            <Link
              href={createPageUrl(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4"/>
            </Link>

          </Button>


        ) : (

          <Button
            variant="outline"
            size="icon"
            disabled
            aria-label="Next page"
          >

            <ChevronRight className="w-4 h-4"/>

          </Button>

        )
      }



    </nav>

  );

}