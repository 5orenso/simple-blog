import { h, Component } from 'preact';

import util from '../util';

const initialState = {
    toggleDropdown: {},
};
const debug = false;

export default class ArticleList extends Component {
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

    handleSearchKeypress = (event) => {
        if (event.key === 'Enter') {
            this.props.handleSubmit(event);
        } else {
            this.props.handleInput(event);
        }
    };

    render(props) {
        const styles = props.styles;
        const artlist = props.artlist;
        const catlist = props.catlist;
        const handleArtlistClick = props.handleArtlistClick;
        const handleFilterClick = props.handleFilterClick;
        const handleInput = props.handleInput;
        const handleSubmit = props.handleSubmit;
        const articleId = props.articleId;
        const filter = props.filter;

        const { toggleDropdown } = this.state;

        const statuslist = [
            { value: 1, title: 'I arbeid' },
            { value: 2, title: 'Live' },
        ];

        return (
            <div class='col-12'>
                <div class='row mb-2'>

                    <div class="col-5 col-sm-3 col-md-2">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle"
                                type="button"
                                onClick={e => this.handleDropdownClick(e, 'category')}
                            >
                                {filter.category ? filter.category : 'Velg kategori'}
                            </button>
                            <div class={`dropdown-menu ${toggleDropdown.category ? 'show' : ''}`} style='z-index: 1200;'>
                                <a class="dropdown-item" href="#"
                                    data-key='category'
                                    data-val=''
                                    onClick={e => {
                                        this.handleDropdownClick(e, 'category');
                                        handleFilterClick(e);
                                    }}
                                >
                                    Alle
                                </a>
                                {catlist.map(cat =>
                                    <a class={`dropdown-item ${filter.category === cat.title ? 'text-success' : ''}`} href="#"
                                        data-key='category'
                                        data-val={cat.title}
                                        onClick={e => {
                                            this.handleDropdownClick(e, 'category');
                                            handleFilterClick(e);
                                        }}
                                    >
                                        {cat.title}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div class="col-5 col-sm-3 col-md-2">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle"
                                type="button"
                                onClick={e => this.handleDropdownClick(e, 'status')}
                            >
                                {filter.status ?
                                    statuslist.find(x => x.value === filter.status).title : 'Velg status'}
                            </button>
                            <div class={`dropdown-menu ${toggleDropdown.status ? 'show' : ''}`} style='z-index: 1200;'>
                                <a class="dropdown-item" href="#"
                                    data-key='status'
                                    data-val=''
                                    onClick={e => {
                                        this.handleDropdownClick(e, 'status');
                                        handleFilterClick(e);
                                    }}
                                >
                                    Alle
                                </a>
                                {statuslist.map(stat =>
                                    <a class={`dropdown-item ${filter.status === stat.value ? 'text-success' : ''}`} href="#"
                                        data-key='status'
                                        data-val={stat.value}
                                        onClick={e => {
                                            this.handleDropdownClick(e, 'status');
                                            handleFilterClick(e);
                                        }}
                                    >
                                        {stat.title}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>



                    <div class="col-9 col-sm-4">
                        <input type="text" class="form-control" placeholder="Søk etter artikler" name="q"
                            onChange={handleInput}
                            onKeypress={handleInput}
                        />
                    </div>
                    <div class="col-3 col-sm-2">
                        <button class="btn btn-success" onclick={handleSubmit}><i class="fas fa-search"></i> Søk</button>
                    </div>

                </div>
                <table class={`table table-sm ${styles.condensed}`}>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Kategori</th>
                            <th scope='col'>Tittel</th>
                            <th scope='col'>Pub.dato</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Forfatter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artlist.map(art =>
                            <tr data-id={art.id} class={articleId == art.id ? 'bg-primary text-white' : ''} onClick={handleArtlistClick}>
                                <td scope='row'>{art.id}</td>
                                <td>{art.category}</td>
                                <td>{art.title}</td>
                                <td>{util.isoDateNormalized(art.published)}</td>
                                <td><span class={`badge badge-${util.getStatusClass(art.status)} p-2`}>{util.getStatus(art.status)}</span></td>
                                <td>{art.author}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}
