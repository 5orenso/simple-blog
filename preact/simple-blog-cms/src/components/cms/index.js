import { h, Component } from 'preact';

import styles from './style.css';
import util from '../../../lib/util';
import ProgressBar from '../../../lib/components/progressbar';

const widgetName = 'simpleBlogCms';
const debug = true;
const initialState = {
    infoStatus: '',
    loadingProgress: 0,
    article: {},
    artlist: [],
};

export default class SimpleBlogCms extends Component {
    constructor($props) {
        const props = $props;
        if (props.apiServer.length < 1) {
            props.apiServer = `${window.location.protocol}//${window.location.host}`;
        }
        super(props);
        this.state = util.getResetState(this.state, initialState);

        util.fetchApi('/api/article/', {}, this)
            .then((result) => {
                this.setState({
                    article: result.article,
                    artlist: result.artlist,
                })
            });
    }

    // - - - [ Functions ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentCleanup() {
        if (debug) {
            console.log(widgetName, 'componentCleanup');
        }
        // this.saveHistoryToLocalStorage('productsInBasket', []);
    }

    // - - - [ Events ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // eslint-disable-next-line
    handleSelectRegister = (event) => {
        event.preventDefault();
    }

    // - - - [ Component events from Preact it self: ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentWillMount() {
        if (debug) {
            console.log(widgetName, 'componentWillMount', this.props);
        }
    }

    componentDidMount() {
        if (debug) {
            console.log(widgetName, 'componentDidMount', this.props);
        }
        window.addEventListener('beforeunload', () => this.componentCleanup());
    }

    componentWillUnmount() {
        if (debug) {
            console.log(widgetName, 'componentWillUnmount', this.props);
        }
        this.componentCleanup();
    }

    // Every time something happens:
    shouldComponentUpdate(nextProps, nextState) {
        if (debug) {
            console.log(widgetName, 'shouldComponentUpdate', this.props, nextProps, nextState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (debug) {
            console.log(widgetName, 'componentDidUpdate', prevProps, prevState, this.state);
        }
    }

    // Render the shit:
    render() {
        return (
            <div class="container">
                <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                <div class="row">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Handle</th>
                                </tr>
                            </thead>
                        <tbody>
                        {this.state.artlist.map(art =>
                            <tr>
                                <th scope="row">{art.id}</th>
                                <td>{art.title}</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                        )}
                        </tbody>
                        </table>

                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <form>
                            <div class="form-group">
                                <label for="exampleFormControlInput1">Email address</label>
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Example select</label>
                                <select class="form-control" id="exampleFormControlSelect1">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect2">Example multiple select</label>
                                <select multiple class="form-control" id="exampleFormControlSelect2">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Example textarea</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheck" />
                                    <label class="form-check-label" for="gridCheck">
                                        Check me out
                                    </label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
