db.new_stores.aggregate([
    { "$geoNear": {
        "near": {
            "type": "Point",
            "coordinates": [ -81.093699, 32.074673 ]
        },
        "maxDistance": 500 * 1609,
        "spherical": true,
        "distanceField": "distance",
        "distanceMultiplier": 0.000621371
    }}
]).pretty()


https://stackoverflow.com/questions/33864461/mongodb-print-distance-between-two-points


Thanks a lot, it is working perfectly. Curious to know why did you multiply it by 1609? – tryingsomethingnew Nov 23 '15 at 6:14
2
@SiMemon Because there are 1609 meters in a mile, and vice/versa on the distanceMultiplier. The 3963 number you were using is the conversion of "radians" to miles, which when used with GeoJSON point coordinates would be incorrect. Radians are only used with both storage and query are using "legacy coordinate pairs". – Blakes Seven Nov 23 '15 at 6:18
Can we find distance from queried point to multiple geopoints in same query instead of one? – Dileep Paul Oct 1 '18 at 15:15
Could this determine if two circles intersect? That is, suppose I have a collection which contains a latitude and longitude, as well as a radius. Since GeoJSON does not support circles, could I write a query to determine the distance between two points, and then check if that distance is less than the sum of both radii? Would that work and would it be performant? Thanks. – Jamie Corkhill Apr 27 at 22:42
