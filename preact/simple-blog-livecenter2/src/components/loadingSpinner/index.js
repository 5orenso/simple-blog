import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';

// import mu from '../../lib/musher-util';
const MARGIN_TOP = 0;
const MARGIN_BOTTOM = 0;

const initialState = {};

@observer
class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
        };
    }

    render() {
        const { goto, gotoTitle, routerName } = this.props;
        return (
			<div class='container-fluid' style={`margin-bottom: ${MARGIN_BOTTOM}; margin-top: ${MARGIN_TOP};`}>
                <div class='container-fluid h-100 fixed-top bg-light' style='z-index: 10000;'>
                    <div class='row h-100'>
                        <div class='col-12 text-center my-auto'>
                            <div class='spinner-border text-primary' style='width: 8rem; height: 8rem;' role='status'>
                                <span class='sr-only'><Text id='home.loading'>Loading...</Text></span>
                            </div>
                            <h3 class='mt-4'><Text id='home.loading'>Loading...</Text></h3>
                            {goto && <>
                                <a class='my-4 btn btn-primary btn-lg btn-block' native href={goto}>{gotoTitle} <i class='fas fa-angle-double-right ml-2' /></a>
                                <small class='text-muted'>{routerName}</small>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;
