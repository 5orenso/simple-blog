import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class ArticleList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const artlist = props.artlist;
        const handleArtlistClick = props.handleArtlistClick;
        const articleId = props.articleId;

        return (
            <div class='col-12'>
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
                        <th scope='row'>{art.id}</th>
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
