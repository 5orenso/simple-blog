import { h, Component } from 'preact';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {};
const debug = false;
const editMode = 'textarea'; // div

export default class CategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
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
                        &nbsp;
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
