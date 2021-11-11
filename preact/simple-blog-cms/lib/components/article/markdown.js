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
            handleClickCode,
            markdownTable,
            markdownQuote,
            markdownCode,
        } = this.props;

        return (<div class='col-12'>
            <h5>Annen markdown som er kjekk å vite om:</h5>
            <div class='form-group row mt-4'>
                <div class='col-sm-2'>
                    <label for='link'>Tabell</label>
                </div>
                <div class='col-sm-10'>
                    <input class='form-control'
                        onInput={linkstate(this, `markdown.tableTitle`)}
                        value={util.getString(this, 'state', 'markdown', 'tableTitle')}
                        placeholder='Tittel på tabellen...'
                    />
                    <textarea class='form-control'
                        onInput={linkstate(this, `markdown.tableCsv`)}
                        value={util.getString(this, 'state', 'markdown', 'tableCsv')}
                        placeholder='Klipp og lim fra Excel...'
                    />
                </div>
                <div class='offset-sm-2 col-sm-10'>
                    <button class='form-control btn btn-dark m-1'
                        onClick={handleClickCode}
                        data-content={markdownTable(
                            util.getString(this, 'state', 'markdown', 'tableCsv'),
                            util.getString(this, 'state', 'markdown', 'tableTitle'),
                        )}>
                        Sett inn tabell
                    </button>
                </div>
            </div>

            <div class='form-group row mt-4'>
                <div class='col-sm-2'>
                    <label for='link'>Sitat</label>
                </div>
                <div class='col-sm-10'>
                    <textarea class='form-control'
                        onInput={linkstate(this, `markdown.quote`)}
                        value={util.getString(this, 'state', 'markdown', 'quote')}
                        placeholder='Skriv inn sitat...'
                    />
                </div>
                <div class='offset-sm-2 col-sm-10'>
                    <button class='form-control btn btn-dark m-1'
                        onClick={handleClickCode}
                        data-content={markdownQuote(util.getString(this, 'state', 'markdown', 'quote'))}>
                        Sett inn sitat
                    </button>
                </div>
            </div>

            <div class='form-group row mt-4'>
                <div class='col-sm-2'>
                    <label for='link'>Kode</label>
                </div>
                <div class='col-sm-10'>
                    <select class='form-control'
                        onInput={linkstate(this, `markdown.codeLanguage`)}
                        value={util.getString(this, 'state', 'markdown', 'codeLanguage')}
                    >
                        <option value=''>-- velg språk ---</option>
                        <option>arduino</option>
                        <option>bash</option>
                        <option>c++</option>
                        <option>css</option>
                        <option>excel</option>
                        <option>diff</option>
                        <option>go</option>
                        <option>html</option>
                        <option>javascript</option>
                        <option>json</option>
                        <option>markdown</option>
                        <option>perl</option>
                        <option>php</option>
                        <option>python</option>
                        <option>rust</option>
                        <option>sql</option>
                        <option>yaml</option>
                    </select>
                    <textarea class='form-control'
                        onInput={linkstate(this, `markdown.code`)}
                        value={util.getString(this, 'state', 'markdown', 'code')}
                        placeholder='Skriv inn kodelinjene dine...'
                    />
                </div>
                <div class='offset-sm-2 col-sm-10'>
                    <button class='form-control btn btn-dark m-1'
                        onClick={handleClickCode}
                        data-content={markdownCode(util.getString(this, 'state', 'markdown', 'code'), util.getString(this, 'state', 'markdown', 'codeLanguage'))}>
                        Sett inn koden
                    </button>
                </div>
            </div>
        </div>);
    }
}
