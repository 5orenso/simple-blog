import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

const typeList = [
    { value: 1, title: 'Forsiden (innstillinger)' },
    { value: 2, title: 'Annonser i artikler' },
    { value: 3, title: 'Annonser på forsiden øvre' },
    { value: 4, title: 'Annonser på forsiden nedre' },
    { value: 5, title: 'Bildegalleri' },
    { value: 6, title: 'Lenker' },
];

export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const catlist = props.catlist;
        const handleListClick = props.handleListClick;
        const handleClickNew = props.handleClickNew;

        return (
            <div class='col-12'>
                <div class='row mb-2'>
                    <div class="col-12 col-sm-10 col-md-10">
                        &nbsp;
                    </div>
                    <div class="col-12 col-sm-2 col-md-2 text-right mb-2">
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, { title: 'Trenger en fin ny tittel' })}>
                            + Ny kategori
                        </button>
                    </div>
                    <table class={`table table-sm ${styles.condensed}`}>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Bilde</th>
                                <th scope='col'>Tittel</th>
                                <th scope='col'>Meny</th>
                                <th scope='col'>Skjul tittel i menyen</th>
                                <th scope='col'>Skjul toppbilde</th>
                                <th scope='col'>Skjul forrige-neste linker</th>
                                <th scope='col'>Skjul artikkelliste</th>
                                <th scope='col'>Sort</th>
                                <th scope='col'>Type</th>
                                <th scope='col'>URL</th>
                                <th scope='col'>Opprettet</th>
                            </tr>
                        </thead>
                    <tbody>
                    {catlist.map(cat =>
                        <tr data-id={cat.id} onClick={handleListClick} class={`${!cat.menu && cat.type !== 1 && 'text-muted'} 
                            ${cat.type === 1 && 'bg-info text-white'} ${cat.menu && 'font-weight-bolder'} `}>
                            <td scope='row'>{cat.id}</td>
                            <td>{cat.image && <img src={cat.image} style='max-height: 30px;' />}</td>
                            <td>
                                {cat.menu > 0 && <i class='fas fa-bars mr-2' />}
                                {[2, 3, 4].indexOf(cat.type) !== -1 && <i class='fas fa-ad mr-2' />}
                                {[1].indexOf(cat.type) !== -1 && <i class='fas fa-cogs mr-2' />}
                                {[5].indexOf(cat.type) !== -1 && <i class='fas fa-image mr-2' />}
                                {[6].indexOf(cat.type) !== -1 && <i class='fas fa-link mr-2' />}
                                {!cat.type && !cat.menu && <i class='fas fa-question mr-2' />}

                                {cat.title}
                            </td>
                            <td>{cat.menu ? 'Ja' : 'Nei'}</td>
                            <td>{cat.hideTitle ? 'Ja' : 'Nei'}</td>
                            <td>{cat.hideTopImage ? 'Ja' : 'Nei'}</td>
                            <td>{cat.hidePrevNext ? 'Ja' : 'Nei'}</td>
                            <td>{cat.hideArticleList ? 'Ja' : 'Nei'}</td>
                            <td>{cat.sort}</td>
                            <td>
                                {cat.type ? typeList.find(x => x.value === cat.type).title : ''}
                            </td>
                            <td>{cat.url}</td>
                            <td>
                                {util.isoDateNormalized(cat.createdDate)}<br />
                                {cat.createdDate !== cat.updatedDate && <span class='text-muted'>
                                    <small><i class="fas fa-user-edit"></i> {util.isoDateNormalized(cat.updatedDate)}</small>
                                </span>}
                            </td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
