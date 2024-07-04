import { h, Component } from 'preact';

import util from '../util';

const initialState = {
    loadingProgress: 0,
    uploadedFiles: [],
    uploadedFilesData: {},
    uploadQueue: [],
    totalUploading: 0,
};
const debug = false;
const debugName = 'ImageUpload';

const MAX_WIDTH = 2048;
const MAX_HEIGHT = 2048;
const MAX_FILES = 100;

function filenameSafe(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_').toLowerCase();
}

export default class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.handleAddImage = this.props.handleAddImage;
        this.fileInput;
        this.uploadQueue = [];
    }

    handleAddFiles = event => {
        const el = event.target;
// console.log('handleAddFiles', el);
        try {
            // console.log('handleAddFiles', el);
            if (!el || !el.files || el.files.length === 0) {
                return this.reportError({
                    file: 'dragNdropFileupload.js',
                    function: 'handleAddFiles',
                    error: 'No files selected',
                    el,
                });
            }
            if (el.files.length > MAX_FILES) {
                this.setState({ error: `Max ${MAX_FILES} files in each upload...` });
            } else {
                this.setState({ error: null });
                if (debug) {
                    console.log(`${debugName}.handleAddFiles: event, el`, event, el);
                }
                for (let i = 0, l = el.files.length; i < l; i += 1) {
                    const photo = el.files[i];
                    // if (photo.type.match('image.*')) {
                    this.readLocalFile(photo);
                    // }
                }
            }
        } catch(err) {
            this.reportError({
                file: 'dragNdropFileupload.js',
                function: 'handleAddFiles',
                error: err,
            });
        }
    }

    handleEvent = (e, fileObject) => {
        if (debug) {
            console.log(`${debugName}.handleEvent[${fileObject.name}]: ${e.type}: ${e.loaded} bytes transferred of `
                + `${e.total}. Is lengthComputable: ${e.lengthComputable}: ${JSON.stringify(e)}`);
        }
    }

    handleUpload = (fileObject) => {
        if (debug) {
            console.log(`${debugName}.handleUpload: ${fileObject.filename}`);
        }
        const formData = new FormData();
        formData.append('files[]', fileObject);
        const uploadMeta = {
            progress: 1,
        };

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
            this.setState({ totalUploading: this.state.totalUploading - 1 }, () => {
                this.handleUploadQueue();
            });
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

        const filename = filenameSafe(fileObject.name);
        const uploadedFilesData = this.state.uploadedFilesData;
        if (!uploadedFilesData[filename]) {
            uploadedFilesData[filename] = {};
        }
        uploadedFilesData[filename].uploadMeta = uploadMeta;
        uploadedFilesData[filename].imageNum = this.state.imageNum;
        this.setState({ uploadedFilesData });
    };

    // eslint-disable-next-line
    readLocalFile = (fileObject, maxWidth = 256, maxHeight = 256) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            // Get the original real FileReader. The polyfill saves a reference to it.
            const realFileReader = reader._realReader;
            // Make sure we were able to get the original FileReader
            if (realFileReader) {
                // Swap out the polyfill instance for the original instance.
                reader = realFileReader;
            }

            reader.addEventListener('error', (error) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: Error occurred reading file: ${fileObject.name}: ${error}`);
                    this.reportError({
                        file: 'dragNdropFileupload.js',
                        function: 'readLocalFile.reader.addEventListener',
                        error,
                    });
                }
                reject(error);
            });

            reader.addEventListener('load', async (event) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: File: ${fileObject.name} read successfully: `
                        + `${JSON.stringify(event)}`);
                }
                let resizedImage;
                try {
                    const isImage = fileObject.type.match(/image\//); // .match(/(jpg|jpeg|png|gif|heic|heif|svg|webp|tif)/i);
                    if (isImage) {
                        resizedImage = await this.resizeImage(event.target.result, maxWidth, maxHeight);
                    }
                } catch(e) {
                    console.error('Error resizing image:', e);
                    this.reportError({
                        file: 'dragNdropFileupload.js',
                        function: 'readLocalFile.reader.addEventListener.load',
                        error: e,
                    });
                }
                const photo = fileObject;
                const filename = filenameSafe(photo.name);
                const uploadedFilesData = this.state.uploadedFilesData;
                if (!uploadedFilesData[filename]) {
                    uploadedFilesData[filename] = {};
                }
                uploadedFilesData[filename].event = event;
                uploadedFilesData[filename].resizedSrc = resizedImage;
                this.setState({ uploadedFilesData });
                this.addToUploadQueue(photo);
                // this.handleUpload(photo, MAX_WIDTH, MAX_HEIGHT);
                resolve(event);
            });

            reader.readAsDataURL(fileObject);
        });
    }

    addToUploadQueue = (photo) => {
        // const { uploadQueue = [] } = this.state;
        // uploadQueue.push(photo);
        // this.setState({
        //     uploadQueue,
        // }, () => {
        //     this.handleUploadQueue();
        // });
        this.uploadQueue.push(photo);
        this.handleUploadQueue();
    }

    handleUploadQueue = () => {
        // const { uploadQueue = [], totalUploading } = this.state;
        const { totalUploading } = this.state;
        console.log('handleUploadQueue.totalUploading', totalUploading)
        if (this.uploadQueue.length > 0 && totalUploading < 1) {
            const photo = this.uploadQueue.shift();
            this.setState({
                totalUploading: totalUploading + 1,
                // uploadQueue,
            });
            this.handleUpload(photo, MAX_WIDTH, MAX_HEIGHT);
        }
    }

    resizeImage = (inputImage, maxWidth = 256, maxHeight = 256, isBlob) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let newWidth = image.width;
                let newHeight = image.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (newWidth > maxWidth) {
                    const ratio = maxWidth / newWidth;
                    newWidth = maxWidth;
                    newHeight = newHeight * ratio;
                }
                if (newHeight > maxHeight) {
                    const ratio = maxHeight / newHeight;
                    newHeight = maxHeight;
                    newWidth = newWidth * ratio;
                }

                // Set canvas dimensions
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Draw image on canvas
                ctx.drawImage(image, 0, 0, newWidth, newHeight);

                if (isBlob) {
                    // Convert canvas content to blob
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    });
                } else {
                    // Convert canvas content to base64 image
                    resolve(canvas.toDataURL('image/jpeg'));
                }
            });
            image.src = inputImage;
        });
    }

    localLoadAndResizeImage = (fileObject, maxWidth = 256, maxHeight = 256) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('error', (error) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: Error occurred reading file: ${fileObject.name}: ${error}`);
                    this.reportError({
                        file: 'dragNdropFileupload.js',
                        function: 'localLoadAndResizeImage.reader.addEventListener',
                        error,
                    });
                }
                reject(error);
            });

            reader.addEventListener('load', async (event) => {
                if (debug) {
                    console.log(`${debugName}.FileReader: File: ${fileObject.name} read successfully: `
                        + `${JSON.stringify(event)}`);
                }
                const resizedImage = await this.resizeImage(event.target.result, maxWidth, maxHeight, true);
                resolve(resizedImage);
            });

            reader.readAsDataURL(fileObject);
        });
    }


    updateProgress = (event, fileObject) => {
        if (event.lengthComputable) {
            const filename = filenameSafe(fileObject.name);
            const uploadedFilesData = this.state.uploadedFilesData;
            const percentComplete = (event.loaded / event.total) * 100;
            if (debug) {
                console.log(`${debugName}.updateProgress[${filename}].progress`, percentComplete);
            }
            uploadedFilesData[filename].uploadMeta.progress = percentComplete;
            this.setState({ uploadedFilesData });
        }
    }

    uploadDone = (event, fileObject) => {
        const filename = filenameSafe(fileObject.name);
        const uploadedFilesData = this.state.uploadedFilesData;
        const uploadMeta = uploadedFilesData[filename].uploadMeta;
        if (debug) {
            console.log(`${debugName}.uploadDone[${filename}].uploadedFilesData`, uploadedFilesData);
            console.log(`${debugName}.uploadDone[${filename}].uploadMeta`, uploadMeta);
            console.log(`${debugName}.uploadDone.event`, event);
        }

        if (uploadMeta && uploadMeta.xhr.readyState === 4 && uploadMeta.xhr.status === 201) {
            const response = JSON.parse(uploadMeta.xhr.responseText);
            const files = response.filesUploaded;
            for (let i = 0; i < files.length; i += 1) {
                const file = files[i];
                this.addFileToUpload(file);
                if (this.fileInput) {
                    this.fileInput.value = '';
                }
            }
        }
    }

    addFileToUpload(file) {
        const filename = filenameSafe(file.name);
        if (debug) {
            console.log(`${debugName}.addFileToUpload[${filename}]`);
        }
        const { uploadedFilesData } = this.state;
        const { handleAddImage, uploadStatus = () => {} } = this.props;

        delete uploadedFilesData[filename];
        this.setState({ uploadedFilesData });
        handleAddImage(file);
        uploadStatus(true);
    }

    render() {
        const uploadedFilesData = this.state.uploadedFilesData;
        return (
            <div>
                <input class='btn btn-info' type='file' multiple
                    id='image-file'
                    onchange={this.handleAddFiles}
                    ref={(c) => {
                        this.fileInput = c;
                    }}
                />
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
                                        <img class='img-fluid'
                                            src={uploadedFilesData[key].resizedSrc || uploadedFilesData[key].event.target.result}
                                            style='max-height: 150px;'
                                        />
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
