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
    { value: 1, title: 'Forsiden (innstillinger)' },
    { value: 2, title: 'Annonser i artikler' },
    { value: 3, title: 'Annonser på forsiden øvre' },
    { value: 4, title: 'Annonser på forsiden nedre' },
    { value: 5, title: 'Bildegalleri' },
    { value: 6, title: 'Lenker' },
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
                            <label for='imageInput'>Image/logo</label>
                            <input type='text' class='form-control' id='imageInput' placeholder='Image'
                                name='image'
                                onInput={handleInput}
                                value={category.image} />
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
                                onInput={e => {
                                    handleInput(e, {
                                        name: 'menu',
                                        value: category.menu ? 0 : 1,
                                    });
                                }}
                                value={1}
                                checked={category.menu === 1 ? 'checked' : ''} />
                        </div>

                        <div class='form-group'>
                            <label for='hideTopImageInput'>Skjul toppbilde</label>
                            <input type='checkbox' class='form-control' id='hideTopImageInput'
                                name='hideTopImage'
                                onInput={e => {
                                    handleInput(e, {
                                        name: 'hideTopImage',
                                        value: category.hideTopImage ? 0 : 1,
                                    });
                                }}
                                value={1}
                                checked={category.hideTopImage === 1 ? 'checked' : ''} />
                        </div>

                        <div class='form-group'>
                            <label for='hidePrevNextInput'>Skjul forrige-neste linker</label>
                            <input type='checkbox' class='form-control' id='hidePrevNextInput'
                                name='hidePrevNext'
                                onInput={e => {
                                    handleInput(e, {
                                        name: 'hidePrevNext',
                                        value: category.hidePrevNext ? 0 : 1,
                                    });
                                }}
                                value={1}
                                checked={category.hidePrevNext === 1 ? 'checked' : ''} />
                        </div>

                        <div class='form-group'>
                            <label for='hideArticleListInput'>Skjul artikkelliste</label>
                            <input type='checkbox' class='form-control' id='hideArticleListInput'
                                name='hideArticleList'
                                onInput={e => {
                                    handleInput(e, {
                                        name: 'hideArticleList',
                                        value: category.hideArticleList ? 0 : 1,
                                    });
                                }}
                                value={1}
                                checked={category.hideArticleList === 1 ? 'checked' : ''} />
                        </div>

                        <div class='form-group'>
                            <label for='menuInput'>Skjul tittel</label>
                            <input type='checkbox' class='form-control' id='hideTitleInput'
                                name='hideTitle'
                                onInput={e => {
                                    handleInput(e, {
                                        name: 'hideTitle',
                                        value: category.hideTitle ? 0 : 1,
                                    });
                                }}
                                value={1}
                                checked={category.hideTitle ? 'checked' : ''} />
                        </div>
                        

                        <div class='form-group'>
                            <label for='urlInput'><i class='fas fa-link text-muted' /> URL</label>
                            <input type='text' class='form-control' id='urlInput' placeholder='url'
                                name='url'
                                onInput={handleInput}
                                value={category.url} />
                        </div>

                        <div class='form-group'>
                            <label for='colorMenuInput'><i class='fas fa-fill-drip text-muted' /> Text Color Menu</label>
                            <input type='text' class='form-control' id='colorMenuInput' placeholder='colorMenu'
                                name='colorMenu'
                                onInput={handleInput}
                                value={category.colorMenu}
                                style={category.colorMenu && `border: 2px ${category.colorMenu} solid;`}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='colorMainInput'><i class='fas fa-fill-drip text-muted' /> Text Color Main</label>
                            <input type='text' class='form-control' id='colorMainInput' placeholder='colorMain'
                                name='colorMain'
                                onInput={handleInput}
                                value={category.colorMain}
                                style={category.colorMain && `border: 2px ${category.colorMain} solid;`}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='colorBottomInput'><i class='fas fa-fill-drip text-muted' /> Text Color Bottom</label>
                            <input type='text' class='form-control' id='colorBottomInput' placeholder='colorBottom'
                                name='colorBottom'
                                onInput={handleInput}
                                value={category.colorBottom}
                                style={category.colorBottom && `border: 2px ${category.colorBottom} solid;`}
                            />
                        </div>

                        <div class='form-group'>
                            <label for='bgColorMenuInput'><i class='fas fa-paint-roller text-muted' /> Background Color Menu</label>
                            <input type='text' class='form-control' id='bgColorMenuInput' placeholder='bgColorMenu'
                                name='bgColorMenu'
                                onInput={handleInput}
                                value={category.bgColorMenu}
                                style={category.bgColorMenu && `border: 2px ${category.bgColorMenu} solid;`}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='bgColorMainInput'><i class='fas fa-paint-roller text-muted' /> Background Color Main</label>
                            <input type='text' class='form-control' id='bgColorMainInput' placeholder='bgColorMain'
                                name='bgColorMain'
                                onInput={handleInput}
                                value={category.bgColorMain}
                                style={category.bgColorMain && `border: 2px ${category.bgColorMain} solid;`}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='bgColorBottomInput'><i class='fas fa-paint-roller text-muted' /> Background Color Bottom</label>
                            <input type='text' class='form-control' id='bgColorBottomInput' placeholder='bgColorBottom'
                                name='bgColorBottom'
                                onInput={handleInput}
                                value={category.bgColorBottom}
                                style={category.bgColorBottom && `border: 2px ${category.bgColorBottom} solid;`}
                            />
                        </div>

                        <div class='form-group'>
                            <label for='bgImageMenuInput'><i class='far fa-image text-muted' /> Background Image Menu</label>
                            <input type='text' class='form-control' id='bgImageMenuInput' placeholder='bgImageMenu'
                                name='bgImageMenu'
                                onInput={handleInput}
                                value={category.bgImageMenu}
                            />
                        </div>
                        <div class='form-group'>
                            <label for='bgImageMainInput'><i class='far fa-image text-muted' /> Background Image Main</label>
                            <input type='text' class='form-control' id='bgImageMainInput' placeholder='bgImageMain'
                                name='bgImageMain'
                                onInput={handleInput}
                                value={category.bgImageMain} />
                        </div>
                        <div class='form-group'>
                            <label for='bgImageBottomInput'><i class='far fa-image text-muted' /> Background Image Bottom</label>
                            <input type='text' class='form-control' id='bgImageBottomInput' placeholder='bgImageBottom'
                                name='bgImageBottom'
                                onInput={handleInput}
                                value={category.bgImageBottom} />
                        </div>
                    </div>
                    <div class='col-6'>
                        <h1>{category.title}</h1>
                        <h5>{category.url}</h5>

                        <div class='p-2' style={`height: 65px; background-image: url(${category.bgImageMenu}); background-color: ${category.bgColorMenu || this.props.bgColorMenu}; color: ${category.colorMenu};`}>
                            <div class='container'>
                                <div class='row'>
                                    <div class='col-3'>
                                        Name
                                    </div>
                                    <div class='col-3'>
                                        Menu 1
                                    </div>
                                    <div class='col-3'>
                                        Menu 2
                                    </div>
                                    <div class='col-3'>
                                        Menu 3
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class='p-2' style={`height: 400px; background-image: url(${category.bgImageMain}); background-color: ${category.bgColorMain}; color: ${category.colorMain}; overflow: hidden;`}>
                            <div class='container'>
                                <div class='row'>
                                    <div class='col-12'>
                                        <h1>Main</h1>
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                            Ultricies mi eget mauris pharetra et ultrices. Eu sem integer vitae justo eget. 
                                            Felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices. 
                                            Enim diam vulputate ut pharetra sit amet aliquam id diam. 
                                            Cursus turpis massa tincidunt dui ut ornare lectus. 
                                            Vestibulum rhoncus est pellentesque elit ullamcorper dignissim. 
                                            Tristique risus nec feugiat in fermentum posuere urna nec. 
                                            Et leo duis ut diam quam nulla porttitor massa id. 
                                        </p>
                                    </div>
                                </div>
                                <div class='row'>
                                    <div class='col-4'>
                                        <h1>Art 1</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                    <div class='col-4'>
                                        <h1>Art 2</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                    <div class='col-4'>
                                        <h1>Art 3</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='p-2' style={`height: 300px; background-image: url(${category.bgImageBottom}); background-color: ${category.bgColorBottom || '#808080;'}; color: ${category.colorBottom};`}>
                            <div class='container'>
                                <div class='row'>
                                    <div class='col-4'>
                                        <h1>Art 1</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                    <div class='col-4'>
                                        <h1>Art 2</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                    <div class='col-4'>
                                        <h1>Art 3</h1>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <label for='dropdownInput'><i class='fas fa-code text-muted' /> Dropdown</label>
                    </div>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                </div>
                <div class='row'>
                    <div class='col-6'>
                        <div class='form-group h-100'>
                            <textarea name='dropdown' class={`form-control h-100`} id='dropdownInput' rows='3'
                                onInput={handleTextareaInput}
                                value={category.dropdown} />
                        </div>
                    </div>
                    <div class='col-2'>
                        <ul class="nav nav-tabs">
                            <li class="nav-item dropdown show">
                                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">{category.title}</a>
                                <div
                                    id='dropdownDisplay'
                                    dangerouslySetInnerHTML={{
                                        __html: utilHtml.replaceMarked(
                                            utilHtml.replaceDataTags(category.dropdown || '', category)
                                        ).replace(/dropdown-menu/, 'dropdown-menu show'),
                                    }}
                                />
                            </li>
                        </ul>
                    </div>
                    <div class='col-4'>
                        <small>
                            <xmp>
                                {`
<div class="dropdown-menu">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Separated link</a>
</div>`}
                            </xmp>
                        </small>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>
                        <label for='headerInput'><i class='fas fa-code text-muted' /> Header</label>
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
                        <label for='headerInput'><i class='fas fa-code text-muted' /> Header detail</label>
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
                        <label for='footerInput'><i class='fas fa-code text-muted' /> Footer</label>
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
                        <label for='footerInput'><i class='fas fa-code text-muted' /> Footer detail</label>
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
