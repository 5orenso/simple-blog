import { h, Component } from 'preact';

import util from '../util';

const initialState = {};
const debug = false;

export default class IotDeviceList extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
    }

    render(props) {
        const styles = props.styles;
        const iotDeviceList = props.iotDeviceList;
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
                            + Ny IotDevice
                        </button>
                    </div>
                    <table class={`table table-sm table-striped ${styles.condensed}`}>
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Tittel</th>
                                <th class='text-right' scope='col'>ChipId</th>
                                <th class='text-right' scope='col'>Version</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Package Name</th>

                                <th class='text-right' scope='col'>deepSleep</th>
                                <th class='text-right' scope='col'>sleepPeriode</th>
                                <th class='text-right' scope='col'>publishInterval</th>
                                <th scope='col'>wifiSsid</th>
                                <th scope='col'>mqttServer</th>
                                <th scope='col'>mqttPort</th>
                                <th scope='col'>mqttTopicOut</th>
                                <th scope='col'>mqttTopicIn</th>

                                <th scope='col'>Location</th>
                                <th scope='col'>Description</th>

                                <th class='text-center' scope='col'>BME280</th>
                                <th class='text-center' scope='col'>Dallas Temp</th>
                                <th class='text-center' scope='col'>Flame</th>
                                <th class='text-center' scope='col'>Light</th>
                                <th class='text-center' scope='col'>Gas MQ2</th>
                                <th class='text-center' scope='col'>Gas MQ3</th>
                                <th class='text-center' scope='col'>Moisture</th>
                                <th class='text-center' scope='col'>Motion</th>
                                <th class='text-center' scope='col'>CO2</th>
                                <th class='text-center' scope='col'>DSM501A</th>
                                <th class='text-center' scope='col'>Voltage</th>
                            </tr>
                        </thead>
                    <tbody>
                    {iotDeviceList.map(iotDevice =>
                        <tr data-id={iotDevice.id} onClick={handleListClick}>
                            <td scope='row'>{iotDevice.id}</td>
                            <td>{iotDevice.title}</td>
                            <td class='text-right'>{iotDevice.chipId}</td>
                            <td class='text-right'>{iotDevice.version}</td>
                            <td>{iotDevice.name}</td>
                            <td>{iotDevice.packageName}</td>

                            <td class='text-right'>{iotDevice.deepSleep}</td>
                            <td class='text-right'>{iotDevice.sleepPeriode}</td>
                            <td class='text-right'>{iotDevice.publishInterval}</td>
                            <td>{iotDevice.wifiSsid}</td>
                            <td>{iotDevice.mqttServer}</td>
                            <td>{iotDevice.mqttPort}</td>
                            <td>{iotDevice.mqttTopicOut}</td>
                            <td>{iotDevice.mqttTopicIn}</td>

                            <td>{iotDevice.location}</td>
                            <td>{iotDevice.description}</td>

                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.bme280 ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.dallasTemp ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.flame ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.light ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.gasMq2 ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.gasMq3 ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.moisture ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.motion ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.co2 ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.dsm501a ? <i class='fas fa-check' /> : ''}</td>
                            <td class='text-center'>{iotDevice.sensors && iotDevice.sensors.voltage ? <i class='fas fa-check' /> : ''}</td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
