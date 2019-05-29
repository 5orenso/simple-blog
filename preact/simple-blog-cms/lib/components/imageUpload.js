import { h, Component } from 'preact';

import util from '../util';

const Buffer = require('buffer').Buffer;

const initialState = {
    loadingProgress: 0,
    uploadedFiles: [],
    uploadedFilesData: {},
};
const debug = false;
const debugName = 'ImageUpload';

export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.handleAddImage = this.props.handleAddImage;
        this.fileInput;
    }

    handleAddFiles = async (event) => {
        event.preventDefault();
        const el = event.target;
        if (debug) {
            console.log(`${debugName}.handleAddFiles: event, el`, event, el);
        }
        for (let i = 0, l = el.files.length; i < l; i += 1) {
            const photo = el.files[i];
            if (photo.type.match('image.*')) {
                await this.readLocalFile(photo);
                this.handleUpload(photo)
            }
        }
    };

    handleEvent = (e, fileObject) => {
        if (debug) {
            console.log(`${debugName}.handleEvent[${fileObject.name}]: ${e.type}: ${e.loaded} bytes transferred of ${e.total}. Is lengthComputable: ${e.lengthComputable}: ${JSON.stringify(e)}`);
        }
    }

    handleUpload = (fileObject) => {
        if (debug) {
            console.log(`${debugName}.handleUpload[${fileObject.name}]`);
        }
        const formData = new FormData();
        formData.append('files[]', fileObject);
        const uploadMeta = {
            progress: 1,
        };
        const that = this.props.that;

        uploadMeta.xhr = new XMLHttpRequest();

        uploadMeta.xhr.upload.addEventListener('progress', (event) => {
            const fileObj = fileObject;
            this.updateProgress(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('loadstart', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('load', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('loadend', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('progress', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('error', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('abort', (event) => {
            const fileObj = fileObject;
            this.handleEvent(event, fileObj);
        });
        uploadMeta.xhr.addEventListener('readystatechange', (event) => {
            const fileObj = fileObject;
            this.uploadDone(event, fileObj);
        });

        uploadMeta.xhr.open('POST', `${this.props.apiServer}${this.props.apiUrl}`)
        uploadMeta.xhr.setRequestHeader('Authorization', `Bearer ${this.props.jwtToken}`);
        uploadMeta.xhr.send(formData);

        const filename = fileObject.name;
        const uploadedFilesData = this.state.uploadedFilesData;
        if (!uploadedFilesData[filename]) {
            uploadedFilesData[filename] = {};
        }
        uploadedFilesData[filename].uploadMeta = uploadMeta;
        this.setState({ uploadedFilesData });
    };

    readLocalFile = (fileObject) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('error', (error) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: Error occurred reading file: ${fileObject.name}: ${error}`);
                }
                reject(error);
            });

            reader.addEventListener('load', (event) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: File: ${fileObject.name} read successfully: ${JSON.stringify(event)}`);
                }
                const filename = fileObject.name;
                const uploadedFilesData = this.state.uploadedFilesData;
                if (!uploadedFilesData[filename]) {
                    uploadedFilesData[filename] = {};
                }
                uploadedFilesData[filename].event = event;
                this.setState({ uploadedFilesData });
                resolve(event);
            });

            reader.readAsDataURL(fileObject);
        });
    };

    updateProgress = (event, fileObject) => {
        if (event.lengthComputable) {
            const filename = fileObject.name;
            const uploadedFilesData = this.state.uploadedFilesData;
            var percentComplete = (event.loaded / event.total) * 100;
            if (debug) {
                console.log(`${debugName}.updateProgress[${filename}].progress`, percentComplete);
            }
            uploadedFilesData[filename].uploadMeta.progress = percentComplete;
            this.setState({ uploadedFilesData });
        }
    };

    uploadDone = (event, fileObject) => {
        const filename = fileObject.name;
        const uploadedFilesData = this.state.uploadedFilesData;
        const uploadMeta = uploadedFilesData[filename].uploadMeta;
        if (debug) {
            console.log(`${debugName}.uploadDone[${filename}].uploadedFilesData`, uploadedFilesData);
            console.log(`${debugName}.uploadDone[${filename}].uploadMeta`, uploadMeta);
        }

        if (uploadMeta && uploadMeta.xhr.readyState === 4 && uploadMeta.xhr.status === 201) {
            const response = JSON.parse(uploadMeta.xhr.responseText);
            const files = response.filesUploaded;
            for (let i = 0; i < files.length; i += 1) {
                const file = files[i];
                this.addFileToUpload(file);
                this.fileInput.value = '';
            }
        }
    };

    addFileToUpload(file) {
        if (debug) {
            console.log(`${debugName}.addFileToUpload[${file.name}]`);
        }
        const uploadedFilesData = this.state.uploadedFilesData;
        delete uploadedFilesData[file.name];
        this.setState({ uploadedFilesData });
        this.handleAddImage(file);
    }

    render(props) {
        const uploadedFilesData = this.state.uploadedFilesData;
        return (
            <div>
                <input class='btn btn-info' type='file' id='image-file' onchange={this.handleAddFiles} multiple ref={(c) => {
                    this.fileInput = c;
                }} />
                <div>
                    {Object.keys(uploadedFilesData).length > 0 ? (<h3>Uploaded images</h3>) : ''}
                    <ul class='list-group'>
                        {Object.keys(uploadedFilesData).map(key => {
                            const { uploadMeta = {} } = uploadedFilesData[key];
                            return (
                                <li class='list-group-item list-group-item-action flex-column align-items-start'>
                                    <div class='d-flex w-100 justify-content-between'>
                                        <span class='mb-1'>{key}</span>
                                        <small>{util.formatBytes(uploadedFilesData[key].event.total, 2)}</small>
                                    </div>
                                    <div class='d-flex w-100 justify-content-between'>
                                        <img class='img-fluid' src={uploadedFilesData[key].event.target.result} style='max-height: 150px;' />
                                        <small>{uploadedFilesData[key].event.uploadDone}</small>
                                        Uploading image. Please wait...
                                    </div>
                                    <div class='progress'>
                                        <div
                                            class='progress-bar progress-bar-striped progress-bar-animated bg-success'
                                            role='progressbar'
                                            style={`width: ${uploadMeta.progress}%`}
                                            aria-valuenow={uploadMeta.progress}
                                            aria-valuemin='0'
                                            aria-valuemax='100'>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}
