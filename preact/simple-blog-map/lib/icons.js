import { DivIcon, Icon } from 'leaflet';
import util from 'preact-util';

const ICONS = {
	adit: new Icon({ iconUrl: '/assets/svg/adit.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	airport: new Icon({ iconUrl: '/assets/svg/airport.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	analyse: new Icon({ iconUrl: '/assets/svg/analyse.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	archaeological: new Icon({ iconUrl: '/assets/svg/archaeological.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	architecture: new Icon({ iconUrl: '/assets/svg/architecture.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	arrow_up: new Icon({ iconUrl: '/assets/svg/arrow_up.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	arrow_up_double: new Icon({ iconUrl: '/assets/svg/arrow_up_double.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	atm: new Icon({ iconUrl: '/assets/svg/atm.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	avatar: new Icon({ iconUrl: '/assets/svg/avatar.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	bag: new Icon({ iconUrl: '/assets/svg/bag.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	bar: new Icon({ iconUrl: '/assets/svg/bar.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	barracks: new Icon({ iconUrl: '/assets/svg/barracks.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	battlefield: new Icon({ iconUrl: '/assets/svg/battlefield.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	beach: new Icon({ iconUrl: '/assets/svg/beach.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	bicycle: new Icon({ iconUrl: '/assets/svg/bicycle.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	boundary_stone: new Icon({ iconUrl: '/assets/svg/boundary_stone.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	buddhism: new Icon({ iconUrl: '/assets/svg/buddhism.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	building: new Icon({ iconUrl: '/assets/svg/building.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	burger: new Icon({ iconUrl: '/assets/svg/burger.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	bus: new Icon({ iconUrl: '/assets/svg/bus.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	bus_stop: new Icon({ iconUrl: '/assets/svg/bus_stop.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cable_car: new Icon({ iconUrl: '/assets/svg/cable_car.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	camera: new Icon({ iconUrl: '/assets/svg/camera.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	camp_site: new Icon({ iconUrl: '/assets/svg/camp_site.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	car: new Icon({ iconUrl: '/assets/svg/car.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	caravan_site: new Icon({ iconUrl: '/assets/svg/caravan_site.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cartography: new Icon({ iconUrl: '/assets/svg/cartography.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cash: new Icon({ iconUrl: '/assets/svg/cash.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	castle: new Icon({ iconUrl: '/assets/svg/castle.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	castle_defensive: new Icon({ iconUrl: '/assets/svg/castle_defensive.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cave_entrance: new Icon({ iconUrl: '/assets/svg/cave_entrance.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cemetery: new Icon({ iconUrl: '/assets/svg/cemetery.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	chapel: new Icon({ iconUrl: '/assets/svg/chapel.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	christianism: new Icon({ iconUrl: '/assets/svg/christianism.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cinema: new Icon({ iconUrl: '/assets/svg/cinema.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cinema_alt: new Icon({ iconUrl: '/assets/svg/cinema_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	city: new Icon({ iconUrl: '/assets/svg/city.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	cityhall: new Icon({ iconUrl: '/assets/svg/cityhall.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	clean: new Icon({ iconUrl: '/assets/svg/clean.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	compass: new Icon({ iconUrl: '/assets/svg/compass.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	compass_alt: new Icon({ iconUrl: '/assets/svg/compass_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	construction: new Icon({ iconUrl: '/assets/svg/construction.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	contour: new Icon({ iconUrl: '/assets/svg/contour.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	court_house: new Icon({ iconUrl: '/assets/svg/court_house.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	crown: new Icon({ iconUrl: '/assets/svg/crown.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	crucifix: new Icon({ iconUrl: '/assets/svg/crucifix.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	data: new Icon({ iconUrl: '/assets/svg/data.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	database: new Icon({ iconUrl: '/assets/svg/database.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	dentist: new Icon({ iconUrl: '/assets/svg/dentist.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	disabled: new Icon({ iconUrl: '/assets/svg/disabled.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	dislike: new Icon({ iconUrl: '/assets/svg/dislike.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	download: new Icon({ iconUrl: '/assets/svg/download.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	drag_lift: new Icon({ iconUrl: '/assets/svg/drag_lift.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	drop: new Icon({ iconUrl: '/assets/svg/drop.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	eye: new Icon({ iconUrl: '/assets/svg/eye.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	facebook: new Icon({ iconUrl: '/assets/svg/facebook.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fire: new Icon({ iconUrl: '/assets/svg/fire.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fishing: new Icon({ iconUrl: '/assets/svg/fishing.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	flag: new Icon({ iconUrl: '/assets/svg/flag.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	forbidden: new Icon({ iconUrl: '/assets/svg/forbidden.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fort: new Icon({ iconUrl: '/assets/svg/fort.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fountain: new Icon({ iconUrl: '/assets/svg/fountain.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fuel: new Icon({ iconUrl: '/assets/svg/fuel.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	fuel_alt: new Icon({ iconUrl: '/assets/svg/fuel_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	gallery: new Icon({ iconUrl: '/assets/svg/gallery.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	gear: new Icon({ iconUrl: '/assets/svg/gear.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	github: new Icon({ iconUrl: '/assets/svg/github.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	go: new Icon({ iconUrl: '/assets/svg/go.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	golf: new Icon({ iconUrl: '/assets/svg/golf.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	heart: new Icon({ iconUrl: '/assets/svg/heart.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	helicopter: new Icon({ iconUrl: '/assets/svg/helicopter.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	home: new Icon({ iconUrl: '/assets/svg/home.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	hospital: new Icon({ iconUrl: '/assets/svg/hospital.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	hostel: new Icon({ iconUrl: '/assets/svg/hostel.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	hotel: new Icon({ iconUrl: '/assets/svg/hotel.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	hotel_alt: new Icon({ iconUrl: '/assets/svg/hotel_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	ice_ring: new Icon({ iconUrl: '/assets/svg/ice_ring.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	information: new Icon({ iconUrl: '/assets/svg/information.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	internet: new Icon({ iconUrl: '/assets/svg/internet.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	invisible: new Icon({ iconUrl: '/assets/svg/invisible.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	islamism: new Icon({ iconUrl: '/assets/svg/islamism.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	island: new Icon({ iconUrl: '/assets/svg/island.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	judaism: new Icon({ iconUrl: '/assets/svg/judaism.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	laptop: new Icon({ iconUrl: '/assets/svg/laptop.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	library: new Icon({ iconUrl: '/assets/svg/library.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	lighthouse: new Icon({ iconUrl: '/assets/svg/lighthouse.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	like: new Icon({ iconUrl: '/assets/svg/like.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	linkedin: new Icon({ iconUrl: '/assets/svg/linkedin.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	lion: new Icon({ iconUrl: '/assets/svg/lion.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	lock: new Icon({ iconUrl: '/assets/svg/lock.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	magnifier: new Icon({ iconUrl: '/assets/svg/magnifier.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	mall: new Icon({ iconUrl: '/assets/svg/mall.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	map: new Icon({ iconUrl: '/assets/svg/map.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	mapkey: new Icon({ iconUrl: '/assets/svg/mapkey.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	mapshakers: new Icon({ iconUrl: '/assets/svg/mapshakers.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	marina: new Icon({ iconUrl: '/assets/svg/marina.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	marker: new Icon({ iconUrl: '/assets/svg/marker.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	market_place: new Icon({ iconUrl: '/assets/svg/market_place.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	mine: new Icon({ iconUrl: '/assets/svg/mine.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	monument: new Icon({ iconUrl: '/assets/svg/monument.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	mountain: new Icon({ iconUrl: '/assets/svg/mountain.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	museum: new Icon({ iconUrl: '/assets/svg/museum.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	music: new Icon({ iconUrl: '/assets/svg/music.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	nature: new Icon({ iconUrl: '/assets/svg/nature.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	nocamera: new Icon({ iconUrl: '/assets/svg/nocamera.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	nonsmoking: new Icon({ iconUrl: '/assets/svg/nonsmoking.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	north: new Icon({ iconUrl: '/assets/svg/north.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	north_alt: new Icon({ iconUrl: '/assets/svg/north_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	north_alt_II: new Icon({ iconUrl: '/assets/svg/north_alt_II.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	north_alt_III: new Icon({ iconUrl: '/assets/svg/north_alt_III.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	oppositeway: new Icon({ iconUrl: '/assets/svg/oppositeway.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	parking: new Icon({ iconUrl: '/assets/svg/parking.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	pharmacy: new Icon({ iconUrl: '/assets/svg/pharmacy.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	picnic_site: new Icon({ iconUrl: '/assets/svg/picnic_site.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	pitch: new Icon({ iconUrl: '/assets/svg/pitch.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	playground: new Icon({ iconUrl: '/assets/svg/playground.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	playground_alt: new Icon({ iconUrl: '/assets/svg/playground_alt.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	police: new Icon({ iconUrl: '/assets/svg/police.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	post_office: new Icon({ iconUrl: '/assets/svg/post_office.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	pub: new Icon({ iconUrl: '/assets/svg/pub.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	restaurant: new Icon({ iconUrl: '/assets/svg/restaurant.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	rocks: new Icon({ iconUrl: '/assets/svg/rocks.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	ruins: new Icon({ iconUrl: '/assets/svg/ruins.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	saddle: new Icon({ iconUrl: '/assets/svg/saddle.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	sailboat: new Icon({ iconUrl: '/assets/svg/sailboat.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	school: new Icon({ iconUrl: '/assets/svg/school.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	seal: new Icon({ iconUrl: '/assets/svg/seal.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	shelter: new Icon({ iconUrl: '/assets/svg/shelter.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	sinkhole: new Icon({ iconUrl: '/assets/svg/sinkhole.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	skype: new Icon({ iconUrl: '/assets/svg/skype.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	smartphone: new Icon({ iconUrl: '/assets/svg/smartphone.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	smoking: new Icon({ iconUrl: '/assets/svg/smoking.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	sport_centre: new Icon({ iconUrl: '/assets/svg/sport_centre.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	spring: new Icon({ iconUrl: '/assets/svg/spring.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	square: new Icon({ iconUrl: '/assets/svg/square.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	stadium: new Icon({ iconUrl: '/assets/svg/stadium.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	star: new Icon({ iconUrl: '/assets/svg/star.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	stop: new Icon({ iconUrl: '/assets/svg/stop.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	stupa: new Icon({ iconUrl: '/assets/svg/stupa.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	supermarket: new Icon({ iconUrl: '/assets/svg/supermarket.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	swimming_pool: new Icon({ iconUrl: '/assets/svg/swimming_pool.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	telephone: new Icon({ iconUrl: '/assets/svg/telephone.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	theatre: new Icon({ iconUrl: '/assets/svg/theatre.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	ticket: new Icon({ iconUrl: '/assets/svg/ticket.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	toilet: new Icon({ iconUrl: '/assets/svg/toilet.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	tower: new Icon({ iconUrl: '/assets/svg/tower.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	town: new Icon({ iconUrl: '/assets/svg/town.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	traffic_signal: new Icon({ iconUrl: '/assets/svg/traffic_signal.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	train: new Icon({ iconUrl: '/assets/svg/train.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	tram: new Icon({ iconUrl: '/assets/svg/tram.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	tram_stop: new Icon({ iconUrl: '/assets/svg/tram_stop.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	tree_cinofer: new Icon({ iconUrl: '/assets/svg/tree_cinofer.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	tree_leaf: new Icon({ iconUrl: '/assets/svg/tree_leaf.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	triangle: new Icon({ iconUrl: '/assets/svg/triangle.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	underground: new Icon({ iconUrl: '/assets/svg/underground.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	unesco: new Icon({ iconUrl: '/assets/svg/unesco.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	university: new Icon({ iconUrl: '/assets/svg/university.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	upload: new Icon({ iconUrl: '/assets/svg/upload.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	viewpoint: new Icon({ iconUrl: '/assets/svg/viewpoint.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	viewtower: new Icon({ iconUrl: '/assets/svg/viewtower.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	village: new Icon({ iconUrl: '/assets/svg/village.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	vineyard: new Icon({ iconUrl: '/assets/svg/vineyard.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	volcano: new Icon({ iconUrl: '/assets/svg/volcano.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	water_tower: new Icon({ iconUrl: '/assets/svg/water_tower.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	water_well: new Icon({ iconUrl: '/assets/svg/water_well.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	watermill: new Icon({ iconUrl: '/assets/svg/watermill.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	waterpark: new Icon({ iconUrl: '/assets/svg/waterpark.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	waterwork: new Icon({ iconUrl: '/assets/svg/waterwork.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	wayside_cross: new Icon({ iconUrl: '/assets/svg/wayside_cross.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	wind_generator: new Icon({ iconUrl: '/assets/svg/wind_generator.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	windmill: new Icon({ iconUrl: '/assets/svg/windmill.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
	zoo: new Icon({ iconUrl: '/assets/svg/zoo.svg', iconSize: [30, 30], iconAnchor: [10, 30] }),
}

class Icons {
    static get(icon) {
        return ICONS[icon] ? ICONS[icon] : ICONS.zoo;
    }

    static list() {
        return Object.keys(ICONS);
    }

	static getDiv({ icon, title, body, color, textColor = '#333333', borderColor = 0, iconWidth = 150, iconHeight = 70 }) {
		const id = `img-${util.randomPassword()}`;
		const { r, g, b } = util.hsl2Rgb(color, 100, 60);
		const { r: wr, g: wg, b: wb } = util.hsl2Rgb(100 - borderColor, 100, 50);
		return new DivIcon({
			iconSize: [iconWidth, iconHeight + 30],
			iconAnchor: [15, iconHeight + 30],
			className: 'my-div-icon',
			html: `<div id='${id}' style='width: ${iconWidth}px; height: ${iconHeight + 30}px; line-height: 1.1em;'>
				<style>
					#${id} .map-marker:after {
						border-top-color: ${color};
					}
				</style>
				<div class='map-marker text-white p-1' style='color: ${textColor}; background-color: ${color}; height: ${iconHeight}px;'>
					<nobr><strong>${title}</strong></nobr><br />
					<span class='font-weight-light'><nobr>${body}</nobr></span>
				</div>
			</div>`,
		});
    }

	static getMarker({ title, body, color, textColor = '#888', borderColor = 0, width = 20, height = 20, anchorX = 10, anchorY = 10, classNames = 'rounded-circle bg-primary text-white text-center' }) {
		const id = `img-${util.randomPassword()}`;
		return new DivIcon({
			iconSize: [width, height],
			iconAnchor: [anchorX, anchorY],
			className: 'my-div-icon',
			html: `<div id='${id}' class='${classNames}' style='width: ${width}px; height: ${height}px;'>
				<strong>${title}</strong><br />
				<span class='font-weight-light'>${body}</span>
			</div>`,
		});
    }

}

export default Icons;
