import { h, Component } from 'preact';

import linkstate from 'linkstate';

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
            that,
            article,
            handleClickCode,
        } = this.props;

        return (<div class='col-12'>
            <h5>Legg til Youtube video:</h5>
            <ul class='list-group'>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, idx) =>
                    <li class={`list-group-item list-group-item-action flex-column align-items-start ${idx % 2 > 0 ? 'list-group-item-secondary' : ''}`}>
                        <div class='form-group row'>
                            <div class='col-5'>
                                <label for='youtubeTitle'>Tittel</label>
                                <input class='form-control' id='youtubeTitle'
                                    onInput={linkstate(that, `article.youtubeVideos.${val}.title`)}
                                    value={util.getString(article, 'youtubeVideos', val, 'title')}
                                />
                            </div>
                            <div class='col-7'>
                                <label for='youtubeText'>Tekst</label>
                                <input class='form-control' id='youtubeText'
                                    onInput={linkstate(that, `article.youtubeVideos.${val}.text`)}
                                    value={util.getString(article, 'youtubeVideos', val, 'text')}
                                />
                            </div>
                            <div class='col-8'>
                                <label for='youtube'>YouTube URL</label>
                                <input class='form-control' id='youtube'
                                    onInput={linkstate(that, `article.youtubeVideos.${val}.url`)}
                                    value={util.getString(article, 'youtubeVideos', val, 'url')}
                                    placeholder='Link til Youtube video'
                                />
                                <small id='youtubeHelp' class='form-text text-muted'>Youtube watch URL.</small>
                            </div>
                            <div class='col-4'>
                                <label>&nbsp;</label>
                                <button class='form-control btn btn-dark m-1'
                                    onClick={handleClickCode}
                                    data-content={`![${util.getString(article, 'youtubeVideos', val, 'title')}](${util.getString(article, 'youtubeVideos', val, 'url')} '${util.getString(article, 'youtubeVideos', val, 'text')}')\n`}>
                                    Sett inn video i tekst
                                </button>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>);
    }
}
