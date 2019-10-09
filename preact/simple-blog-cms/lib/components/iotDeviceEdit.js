import { h, Component } from 'preact';

import linkstate from 'linkstate';

import ImageUpload from './imageUpload';
import MessagesLite from './messagesLite';

import util from '../util';
import utilHtml from '../util-html';

const initialState = {};
const debug = false;
const editMode = 'textarea'; // div

export default class IotDeviceEdit extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const that = props.that;
        const messages = props.messages;
        const iotDevice = props.iotDevice;
        const handleInput = props.handleInput;
        const handleTextareaInput = props.handleTextareaInput;
        const handleClickSave = props.handleClickSave;
        const handleClickNew = props.handleClickNew;
        const handleClickBack = props.handleClickBack;

        const fields = ['title', 'chipId', 'version', 'name', 'packageName', 'deepSleep', 'sleepPeriode', 'publishInterval',
            'wifiSsid', 'mqttServer', 'mqttPort', 'mqttTopicOut', 'mqttTopicIn', 'location', 'description'];

        const fieldsSensors = ['bme280', 'dallasTemp', 'flame', 'light', 'gasMq2', 'gasMq3', 'moisture', 'motion', 'co2', 'dsm501a', 'voltage'];

        return (
            <div class='container-fluid col-12'>

                <div class='col-12 sticky-top d-flex justify-content-between'>
                    <div class='col-3'>
                        <button type='button' class='btn btn-warning mr-2' onclick={handleClickBack}><i class='fas fa-arrow-left'></i> Tilbake</button>
                    </div>
                    <div class='col-6 text-center'>
                        <button type='submit' class='btn btn-success mr-2' onClick={handleClickSave}><i class='fas fa-save'></i> Lagre</button>
                    </div>
                    <div class='col-3'>
                        <button class='btn btn-info float-right ml-2' onClick={e => handleClickNew(e, { title: 'Trenger en fin ny tittel' })}>+ Ny iotDevice query</button>
                    </div>
                </div>

                <div class='col-12 fixed-bottom'>
                    <small>
                        <MessagesLite styles={styles} messages={messages} />
                    </small>
                </div>


                <div class='row'>
                    <div class='col-6'>
                        &nbsp;
                    </div>
                    <div class='col-6'>
                        <label for='bodyInput'>Forhåndsvisning</label>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-6'>

                        {fields.map(fieldName =>
                            <div class='form-group'>
                                <label for={`${fieldName}Input`}>{fieldName}</label>
                                <input type='text' class='form-control' id={`${fieldName}Input`} placeholder={fieldName}
                                    name={fieldName}
                                    onInput={handleInput}
                                    value={iotDevice[fieldName]}
                                />
                            </div>                    
                        )}

                        {fieldsSensors.map(fieldName =>
                            <div class='form-check'>
                                <input type='checkbox' class='form-check-input' id={`${fieldName}Input`}
                                    name={fieldName}
                                    onInput={linkstate(that, `iotDevice.sensors.${fieldName}`)}
                                    value={1}
                                    checked={util.getString(iotDevice, 'sensors', fieldName) == 1 ? 'checked' : ''}
                                />
                                <label for={`${fieldName}Input`}>{fieldName}</label>
                            </div>
                        )}

                    </div>
                    <div class='col-6'>
                        <h1>{iotDevice.title}</h1>
                        <table class='table table-sm table-striped'>
                            <tbody>
                                {fields.map(fieldName =>
                                    <tr>
                                        <td>
                                            {fieldName}
                                        </td>
                                        <td>
                                            {iotDevice[fieldName]}
                                        </td>
                                    </tr>
                                )}
                                {fieldsSensors.map(fieldName =>
                                    <tr>
                                        <td>
                                            {fieldName}
                                        </td>
                                        <td>
                                            {util.getString(iotDevice, 'sensors', fieldName) ? <i class='fas fa-check' /> : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class='row'>
                    <div class='col-12'>
                        <button type='submit' class='btn btn-success' onClick={handleClickSave}>Lagre</button>
                    </div>
                </div>
            </div>
        );
    }
}
