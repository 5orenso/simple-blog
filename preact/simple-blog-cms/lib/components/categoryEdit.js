import { h, Component } from 'preact';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {
    toggleDropdown: {},
};
const debug = false;
const editMode = 'textarea'; // div

const typeList = [
    { value: 1, title: 'Generell' },
    { value: 2, title: 'Annonse' },
    { value: 3, title: 'Bildegalleri' },
    { value: 4, title: 'Lenker' },
];

export default class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    handleDropdownClick = (event, key) => {
        event.preventDefault();
        const el = event.target;

        let { toggleDropdown } = this.state;
        if (toggleDropdown[key]) {
            toggleDropdown[key] = false;
        } else {
            toggleDropdown[key] = true;
        }
        this.setState({ toggleDropdown });
    }

    render(props) {
        const { toggleDropdown } = this.state;

        const styles = props.styles;
        const messages = props.messages;
        const category = props.category;
        const handleInput = props.handleInput;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;
        const handleClickNew = props.handleClickNew;
        const handleClickBack = props.handleClickBack;

        return (
            <div class='container-fluid col-12'>

                <div class='col-12 sticky-top d-flex justify-content-between'>
                    <div class='col-3'>
                        <button type='button' class='btn btn-warning mr-2' onclick={handleClickBack}><i class='fas fa-arrow-left'></i> Tilbake</button>
                    </div>
                    <div class='col-6 text-center'>
                        <button type='submit' class='btn btn-success mr-2' onClick={handleClickSave}><i class='fas fa-save'></i> Lagre</button>
                    </div>
                    <div class='col-3'>
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, { title: 'Trenger en fin ny tittel' })}>+ Ny kategori</button>
                    </div>
                </div>

                <div class='col-12 fixed-bottom'>
                    <small>
                        <MessagesLite styles={styles} messages={messages} />
                    </small>
                </div>


                <div class='row'>
                    <div class='col-6'>


                        <div class='form-group'>
                            <label for='typeInput' class='text-white-50'>Kategoritype</label>
                            <div class='dropdown'>
                                <button class='btn btn-light dropdown-toggle'
                                    type='button'
                                    onClick={e => this.handleDropdownClick(e, 'type')}
                                >
                                    {category.type ? typeList.find(x => x.value === category.type).title : 'Velg type'}
                                </button>
                                <div class={`dropdown-menu ${toggleDropdown.type ? 'show' : ''}`} style='z-index: 1200;'>
                                    <a class='dropdown-item' href='#'
                                        data-key='type'
                                        data-val=''
                                        onClick={e => {
                                            this.handleDropdownClick(e, 'type');
                                            handleInput(e, {
                                                name: 'type',
                                                value: 0,
                                            });
                                        }}
                                    >
                                        Alle
                                    </a>
                                    {typeList.map(type =>
                                        <a class={`dropdown-item ${category.type === type.value ? 'text-success' : ''}`} href='#'
                                            data-key='type'
                                            data-val={type.title}
                                            onClick={e => {
                                                this.handleDropdownClick(e, 'type');
                                                handleInput(e, {
                                                    name: 'type',
                                                    value: type.value,
                                                });
                                            }}
                                        >
                                            {type.title}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='col-6'>
                        <label for='bodyInput'>Forhåndsvisning</label>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group'>
                            <label for='titleInput'>Tittel</label>
                            <input type='text' class='form-control' id='titleInput' placeholder='Tittel'
                                name='title'
                                onInput={handleInput}
                                value={category.title} />
                        </div>
                        <div class='form-group'>
                            <label for='sortInput'>Sort <i class='fas fa-sort-numeric-up-alt'></i></label>
                            <input type='text' class='form-control' id='sortInput' placeholder=''
                                name='sort'
                                onInput={handleInput}
                                value={category.sort} />
                        </div>
                        <div class='form-group'>
                            <label for='menuInput'>Meny</label>
                            <input type='checkbox' class='form-control' id='menuInput'
                                name='menu'
                                onInput={handleInput}
                                value={1} 
                                checked={category.menu && 'checked'} />
                        </div>

                        <div class='form-group'>
                            <label for='urlInput'>URL</label>
                            <input type='text' class='form-control' id='urlInput' placeholder='url'
                                name='url'
                                onInput={handleInput}
                                value={category.url} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <h1>{category.title}</h1>
                        <h5>{category.url}</h5>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <label for='headerInput'>Header</label>
                    </div>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='header' class={`form-control h-100`} id='headerInput' rows='3'
                                onInput={handleTextareaInput}
                                value={category.header} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div id='headerDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(category.header, category)
                            ),
                        }}></div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <label for='headerInput'>Header detail</label>
                    </div>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='headerDetail' class={`form-control h-100`} id='headerDetailInput' rows='3'
                                onInput={handleTextareaInput}
                                value={category.headerDetail} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div id='headerDetailDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(category.headerDetail, category)
                            ),
                        }}></div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <label for='footerInput'>Footer</label>
                    </div>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='footer' class={`form-control h-100`} id='footerInput' rows='3'
                                onInput={handleTextareaInput}
                                value={category.footer} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div id='footerDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(category.footer, category)
                            ),
                        }}></div>
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <label for='footerInput'>Footer detail</label>
                    </div>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='footerDetail' class={`form-control h-100`} id='footerDetailInput' rows='3'
                                onInput={handleTextareaInput}
                                value={category.footerDetail} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <div id='footerDetailDisplay' dangerouslySetInnerHTML={{
                            __html: utilHtml.replaceMarked(
                                utilHtml.replaceDataTags(category.footerDetail, category)
                            ),
                        }}></div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-12'>
                        <button type='submit' class='btn btn-success' onClick={handleClickSave}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }
}
