import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class IotList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const iotlist = props.iotlist;
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
                            + Ny Iot query
                        </button>
                    </div>
                    <table class={`table table-sm table-striped ${styles.condensed}`}>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Tittel</th>
                                <th scope='col'>Alias</th>
                                <th scope='col'>Type</th>
                            </tr>
                        </thead>
                    <tbody>
                    {iotlist.map(iot =>
                        <tr data-id={iot.id} onClick={handleListClick}>
                            <td scope='row'>{iot.id}</td>
                            <td>{iot.title}</td>
                            <td>{iot.alias}</td>
                            <td>{iot.type}</td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
