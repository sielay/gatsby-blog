import * as React from 'react';
import { times } from 'lodash';
import { Link } from 'gatsby';

export const BlogPagination = ({ pageCount, pathname }) => {
    if (pageCount === 1) {
        return null;
    }
    const activeItem = pathname.startsWith('/blog/page/')
        ? pathname.split('/')[3]
        : '1';

    return (
        <ul>
            {times(pageCount, index => {
                const pageIndex = (index + 1).toString();
                const rangeStep = pageCount < 10 ? 5 : 3;
                const isInRange =
                    +pageIndex - rangeStep < +activeItem &&
                    +pageIndex + rangeStep > +activeItem;
                const isLastPage = +pageIndex === pageCount;
                const isFirstPage = +pageIndex === 1;
                if (isInRange || isFirstPage || isLastPage) {
                    return (
                        <li
                            key={index}
                            className={activeItem === pageIndex ? 'active' : ''}
                        >
                            <Link
                                key={pageIndex}
                                style={{ cursor: 'pointer' }}
                                to={`/blog/page/${pageIndex}/`}
                                name={pageIndex}
                            >
                                {pageIndex}
                            </Link>
                        </li>
                    );
                }
                return +pageIndex === pageCount - 1 || +pageIndex === 2 ? (
                    <li key={index} disabled>...</li>
                ) : null;
            })}
        </ul>
    );
};
