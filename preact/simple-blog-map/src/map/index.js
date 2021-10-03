import { h, Component, createRef, useEffect } from 'preact';
import util from 'preact-util';
import { observer } from 'mobx-preact';
import Markdown from 'preact-markdown';

import ReactLeafletMultiOptionsPolyline from 'react-leaflet-multi-options-polyline';

import "./style.css";

const MARKDOWN_OPTIONS = {
	pedantic: false,
	gfm: true,
	breaks: true,
	sanitize: false,
	smartLists: true,
	smartypants: true,
	xhtml: true,
};

import {
	Circle,
	FeatureGroup,
	LayerGroup,
	LayersControl,
	Map,
	Marker,
	Popup,
	Rectangle,
	TileLayer,
	VideoOverlay,
	ImageOverlay,
	GeoJSON,
	WMSTileLayer,
    useLeaflet,
	ScaleControl,
	Polyline,
} from 'react-leaflet';

import HeatmapLayer from 'react-leaflet-heatmap-layer';

import MarkerClusterGroup from 'react-leaflet-markercluster';
import '../../node_modules/react-leaflet-markercluster/dist/styles.min.css';

import FullscreenControl from 'react-leaflet-fullscreen';
import '../../node_modules/react-leaflet-fullscreen/dist/styles.css';

import Control from 'react-leaflet-control';

const { BaseLayer, Overlay } = LayersControl;

import icons from '../../lib/icons';
import '../../node_modules/leaflet/dist/leaflet.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('../../node_modules/leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('../../node_modules/leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('../../node_modules/leaflet/dist/images/marker-shadow.png')
});

const createClusterCustomIcon = function (cluster) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true),
  });
};

function normalizeRange(val, min, max, newMin, newMax) {
    return newMin + (val - min) * (newMax - newMin) / (max - min);
}

const API_OPEN_WEATHERMAP_KEY = '7faae595b3c104f7211880c26bef9778';
const INCLINE_STEP = 1;
const MAX_HSL_COLOR = 230;

@observer
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasLocation: false,
			visibleLayers: {
				Windspeed: false,
			},
			mapCenter: [],
			mapZoom: 10,
			rangeSteps: INCLINE_STEP,
			maxHslColor: MAX_HSL_COLOR,
			hasZoomedToMarkers: false,
		};
		// const { waypointStore } = this.props.stores;
		// waypointStore.load();
	}

	mapRef = createRef();
	polyRef = createRef();

	handleViewportChanged = (e) => {
		// console.log('onViewportChanged', e);
		this.setState({
			mapCenter: e.center,
			mapZoom: e.zoom,
		})
	}

	handleLocationFound = (e) => {
		if (e.latlng) {
			this.setState({
				hasLocation: true,
				latlng: e.latlng,
			});
		}
	}

	geoJSONStyle() {
		return {
			color: '#0347A2',
			weight: 2,
			fillOpacity: 0.5,
			fillColor: '#0347A2',
		}
	}

	onEachFeature = (feature, layer) => {
		if (util.asString(feature, 'geometry', 'type') === 'LineString') {
			const { gpxInfo = {} } = this.props;
			const popupContent = `<Popup>
				<h5>Details</h5>
				<ul>
					<li>Total distance: ${util.format(gpxInfo.totalDistance, 2)} km</li>
					<li>Max speed: ${util.format(gpxInfo.maxSpeed, 1)} km/t</li>
					<li>Avg speed: ${util.format(gpxInfo.avgSpeed, 1)} km/t</li>
					<li>Ascent: ${util.format(gpxInfo.ascent || gpxInfo.calculatedAscend, 0)} m</li>
					<li>Descent: ${util.format(gpxInfo.decent || gpxInfo.calculatedDescend, 0)} m</li>
					<li>Duration: ${util.secToHms(gpxInfo.duration)}</li>
				</ul>
			</Popup>`
			layer.bindPopup(popupContent)
		}
	}

	geoJSONfeature = (feature) => {
		// console.log({ feature }, util.asString(feature, 'geometry', 'type'));
		if (util.asString(feature, 'geometry', 'type') === 'LineString') {
			return true;
		}
		return false;
	}


	handleClick = (e) => {
		const { appState } = this.props.stores;
		appState.setLatlng(e.latlng);
		// this.setState({ currentPos: e.latlng });
	}

	zoomToGeoJSON = (e) => {
		if (e.target) {
			let bounds = e.target.getBounds();

			if (bounds && bounds._northEast) {
				this.setState({ bounds });
			}
			// const map = this.mapRef.leafletElement;  //get native Map instance
			// map.fitBounds(bounds);
		}
		// if (this.geoJSONRef.leafletElement) {
		// console.log(e);
		// 	const map = this.mapRef.leafletElement;  //get native Map instance
		// 	const group = this.geoJSONRef.leafletElement; //get native featureGroup instance
		// 	map.fitBounds(group.getBounds());
		// }
	}

	zoomToMarkers = (markers = [], force = false) => {
		const { hasZoomedToMarkers } = this.state;
		// console.log('zoomToMarkers', hasZoomedToMarkers, { markers });
		if ((force || !hasZoomedToMarkers) && markers.length && markers.length > 0) {
			const map = this.mapRef.current.leafletElement;  //get native Map instance
			const markerBounds = L.latLngBounds([]);
			markers.forEach(marker => {
// console.log({ marker });
			    markerBounds.extend([marker.lat, marker.lng])
			});
// console.log('map.fitBounds');
			map.fitBounds(markerBounds);
			this.setState({ hasZoomedToMarkers: true });
		}
	}

	zoomToAllMarkers = () => {
		const { waypoints = [] } = this.props;
		const markers = waypoints;
		this.zoomToMarkers(markers, true);
	}

	zoomToFavoriteMarkers = () => {
		const { zoomToMarkers = [], waypoints = [] } = this.props;
		const markers = zoomToMarkers.length > 0 ? zoomToMarkers : waypoints;
		this.zoomToMarkers(markers, true);
	}

	// componentDidMount() {
	// }

	componentWillReceiveProps(nextProps) {
		const { zoomToMarkers = [], waypoints = [] } = nextProps;
		const { zoomToMarkers: prevZoomToMarkers = [] } = this.props;
// console.log('componentWillReceiveProps', JSON.stringify(zoomToMarkers.length), JSON.stringify(prevZoomToMarkers.length));
		// if (zoomToMarkers.length !== prevZoomToMarkers.length) {
		const markers = zoomToMarkers.length > 0 ? zoomToMarkers : waypoints;
		this.zoomToMarkers(markers);
		// }
	}

	overlayAdd = (e) => {
		// console.log('overlayAdd', e);
		const { name } = e;
		const { visibleLayers } = this.state;
		visibleLayers[name] = true;
		this.setState({ visibleLayers });
	}
	overlayRemove = (e) => {
		const { name } = e;
		// console.log('overlayRemove', e, name)
		const { visibleLayers } = this.state;
		visibleLayers[name] = false;
		this.setState({ visibleLayers });
	}

	polylineOptions = () => {
		const { gpxInfo } = this.props;
		const { rangeSteps } = this.state;
		let { maxHslColor } = this.state;
		const { appState } = this.props.stores;
		const { mapColorMode, mapRangeMin, mapRangeMax } = appState;

		let newRangeMin = mapRangeMin;
		let newRangeMax = mapRangeMax;

		if (mapColorMode === 'speed') {
			if (gpxInfo && gpxInfo.speeds && gpxInfo.speeds.length > 0) {
				newRangeMin = Math.floor(Math.min(...gpxInfo.speeds.map(e => e * 3.6)));
				newRangeMax = Math.ceil(Math.max(...gpxInfo.speeds.map(e => e * 3.6)));
			}
		}

		const range = util.range(newRangeMin, newRangeMax, rangeSteps);
		const colors = range.map((e) => {
			const val = normalizeRange(e, newRangeMin, newRangeMax, 0, maxHslColor);
			let colorValue;
			if (mapColorMode === 'speed') {
				colorValue = maxHslColor - val;
			} else {
				colorValue = maxHslColor - val;
			}
			const { r, g, b } = util.hsl2Rgb(colorValue, 100, 45);
			return { color: `rgb(${r}, ${g}, ${b})` };
		});

		appState.setMapRange(range, newRangeMin, newRangeMax);
		appState.setMapColors(colors);
		return colors;
	}

	polylineOptionIdxFn = (latLng) => {
		const { appState } = this.props.stores;
		const { mapRange: altThresholds } = appState;
		// const altThresholds = util.range(MIN_INCLINE, MAX_INCLINE, INCLINE_STEP);
		for (let i = 0; i < altThresholds.length; ++i) {
			if (latLng.meta <= altThresholds[i]) {
				return i;
			}
		}
		return altThresholds.length;
	}

	polylinetrackPointFactory = (data) => {
		const { gpxInfo } = this.props;
		const { appState } = this.props.stores;
		const { mapColorMode, mapRangeMin, mapRangeMax } = appState;


		let dataArray = [];
		if (mapColorMode === 'speed' && gpxInfo.speeds && gpxInfo.speeds.length > 0) {
			dataArray = gpxInfo.speeds.map(e => e * 3.6);
		} else if (gpxInfo && gpxInfo.climbs) {
			dataArray = gpxInfo.climbs;
		}

		const points = data.filter(e => e[0] && e[1] && e[2]).map((item, idx) => {
			const trkpt = L.latLng(item[1], item[0], item[2]);
			if (dataArray && dataArray.length > 0) {
				trkpt.meta = dataArray[idx] || 0;
				if (trkpt.meta > mapRangeMax) {
					trkpt.meta = mapRangeMax;
				}
				if (trkpt.meta < mapRangeMin) {
					trkpt.meta = mapRangeMin;
				}
			} else {
				trkpt.meta = 0;
			}
			return trkpt;
		});
		return points;
	}

	showSpeed = () => {
		const { appState } = this.props.stores;
		appState.setMapColorMode('speed');
	}

	render() {
		const { visibleLayers, mapZoom, bounds = null } = this.state;
		const {
			waypoints = [],
			zoomToMarkers = [],
			geojson,
			gpxInfo,
			mapId = 1,
			center = [61.0779066, 9.800984],
			zoom = 5,
			minZoom = 4,
			maxZoom = 14,
			darkmode,
			height = 500,
			heatmap = [],
			skipGeojson = false,
			zoomToWaypoints = false,
			fullscreenMap = false,

			showSearch = true,
			showZoomControl = true,
			showLayersControl = true,
			showFullscreenControl = true,
			showScaleControl = true,
			showRange = true,

			layersControlPosition = 'topright',
		} = this.props;
		const { appState } = this.props.stores;
		const { mapColorMode, mapRange: range, mapColors: colors, mapRangeMin, mapRangeMax } = appState;

		const tempGeoJson = geojson;
		const track = util.asObject(tempGeoJson, 'features', 0, 'geometry', 'coordinates');
		const hasWaypoints = zoomToMarkers.length > 0 || waypoints.length > 0;

		let startMarker;
		let endMarker;
		const distanceMarkers = [];
		if (track && track[0] && track[0][0]) {
			startMarker = track[0][0] && track[0][0][0] ?  [track[0][0][1], track[0][0][0]] : [track[0][1], track[0][0]];
			endMarker = track[track.length - 1][0] && track[track.length - 1][0][0] ? [track[track.length - 1][0][1], track[track.length - 1][0][0]] : [track[track.length - 1][1], track[track.length - 1][0]];
			if (gpxInfo && gpxInfo.distances) {
				let totalDistance = 0;
				let currentDistance = 0;
				let steps = 10;
				switch (mapZoom) {
					case 15:
						steps = 1;
						break;
					case 14:
						steps = 2;
						break;
					case 13:
						steps = 5;
						break;
					case 12:
						steps = 5;
						break;
					case 11:
						steps = 5;
						break;
					case 10:
						steps = 5;
						break;
					case 9:
						steps = 10;
						break;
					case 8:
						steps = 15;
						break;
					case 7:
						steps = 20;
						break;
					case 6:
						steps = 30;
						break;
					case 5:
						steps = 50;
						break;
					default:
						steps = 100;
						break;
				} 
				// console.log({ mapZoom, steps });
				gpxInfo.distances.forEach((e, idx) => {
					totalDistance += e;
					currentDistance += e;
					if (currentDistance >= steps) {
						currentDistance = 0;
						if (track[idx] && Array.isArray(track[idx])) {
							distanceMarkers.push({
								lat: track[idx][1],
								lng: track[idx][0],
								// icon: wp.icon || 'marker',
								title: Math.floor(totalDistance),
								body: '',
								// color: wp.color,
							});
						}
					}
				});
			}
		}
        const mapChecked = darkmode ? 'OpenStreetMap.Dark' : 'OpenStreetMap.Mapnik';
		return (
			<>
				<div class={`marker-cluster-custom position-relative`} style='height: 100%;'>
					<Map
						key={mapId}
						bounds={bounds}
						ref={this.mapRef}
						// onLoad={(e) => console.log(e)}
						onViewportChanged={this.handleViewportChanged}
						minZoom={minZoom}
						maxZoom={maxZoom}
						// maxBounds={MAX_BOUNDS}
						center={center}
						onClick={this.handleClick}
						onLocationfound={this.handleLocationFound}
						// onLayeradd={(e) => console.log(e)}
						// onOverlayadd={(e) => console.log(e)}
						// ref={(r) => { this.mapRef = r; }}
						zoom={zoom}
						zoomControl={showZoomControl}
						doubleClickZoom={true}
						scrollWheelZoom={true}
						dragging={fullscreenMap || !L.Browser.mobile}
						tap={fullscreenMap || !L.Browser.mobile}
						touchZoom={L.Browser.mobile}
						animate={true}
						easeLinearity={0.35}
						style={`width: 100%; min-height: ${height}px; height: 100%;`} className='h-100'
						onOverlayadd={this.overlayAdd}
						onOverlayremove={this.overlayRemove}
					>
						{showLayersControl && <LayersControl position={layersControlPosition}>
							<BaseLayer checked={mapChecked === 'OpenStreetMap.Mapnik'} name='OpenStreetMap.Mapnik'>
								<TileLayer
									attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
								/>
							</BaseLayer>
							<BaseLayer name='OpenStreetMap.BlackAndWhite'>
								<TileLayer
									attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
								/>
							</BaseLayer>
							{/* <BaseLayer name='OpenStreetMap.Carto'>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
									url='https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
								/>
							</BaseLayer> */}
							{/* <BaseLayer name='OpenStreetMap.Hikemap'>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; wmflabs Hike & Bike'
									url='https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'
								/>
							</BaseLayer> */}
							<BaseLayer checked={mapChecked === 'OpenStreetMap.Dark'}name='OpenStreetMap.Dark'>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
									url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
								/>
							</BaseLayer>
							{/* <BaseLayer name='OpenStreetMap.Hiking'>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
									url=' http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'
								/>
							</BaseLayer> */}

							{/* 
							<Overlay checked name='Layer group with circles'>
								<LayerGroup>
									<Circle center={center} fillColor='blue' radius={200} />
									<Circle
										center={center}
										fillColor='red'
										radius={100}
										stroke={false}
									/>
									<LayerGroup>
										<Circle
											center={circle2}
											color='green'
											fillColor='green'
											radius={100}
										/>
									</LayerGroup>
								</LayerGroup>
							</Overlay>
							<Overlay name='Feature group'>
								<FeatureGroup color='purple'>
									<Popup>Popup in FeatureGroup</Popup>
									<Circle center={circle2} radius={200} />
									<Rectangle bounds={rectangle} />
								</FeatureGroup>
							</Overlay> */}

							{/* <Overlay name='Geoportal.gov.pl'>
								<WMSTileLayer
									layers={'Raster'}
									format={'image/png'}
									transparent={true}
									url='http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer?'
								/>
							</Overlay>
							<Overlay name='Wildfire'>
								<WMSTileLayer
									layers={'GWIS'}
									format={'image/png'}
									transparent={true}
									url={'https://ies-ows.jrc.ec.europa.eu/gwis?language=eng&'}
									attribution={'European Commission, Joint Research Centre'}
								/>
							</Overlay> */}
						</LayersControl>}

						{showFullscreenControl && <FullscreenControl position='topright' />}

						{showScaleControl && <ScaleControl
							metric={true}
							imperial={false}
						/>}

						{/* <ImageOverlay
							url='./assets/515-overlay-v2.png'
							bounds={[
								[52.056765505175235, 15.068457126617433],
								[52.04421634105194, 15.105557441711428],
							]}
						/> */}
						{heatmap && heatmap.length > 0 && <HeatmapLayer
							fitBoundsOnLoad={!hasWaypoints}
							fitBoundsOnUpdate={false}
							points={heatmap}
							longitudeExtractor={m => m[1]}
							latitudeExtractor={m => m[0]}
							intensityExtractor={m => parseFloat(m[2])}
						/>}

						{track && track.length > 0 && <ReactLeafletMultiOptionsPolyline
							ref={this.polyRef}
							positions={this.polylinetrackPointFactory(track)}
							optionIdxFn={this.polylineOptionIdxFn}
							options={this.polylineOptions()}
							weight={7}
							lineCap='butt'
							opacity={0.75}
							smoothFactor={1}
							zoomAnimation={true}
							key={`${mapColorMode}`}
						/>}

						{!skipGeojson && geojson && startMarker && <GeoJSON
							data={geojson}
							style={this.geoJSONStyle}
							onEachFeature={this.onEachFeature}
							onAdd={this.zoomToGeoJSON}
							markersInheritOptions={true}
							filter={this.geoJSONfeature}
						/>}

						
						{startMarker && <Marker position={startMarker} icon={icons.get('marker')}>
							<Popup>
								Start position: {util.format(startMarker[0], 4)}, {util.format(startMarker[1], 4)}
							</Popup>
						</Marker>}
						{endMarker && <Marker position={endMarker} icon={icons.get('flag')}>
							<Popup>
								End position: {util.format(endMarker[0], 4)}, {util.format(endMarker[1], 4)}
							</Popup>
						</Marker>}

						{distanceMarkers && distanceMarkers.length > 0 && <>
							{distanceMarkers.length > 0 && distanceMarkers.map(wp => (
								<Marker
									position={[wp.lat, wp.lng]}
									draggable={false}
									icon={icons.getMarker({
										title: wp.title,
										body: wp.body,
										color: wp.color,
										textColor: darkmode ? '#333' : '#333',
									})}
								>
									<Popup position={[wp.lat, wp.lng]}>
										<h5>{wp.title}</h5>
										<Markdown markdown={wp.body} markdownOpts={MARKDOWN_OPTIONS} />
									</Popup>
								</Marker>
							))}
						</>}

						<MarkerClusterGroup
							maxClusterRadius={10}
							iconCreateFunction={createClusterCustomIcon}
							animate={true}
							fitBoundsOnLoad={zoomToWaypoints}
						>
							{waypoints.length > 0 && waypoints.map(wp => (
								<Marker
									position={[wp.lat, wp.lng]}
									draggable={false}
									icon={icons.getMarker({
										icon: wp.icon || 'marker',
										title: wp.title,
										body: wp.body,
										color: wp.color,
										textColor: wp.textColor,
										width: wp.width,
										height: wp.height,
										classNames: wp.classNames,
										anchorX: wp.anchorX,
										anchorY: wp.anchorY,
									})}
								>
									{/* <Popup position={[wp.lat, wp.lng]}>
										<h5><Markdown markdown={wp.title} markdownOpts={MARKDOWN_OPTIONS} /></h5>
										<Markdown markdown={wp.body} markdownOpts={MARKDOWN_OPTIONS} />
									</Popup> */}
								</Marker>
							))}
						</MarkerClusterGroup>

					</Map>
					
					{showSearch && <div class='position-absolute' style='bottom: 20px; right: 5px; z-index: 99999999;'>
						<button type='button' class='btn btn-sm btn-info' onClick={this.zoomToAllMarkers}><i class='fas fa-search' /></button>
						<button type='button' class='btn btn-sm btn-success ml-1' onClick={this.zoomToFavoriteMarkers}><i class='fas fa-search-location' /></button>
					</div>}

				</div>
				{showRange && range && range.length > 0 && <>
					<div class='mb-4'>
						<div class='float-right mt-1'>
							<div class='px-1 py-0 float-left' style='line-height: 0.8em;'>
								<small>
									<small>
										{util.format(mapRangeMin, 0)}<span class='text-muted'>{mapColorMode === 'speed' ? 'km/t' : '%'}</span>
									</small>
								</small>
							</div>
							{range && range.length > 0 && range.map((val, idx) => (
								<div class='float-left'>
									<div style={`background-color: ${colors[idx].color}; height: 13px; width: 10px;`} />
								</div>
							))}
							<div class='px-1 py-0 float-left' style='line-height: 0.8em;'>
								<small>
									<small>
										{util.format(mapRangeMax, 0)}<span class='text-muted'>{mapColorMode === 'speed' ? 'km/t' : '%'}</span>
									</small>
								</small>
							</div>
						</div>
						{/* <div class='float-right mt-1 clearfix'>
							<button class='btn btn-link' onClick={this.showSpeed}>Show speed</button>
						</div> */}
					</div>
				</>}
			</>
		);
	}
}

export default App;

