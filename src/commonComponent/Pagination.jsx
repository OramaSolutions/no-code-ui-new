// import Pagination from "react-js-pagination";

// export const Commonpagination = ({ ActivePage, ItemsCountPerPage, TotalItemsCount, PageRangeDisplayed, Onchange }) => {
//      return (
//         <div>
//             <Pagination
//                 activePage={ActivePage}
//                 itemsCountPerPage={ItemsCountPerPage}
//                 totalItemsCount={TotalItemsCount}            
//                 pageRangeDisplayed={PageRangeDisplayed}
//                 onChange={Onchange}
//                 itemClass="page-item"
//                 linkClass="page-link"
//             />
//         </div>
//     )

// }

import ReactPaginate from 'react-paginate';

export const Commonpagination = ({ 
    ActivePage, 
    ItemsCountPerPage, 
    TotalItemsCount, 
    PageRangeDisplayed, 
    Onchange 
}) => {
    // Calculate total number of pages
    const pageCount = Math.ceil(TotalItemsCount / ItemsCountPerPage);
    
    // Handle page change - react-paginate uses 0-based indexing
    const handlePageClick = (event) => {
        Onchange(event.selected + 1); // Convert to 1-based for your parent component
    };

    return (
        <div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                previousLabel="< Prev"
                onPageChange={handlePageClick}
                pageRangeDisplayed={PageRangeDisplayed}
                pageCount={pageCount}
                forcePage={ActivePage - 1} // Convert from 1-based to 0-based
                renderOnZeroPageCount={null}
                
                // Bootstrap classes for styling
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
            />
        </div>
    );
};
