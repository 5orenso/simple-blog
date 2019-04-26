import { h, Component } from 'preact';

import util from '../util';

const widgetName = 'ImageList';
const initialState = {
};
const debug = false;
const imageWidth = 150;
const imageHeight = 100;

export default class ImageList extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.parent = props.that;
        this.props = props;
        this.imageServer = this.parent.props.apiServer;
    }

    getWidth(img) {
        if (img.features) {
            return img.features.width;
        } else if (img.exif) {
            return img.exif.pixelXDimension || img.exif.exifImageWidth;
        }
    }

    getHeight(img) {
        if (img.features) {
            return img.features.height;
        } else if (img.exif) {
            return img.exif.pixelYDimension || img.exif.exifImageLength;
        }
    }

    formatPrintSize(size) {
        const parts = String(size).split('x');
        const width = util.format(parts[0], 0);
        const height = util.format(parts[1], 0);
        return `${width} x ${height}`;
    }

    formatQuality(quality) {
        return `${util.format(quality * 100, 0)}%`;
    }

    getCardinal($angle) {
        //easy to customize by changing the number of directions you have
        const directions = 8;

        const degree = 360 / directions;
        const angle = $angle + degree / 2;

        if (angle >= 0 * degree && angle < 1 * degree) {
            return 'N';
        }
        if (angle >= 1 * degree && angle < 2 * degree) {
            return 'NE';
        }
        if (angle >= 2 * degree && angle < 3 * degree) {
            return 'E';
        }
        if (angle >= 3 * degree && angle < 4 * degree) {
            return 'SE';
        }
        if (angle >= 4 * degree && angle < 5 * degree) {
            return 'S';
        }
        if (angle >= 5 * degree && angle < 6 * degree) {
            return 'SW';
        }
        if (angle >= 6 * degree && angle < 7 * degree) {
            return 'W';
        }
        if (angle >= 7 * degree && angle < 8 * degree) {
            return 'NW';
        }
        return 'N';
    }

    getSceneCaptureType(input) {
        // if (input === 0) {
        //     return <span><i class="far fa-image"></i> Standard</span>;
        // }
        if (input === 1) {
            return <span><i class="fas fa-mountain"></i> Landscape</span>;
        }
        if (input === 2) {
            return <span><i class="fas fa-user"></i> Portrait</span>;
        }
        if (input === 3) {
            return <span><i class="fas fa-moon"></i> Night scene</span>;
        }
        return '';
    }

    drawCanvases() {
        this.props.imglist.map(img => {
            try {
                const colors = ['red', 'green', 'yellow', 'cyan', 'pink', 'blue'];
                const c = document.getElementById(`layer-${img.id}`)
                const ctx = c.getContext('2d');
                const width = this.getWidth(img);
                const height = this.getHeight(img);
                const sizeRatio = imageWidth / width;

                if (img.exif && width) {
                    const imageRatio = height / width;
                    c.width = imageWidth;
                    c.height = Math.ceil(imageWidth * imageRatio);
                }

                const classColor = {};
                // Make prediction squares:
                if (img.predictionsCocoSsd) {
                    img.predictionsCocoSsd.map((pre) => {
                        const x1 = Math.ceil(sizeRatio * pre.bbox[0]);
                        const y1 = Math.ceil(sizeRatio * pre.bbox[1]);
                        const w = Math.ceil(sizeRatio * pre.bbox[2]);
                        const h = Math.ceil(sizeRatio * pre.bbox[3]);

                        if (!classColor[pre.class]) {
                            classColor[pre.class] = colors.shift();
                        }
                        // Red rectangle
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = classColor[pre.class];
                        ctx.strokeRect(x1, y1, w, h);
                        // Text
                        ctx.font = '10px Georgia';
                        ctx.fillStyle = classColor[pre.class];
                        ctx.fillText(pre.class, x1, y1);
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.props = nextProps;
        return true;
    }

    componentDidUpdate() {
        if (debug) {
            console.log(widgetName, 'componentDidUpdate', this.props);
        }
        this.drawCanvases();
    }

    render(props) {
        const styles = props.styles;
        const imglist = props.imglist;
        const handleImglistClick = props.handleImglistClick;
        const handleInput = props.handleInput;
        const handleSubmit = props.handleSubmit;
        const handleTagClick = props.handleTagClick;
        const imageId = props.imageId;
        const filterQuery = props.filterQuery;
        return (
            <div class='col-12'>
                <div class='d-flex justify-content-center'>
                    <div class='col-4 mb-2'>
                        <input type='text' class='form-control' placeholder='Søk etter bilder' name='q'
                            onKeypress={handleInput}
                            onChange={handleInput}
                        />
                    </div>
                    <div class='col-2'>
                        <button class='btn btn-success' onclick={handleSubmit}>Søk</button>
                    </div>
                </div>
                <table class={`table table-sm ${styles.condensed}`}>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Thumb</th>
                            <th scope='col'>Src</th>
                            <th scope='col'>Bildedato</th>
                            <th scope='col'>AI predictions</th>
                            <th scope='col'>Filstr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imglist.map(img => {
                            let geoInfo = [];
                            let geoInfoExtra = [];
                            util.geoAddressFields().map(key => {
                                const geoData = util.getString(img, 'geo', 'address', key);
                                if (geoData) {
                                    geoInfo.push(geoData);
                                    const geoDataExtra = util.geoAddressGetExtraTags(key);
                                    if (geoDataExtra) {
                                        geoInfoExtra = geoInfoExtra.concat(geoDataExtra);
                                    }
                                }
                            });
                            const geoDisplayName = util.getString(img, 'geo', 'display_name');
                            if (geoDisplayName) {
                                geoDisplayName.split(', ').map(val => {
                                    if (val && geoInfo.indexOf(val) === -1) {
                                        geoInfo.push(val);
                                    }
                                })
                            }
                            geoInfo = util.asUniqArray(geoInfo);

                            return (
                                <tr data-id={img.id} class={imageId == img.id ? 'bg-primary text-white' : ''} onClick={handleImglistClick}>
                                    <td scope='row'>{img.id}</td>
                                    <td scope='row' style={`width: ${imageWidth}px !important;`}>
                                        <div style={`position: relative; width: ${imageWidth}px;`}>
                                            <img src={`${this.imageServer}/pho/${img.src}?w=${imageWidth}`} />
                                            <canvas id={`layer-${img.id}`} width='100'
                                                style='position: absolute; left: 0; top: 0; z-index: 1000; width: 100%; height: 100%;'></canvas>
                                        </div>
                                    </td>
                                    <td>
                                        {img.exif && img.exif.artist && <h6 class='mb-0'>{util.getString(img, 'exif', 'artist')}</h6>}
                                        <span>{img.src}</span>
                                        <div class='text-muted'>
                                            {img.exif && img.exif.model && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.model'] ? 'danger' : 'success'}`}
                                                    data-name='exif.model'
                                                    data-value={util.getString(img, 'exif', 'model')}
                                                    onClick={handleTagClick}
                                                >
                                                    <i class='fas fa-camera'></i> {util.getString(img, 'exif', 'model')}
                                                </span>
                                            )}
                                            {img.exif && img.exif.lensModel && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.lensModel'] ? 'danger' : 'success'}`}
                                                    data-name='exif.lensModel'
                                                    data-value={util.getString(img, 'exif', 'lensModel')}
                                                    onClick={handleTagClick}
                                                >
                                                    {util.getString(img, 'exif', 'lensModel')}
                                                </span>
                                            )}
                                            {img.exif && img.exif.fNumber && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.fNumber'] ? 'danger' : 'success'}`}
                                                    data-name='exif.fNumber'
                                                    data-value={util.getString(img, 'exif', 'fNumber')}
                                                    onClick={handleTagClick}
                                                >
                                                    f/{util.getString(img, 'exif', 'fNumber')}
                                                </span>
                                            )}
                                            {img.exif && img.exif.focalLength && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.focalLength'] ? 'danger' : 'success'}`}
                                                    data-name='exif.focalLength'
                                                    data-value={util.getString(img, 'exif', 'focalLength')}
                                                    onClick={handleTagClick}
                                                >
                                                    {util.getString(img, 'exif', 'focalLength')} mm
                                                </span>
                                            )}
                                            {img.exif && img.exif.exposureTime && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.exposureTime'] ? 'danger' : 'success'}`}
                                                    data-name='exif.exposureTime'
                                                    data-value={util.getString(img, 'exif', 'exposureTime')}
                                                    onClick={handleTagClick}
                                                >
                                                    {util.getString(img, 'exif', 'exposureTime')} sec
                                                </span>
                                            )}
                                            {img.exif && img.exif.photographicSensitivity && (
                                                <span class={`mr-1 badge badge-${filterQuery['exif.photographicSensitivity'] ? 'danger' : 'success'}`}
                                                    data-name='exif.photographicSensitivity'
                                                    data-value={util.getString(img, 'exif', 'photographicSensitivity')}
                                                    onClick={handleTagClick}
                                                >
                                                    ISO: {util.getString(img, 'exif', 'photographicSensitivity')}
                                                </span>
                                            )}
                                        </div>
                                        <div class='text-muted'>
                                            <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-image'></i> {this.getWidth(img)} x {this.getHeight(img)}px
                                            </span>
                                            {img.exif && img.exif.lat && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-location-arrow'></i> {util.format(img.exif.lat, 5, '.')}, {util.format(img.exif.lng, 5, '.')}
                                            </span>}
                                            {img.features && img.features['print size'] && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-print'></i> {this.formatPrintSize(img.features['print size'])} cm
                                            </span>}
                                            {img.features && img.features.quality && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-thermometer-three-quarters'></i> {this.formatQuality(img.features.quality)}
                                            </span>}
                                            {img.exif && img.exif.software && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-edit'></i> {util.getString(img, 'exif', 'software')}
                                            </span>}
                                            {img.exif && img.exif.gpsSpeed > 0 && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-tachometer-alt'></i> {util.format(img.exif.gpsSpeed, 1)} km/h
                                            </span>}
                                            {img.exif && img.exif.gpsAltitude > 0 && <span class='mr-1 badge badge-info'>
                                                <i class='fas fa-mountain'></i> {util.format(img.exif.gpsAltitude, 0)} moh
                                            </span>}
                                            {img.exif && img.exif.gpsImgDirection && <span class='mr-1 badge badge-info'>
                                                <i class="fas fa-compass"></i> {this.getCardinal(img.exif.gpsImgDirection)}
                                            </span>}
                                            {img.exif && img.exif.hasOwnProperty('sceneCaptureType') && <span class='mr-1 badge badge-info'>
                                                {this.getSceneCaptureType(img.exif.sceneCaptureType)}
                                            </span>}
                                        </div>
                                        <div class='text-muted'>
                                            {geoInfo.map(info =>
                                                <span class='badge badge-primary mr-1'>
                                                    {info}
                                                </span>
                                            )}
                                            {geoInfoExtra.map(info =>
                                                <span class='badge badge-danger mr-1'>
                                                    {info}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {util.isoDateNormalized(util.getString(img, 'exif', 'dateTimeOriginal') ||
                                            util.getString(img, 'exif', 'dateTime'))}
                                    </td>
                                    <td>
                                        {img.predictions && img.predictions.filter(pre => pre.probability > 0.2).map((pre) =>
                                            <span class={`badge badge-${filterQuery['predictions.className'] === pre.className ? 'danger' : 'info'} p-2 mb-1 ml-2`}
                                                data-name='predictions.className'
                                                data-value={pre.className}
                                                onClick={handleTagClick}
                                            >
                                                {pre.className} ({util.format(pre.probability * 100, 0)}%)
                                            </span>
                                        )}
                                        {img.predictionsCocoSsd && img.predictionsCocoSsd.map((pre) =>
                                            <span class={`badge badge-${filterQuery['predictionsCocoSsd.class'] === pre.class ? 'danger' : 'warning'} p-2 mb-1 ml-2`}
                                                data-name='predictionsCocoSsd.class'
                                                data-value={pre.class}
                                                onClick={handleTagClick}
                                            >
                                                {pre.class} ({util.format(pre.score * 100, 0)}%)
                                            </span>
                                        )}
                                    </td>
                                    <td>{util.formatBytes(util.getString(img, 'stats', 'size'), 2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
