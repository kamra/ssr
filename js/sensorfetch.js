//var url = "http://130.240.134.126:1026/v1/queryContext";
var QueryURL = "https://staff.www.ltu.se/~gusste/proxy.php"; // use this to fetch sensor data
var QueryURLPOIRadial = "https://staff.www.ltu.se/~gusste/proxy_poi_rad.php"; // use this to fetch nearby sensors
var QueryURLPOIBox = "https://staff.www.ltu.se/~gusste/proxy_poi_box.php"; // use this to fetch nearby sensors

//------------------------------------------------------------------------------
/**
   Fetch sensors by radius and polar latitude+longitude coordinates
   @param location is the latitude and longitude position of the search area
   @param radius is the radial distance from the point defined by location
   @param callback is a function callback which gets run when the fetch is complete
*/
function FetchSensorsRadius(location, radius, callback)
{
	var json = { lat: location.lat, lon: location.lon, radius: radius, component: "fw_core", category: "sensor", max_results: 30 };
 	SendToFiWarePost(QueryURLPOIRadial, json, callback);
}

//------------------------------------------------------------------------------
/**
   Fetch sensors based on a bounding box
   @param min is the box min-value as {x, y}
   @param max is the box max-value as {x, y}
   @param callback is a function callback which gets run when the fetch is complete
*/
function FetchSensorsBox(min, max, callback)
{
	var json = { north: max.y, south: min.y, east: max.x, west: min.x, component: "fw_core", category: "sensor", max_results: 30 };
 	SendToFiWarePost(QueryURLPOIBox, json, callback);
}

//------------------------------------------------------------------------------
/**
   Brute force method which fetches ALL sensors
   @param callback is a function callback which gets run when the fetch is complete
   @param type is the type of the sensor
*/
function FetchAllSensors(callback, type)
{
	var json = { entities: [{id: " *", type:type, isPattern:"true"}], attributes: []};
 	SendToFiWarePost(QueryURL, json, callback);
}

//------------------------------------------------------------------------------
/**
   Fetches a single sensor
   @param id is the name of the sensor
   @param type is the type of sensor
   @param attributes is a list of strings which represents the values to fetch, if empty gives all attributes
   @param callback is a function callback which gets run when the fetch is complete
*/
function FetchSensor(id, type, attributes, callback)
{
	var json = { entities: [{id: id, type:type, isPattern:"false"}], attributes: attributes};
	SendToFiWarePost(QueryURL, json, callback);
}

//------------------------------------------------------------------------------
/**
   Fetches a bunch of sensors
   @param ids is an array of sensors to fetch
   @param type is the type of sensor
   @param attributes is a list of strings which represents the values to fetch, if empty, gives all attributes
   @param callback is a function callback which gets run when the fetch is complete
*/
function FetchSensors(ids, type, attributes, callback)
{
	var entities = [];
	for (var i = 0; i < ids.length; i++)
	{
		entities.append({id: ids[i], type:type, isPattern:"false"});
	}
	var json = { entities: entities, attributes: attributes};
	SendToFiWarePost(QueryURL, json, callback);
}

//------------------------------------------------------------------------------
/**
   Serializes JSON object to string and sends to FiWare (using POST), runs callback with response text.
   @param url is the query url
   @param json is the JSON object to send to FiWare.
   @param callback is a function which gets called with a JSON parsed object of the response
*/
function SendToFiWarePost(url, json, callback)
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(e)
	{
		if (this.readyState == 4 && this.status == 200)
		{
			try 
			{
				var json = JSON.parse(this.responseText);
			}
			catch (e)
			{
				alert(this.responseText);
				return;
			}
			callback(json);
		}
	}
	req.open("POST", url, true);
	req.send(JSON.stringify(json));
}

//------------------------------------------------------------------------------
/**
   Send query to FiWare using GET, so all arguments must be passed in the url
   @param url is the query url
   @param callback is a function which gets called with a JSON parsed object of the response
*/
function SendToFiWareGet(url, callback)
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(e)
	{
		if (this.readyState == 4 && this.status == 200)
		{
			try 
			{
				var json = JSON.parse(this.responseText);
			}
			catch (e)
			{
				alert(this.responseText);
				return;
			}
			callback(json);
		}
	}
	req.open("GET", url);
	req.send();
}
