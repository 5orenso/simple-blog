import { h, Component } from 'preact';

import ImageUpload from './imageUpload';

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
        const category = props.category;
        const handleInput = props.handleInput;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;

        return (
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-12'>
                        <h3>Redigering</h3>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
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
                                onKeyup={handleInput}
                                onPaste={handleInput}
                                value={category.title} />
                        </div>
                        <div class='form-group'>
                            <label for='urlInput'>URL</label>
                            <input type='text' class='form-control' id='urlInput' placeholder='url'
                                name='url'
                                onKeyup={handleInput}
                                onPaste={handleInput}
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
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='header' class={`form-control h-100`} id='headerInput' rows='3'
                                onKeyup={handleTextareaInput}
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
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='headerDetail' class={`form-control h-100`} id='headerDetailInput' rows='3'
                                onKeyup={handleTextareaInput}
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
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='footer' class={`form-control h-100`} id='footerInput' rows='3'
                                onKeyup={handleTextareaInput}
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
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='footerDetail' class={`form-control h-100`} id='footerDetailInput' rows='3'
                                onKeyup={handleTextareaInput}
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
