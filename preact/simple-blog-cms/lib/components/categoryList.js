import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const catlist = props.catlist;
        const handleCatlistClick = props.handleCatlistClick;
        return (
            <div class='col-12'>
                <table class={`table table-sm ${styles.condensed}`}>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Tittel</th>
                            <th scope='col'>Opprettet</th>
                            <th scope='col'>URL</th>
                        </tr>
                    </thead>
                <tbody>
                {catlist.map(cat =>
                    <tr data-id={cat.id} onClick={handleCatlistClick}>
                        <td scope='row'>{cat.id}</td>
                        <td>{cat.title}</td>
                        <td>{util.isoDateNormalized(cat.createdDate)}</td>
                        <td>{cat.url}</td>
                    </tr>
                )}
                </tbody>
                </table>
            </div>
        );
    }
}
