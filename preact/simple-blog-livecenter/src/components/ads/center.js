import { h, Component } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import { Text, Localizer } from 'preact-i18n';
import Markdown from 'preact-markdown';

@observer
class AdCenter extends Component {
  	constructor(props) {
        super(props);
        this.state = {
        };
    }

    loadAll = async () => {
        const { articleStore } = this.props.stores;
        const { categoryAdCenter } = this.props;
        await articleStore.loadArtlist({ limit: 10, category: categoryAdCenter, key: 'adCenter' });
    }

    componentDidMount() {
        this.loadAll();
    }

    render() {
        const { imageDomain, imageDomainPath } = this.props;
        const { appState, articleStore } = this.props.stores;
        const { artlistAdCenter } = articleStore;

        return (<>
            <div class='w-100 d-flex justify-content-center align-items-center my-2 py-2 bg-white'>
                {artlistAdCenter && artlistAdCenter.map((ad, idx) => {
                    return (<>
                        <div class='mx-1'>
                            <a href={ad.url} target='_blank' rel='noopener noreferrer'>
                                {ad.img && ad.img[0] && <>
                                    <img src={`${imageDomain}/400x/${imageDomainPath}/${ad.img[0].src}`} class='img-fluid' style='max-height: 70px;' />
                                </>}
                            </a>
                        </div>
                    </>);
                })}
            </div>
        </>);
    }
}

export default AdCenter;
