import { h, Component } from 'preact';
import { observer } from 'mobx-preact';
import util from 'preact-util';

// TODO: Do we need mobx? What is mobx doing here?

@observer
class FastListLine extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.containerRef = null;
    }

    componentWillUnmount() {
        const { removeIntersectionObserver } = this.props;
        if (removeIntersectionObserver) {
            removeIntersectionObserver(this.containerRef);
        }
    }

    componentDidMount() {
        const { addIntersectionObserver } = this.props;
        if (addIntersectionObserver) {
            addIntersectionObserver(this.containerRef);
        }
    }

    render() {
        const {
            wrapperClassNames = '',
            contentClassNames = '',
            renderContent,
            obj = {},
            idx,
            dataFields,
            dataValues,
            sessionid,
        } = this.props;

        const dataProperties = {};
        if (sessionid) {
            dataProperties.sessionid = sessionid;
        }
        dataFields.forEach(e => dataProperties[`data-${e}`] = encodeURI(dataValues[e] || obj[e]));

        return (
            <div
                class={`${wrapperClassNames}`}
                ref={c => this.containerRef = c}
                data-idx={idx}
                {...dataProperties}
            >
                <div
                    class={`${contentClassNames}`}
                    style={`display: block;`}
                >
                    {renderContent({
                        obj,
                        idx,
                    })}
                </div>
            </div>
        );
    }
}

@observer
class FastList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // IntersectionObserver
    deleteIntersectionObserver = () => {
        this.intersectionObserver = null;
    }

    handleIntersection = (entries) => {
        const { handleIntersection } = this.props;
        if (typeof(handleIntersection) === 'function') {
            // console.log('handleIntersection');
            handleIntersection(entries);
        }
        // console.log({ entries });
        // TODO: Make it possible to run defined functions for entries.
        // mu.intersectionObserverCallback(entries);
        entries.forEach((e) => {
            const { isIntersecting } = e;
            const { height = 0 } = e.target.dataset;
            // const childHeight = e.target.childNodes[0].getBoundingClientRect().height;
            // const targetHeight = e.target.getBoundingClientRect().height;
            const childHeight = e.target.childNodes[0].offsetHeight;
            const targetHeight = e.target.offsetHeight;
            const scrollHeight = e.target.scrollHeight;
            const currentHeight = Math.floor(Math.max(childHeight, targetHeight, scrollHeight));
            // console.log({ isIntersecting, height, childHeight, targetHeight, scrollHeight, currentHeight }, e.target);

            if (isIntersecting) {
                e.target.childNodes[0].style.display=`block`;
                // TODO: Should be set after image is loaded.
                // const height = e.target.childNodes[0].clientHeight > e.target.clientHeight ? e.target.childNodes[0].clientHeight : e.target.clientHeight;
                // console.log(e.target);
                // console.log('e.target.childNodes[0].offsetHeight:', e.target.childNodes[0].offsetHeight);
                // console.log('e.target.childNodes[0].scrollHeight:', e.target.childNodes[0].scrollHeight);
                // console.log('e.target.childNodes[0].clientHeight:', e.target.childNodes[0].clientHeight);
                // console.log('e.target.offsetHeight:', e.target.offsetHeight);
                // console.log('e.target.scrollHeight:', e.target.scrollHeight);
                // console.log('e.target.clientHeight:', e.target.clientHeight);
                // console.log('height:', height);
                // e.target.style.height=`${height}px`;
                e.target.style.minHeight = `${currentHeight > height ? currentHeight : height}px`;
            } else if (e.target.style.minHeight) {
                // e.target.style.height = `${currentHeight > height ? currentHeight : height}px`;
                e.target.style.minHeight = `${currentHeight > height ? currentHeight : height}px`;
                e.target.childNodes[0].style.display=`none`;
            }
        });
    }

    setupIntersectionObserver = () => {
        if (!('IntersectionObserver' in window) ||
            !('IntersectionObserverEntry' in window) ||
            !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
            return false;
        }

        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        };
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection, options);
    }

    addIntersectionObserver = (ref) => {
        if (this.intersectionObserver && ref) {
            this.intersectionObserver.observe(ref);
        }
    }
    removeIntersectionObserver = (ref) => {
        if (this.intersectionObserver && ref) {
            this.intersectionObserver.unobserve(ref);
        }
    }

    componentWillMount() {
        this.setupIntersectionObserver();
    }

    componentWillUnmount() {
        this.deleteIntersectionObserver();
    }

    render() {
        const {
            data = [],
            wrapperClassNames = 'row pb-4 bg-light',
            contentClassNames = `col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mb-0 position-relative rounded rounded-lg py-3 shadow-sm`,
            renderContent = (e) => <>Missing render function!</>,
            dataFields = [],
            dataValues = {},
        } = this.props;

        return (
            <div class='w-100'>
                {data && data.filter(e => util.isObject(e)).map((obj, idx) => {
                    const wrapperClasses = obj.hasOwnProperty('wrapperClassNames') ? obj.wrapperClassNames : wrapperClassNames;
                    const contentClasses = obj.hasOwnProperty('contentClassNames') ? obj.contentClassNames : contentClassNames;
                    return (<>
                        <FastListLine
                            key={`fastline-${idx}-${obj.id}`}
                            obj={obj}
                            idx={idx}
                            addIntersectionObserver={this.addIntersectionObserver}
                            removeIntersectionObserver={this.removeIntersectionObserver}
                            wrapperClassNames={wrapperClasses}
                            contentClassNames={contentClasses}
                            renderContent={renderContent}
                            dataFields={dataFields}
                            dataValues={dataValues}
                        />
                    </>);
                })}
            </div>
        );
    };
}

export default FastList;
