import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.totalPages = 10;
    }

    makePageArray(allPages) {
        const pages = [];
        const currentPage = this.props.currentPage;

        const total = allPages.length;

        let isPartOfStart = false;
        let start = currentPage - 5;
        if (start <= 1) {
            isPartOfStart = true;
            start = 1;
        }

        let isPartOfEnd = false;
        let end = currentPage + 5;
        if (end >= total) {
            isPartOfEnd = true;
            end = total;
        }

        if (!isPartOfStart) {
            pages.push(1);
            pages.push('.');
        }
        for (let i = start, l = this.totalPages; i <= end; i += 1) {
            pages.push(i);
        }
        if (!isPartOfEnd) {
            pages.push('.');
            pages.push(total);
        }
        return pages;
    }

    render(props) {
        const styles = props.styles;
        const currentPage = props.currentPage;
        const artlistTotal = props.artlistTotal;
        const articlesPerPage = props.articlesPerPage;

        const handlePaginationClick = props.handlePaginationClick;
        const handlePaginationDecClick = props.handlePaginationDecClick;
        const handlePaginationIncClick = props.handlePaginationIncClick;

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(artlistTotal / articlesPerPage); i++) {
            pageNumbers.push(i);
        }
        const pages = this.makePageArray(pageNumbers);

        const renderPageNumbers = pages.map(number => {
            if (number === '.') {
                return (
                    <li class='page-item disabled'>
                        <a class='page-link'>...</a>
                    </li>
                );
            }
            return (
                <li class={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <a class='page-link'
                        id={number}
                        onClick={handlePaginationClick}
                        href='#'>{number}</a>
                </li>
            );
        });

        return (
            <nav aria-label='Page navigation example'>
                <ul class={`pagination ${styles.condensed}`}>
                    <li class={`page-item ${currentPage > 1 ? '' : 'disabled'}`}>
                        <a class='page-link'
                            onClick={handlePaginationDecClick}
                            href='#'><i class="fas fa-arrow-left"></i> Previous</a>
                    </li>
                    {renderPageNumbers}
                    <li class={`page-item ${currentPage <= pageNumbers.length ? '' : 'disabled'}`}>
                        <a class='page-link'
                            onClick={handlePaginationIncClick}
                            href='#'>Next <i class="fas fa-arrow-right"></i></a>
                    </li>
                </ul>
            </nav>
        );
    }
}
