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
                                <th scope='col'>Type</th>
                                <th scope='col'>Meny</th>
                                <th scope='col'>Sort</th>
                                <th scope='col'>Tittel</th>
                                <th scope='col'>Opprettet</th>
                                <th scope='col'>URL</th>
                            </tr>
                        </thead>
                    <tbody>
                    {catlist.map(cat =>
                        <tr data-id={cat.id} onClick={handleListClick}>
                            <td scope='row'>{cat.id}</td>
                            <td>
                                {cat.type ? typeList.find(x => x.value === cat.type).title : ''}
                            </td>
                            <td>{cat.menu ? 'Ja' : 'Nei'}</td>
                            <td>{cat.sort}</td>
                            <td>{cat.title}</td>
                            <td>
                                {util.isoDateNormalized(cat.createdDate)}<br />
                                {cat.createdDate !== cat.updatedDate && <span class='text-muted'>
                                    <small><i class="fas fa-user-edit"></i> {util.isoDateNormalized(cat.updatedDate)}</small>
                                </span>}
                            </td>
                            <td>{cat.url}</td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
