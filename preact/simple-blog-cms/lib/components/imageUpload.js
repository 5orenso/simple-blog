import { h, Component } from 'preact';

import ProgressBar from './progressbar';
import util from '../util';

const Buffer = require('buffer').Buffer;

const initialState = {
    loadingProgress: 0,
    uploadedFiles: [],
    uploadedFilesData: {},
};
const debug = false;

export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.handleAddImage = this.props.handleAddImage;
    }

    // eslint-disable-next-line
    handleUpload = (event) => {
        event.preventDefault();
        const el = event.target;
        // console.log('image.el', el);
        const that = this.props.that;

        const formData = new FormData();
        for (let i = 0, l = el.files.length; i < l; i += 1) {
            const photo = el.files[i];
            formData.append('files[]', photo);

            if (photo.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // console.log('reader.filedata:', e);
                    const filename = photo.name;
                    const uploadedFilesData = this.state.uploadedFilesData;
                    uploadedFilesData[filename] = e;
                    this.setState({ uploadedFilesData });
                };
                reader.readAsDataURL(photo);
            }
        }

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('progress', (event) => this.updateProgress(event));
        // xhr.addEventListener('load', transferComplete);
        // xhr.addEventListener('error', transferFailed);
        // xhr.addEventListener('abort', transferCanceled);

        xhr.open('POST', `${that.props.apiServer}/api/fileupload/?category=${this.props.category || 'no-category'}`
            + `&title=${util.htmlIdSafe(this.props.title) || 'no-title'}`);
        xhr.setRequestHeader('Authorization', `Bearer ${that.props.jwtToken}`);
        xhr.send(formData);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 201) {
                const response = JSON.parse(xhr.responseText);
                const files = response.filesUploaded;
                for (let i = 0; i < files.length; i += 1) {
                    const file = files[i];
                    this.addFileToUpload(file);
                }
            }
        };
    }

    updateProgress(event) {
        if (event.lengthComputable) {
            // event.loaded the bytes the browser received
            // event.total the total bytes set by the header
            var percentComplete = (event.loaded / event.total) * 100;
            // console.log('percentComplete', percentComplete);
            this.setState({
                loadingProgress: percentComplete,
            });
        }
    }

    addFileToUpload(file) {
        // console.log(file);
        // TODO: Should probably remove the files from the upload box.
        const uploadedFilesData = this.state.uploadedFilesData;
        uploadedFilesData[file.name].uploadDone = file.newFilename;
        this.setState({ uploadedFilesData });

        this.handleAddImage(file, () => {
            this.setState({
                uploadedFiles: [],
                uploadedFilesData: {},
            });
        });
    }

    render(props) {
        const uploadedFilesData = this.state.uploadedFilesData;
        const styles = this.props.styles;
        return (
            <div>
                <ProgressBar styles={styles} loadingProgress={this.state.loadingProgress} />
                <input class='btn btn-info' type='file' id='image-file' onchange={this.handleUpload} multiple />
                <div>
                    {Object.keys(uploadedFilesData).length > 0 ? (<h3>Uploaded files</h3>) : ''}
                    <ul class='list-group'>
                        {Object.keys(uploadedFilesData).map(key => (
                            <li class='list-group-item list-group-item-action flex-column align-items-start'>
                                <div class="d-flex w-100 justify-content-between">
                                    <span class="mb-1">{key}</span>
                                    <small>{uploadedFilesData[key].total}</small>
                                </div>
                                <p><img src={uploadedFilesData[key].target.result} height='50' /></p>
                                <small>{uploadedFilesData[key].uploadDone}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
