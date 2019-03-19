import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
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

        const renderPageNumbers = pageNumbers.map(number => {
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
                            href='#'>Previous</a>
                    </li>
                    {renderPageNumbers}
                    <li class={`page-item ${currentPage < pageNumbers.length ? '' : 'disabled'}`}>
                        <a class='page-link'
                            onClick={handlePaginationIncClick}
                            href='#'>Next</a>
                    </li>
                </ul>
            </nav>
        );
    }
}
