import { h, Component } from 'preact';

import MessagesLite from '../messagesLite';

import util from '../../util';

const initialState = {

};

const debug = false;

function pad(n) {
    return (n.length < 2) ? `0${n}` : n;
}

function isImage(filename = '') {
    return filename.match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);
}

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render() {
        const {
        } = this.state;

        const {
            article,
            currentMenu,
            handleMenuClick,
        } = this.props;

        const images = article.img || [];
        const imagesTotal = images.length;

        return (<nav class='nav nav-pills nav-fill mb-3 sticky-top bg-light'>
            <a class={`nav-item nav-link ${currentMenu === 'preview' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='preview'><i class='fas fa-eye' /> Forhåndsvisning</a>
            <a class={`nav-item nav-link ${currentMenu === 'frontpagepreview' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='frontpagepreview'><i class='fas fa-eye' /> I lister</a>
            <a class={`nav-item nav-link ${currentMenu === 'images' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='images'><i class='fas fa-images' /> Bilder ({imagesTotal})</a>
            <a class={`nav-item nav-link ${currentMenu === 'youtube' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='youtube'><i class='fas fa-video' /> Youtube</a>
            <a class={`nav-item nav-link ${currentMenu === 'links' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='links'><i class='fas fa-link' /> Lenker</a>
            <a class={`nav-item nav-link ${currentMenu === 'meta' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='meta'><i class='fas fa-tags' /> Meta</a>
            <a class={`nav-item nav-link ${currentMenu === 'markdown' ? 'active' : ''}`} href='#'
                onClick={handleMenuClick} data-menu='markdown'><i class='fas fa-code' /> Annet</a>
        </nav>);
    }
}
