var Rota = Rota || {};

Rota.Application = function ($ElementMap, $Direction) {
    var self = this;

    self.options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoom: 12,
        center: new google.maps.LatLng(-23.585055, -46.566496)
    };

    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({ draggable: true });
    if ($ElementMap != null)
        directionsRenderer.setMap(new google.maps.Map($ElementMap[0], self.options));
    if ($Direction != null)
        directionsRenderer.setPanel($Direction[0]);
    self.directionsRenderer = directionsRenderer;

    self.clear = function () {
        $('#directionsPanel').empty();
    };

    self.calculateRoute = function (travelMode, start, end) {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode[travelMode]
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                self.clear();
                self.directionsRenderer.setDirections(response);
            } else {
                alert("Error! See console log for status.");
                console.log(status);
            }
        });
    };

    self.getRoute = function () {
        var routeLeg = self.directionsRenderer.directions.routes[0].legs[0];

        var route = {};
        route.travelMode = self.directionsRenderer.directions.nc.travelMode;
        route.startAddress = routeLeg.start_address;
        route.endAddress = routeLeg.end_address;
        route.start = {
            latitude: routeLeg.start_location.lat(),
            longitude: routeLeg.start_location.lng()
        };
        route.end = {
            latitude: routeLeg.end_location.lat(),
            longitude: routeLeg.end_location.lng()
        };
        route.waypoints = [];

        for (var i = 0; i < routeLeg.via_waypoints.length; i++) {
            route.waypoints[i] = [routeLeg.via_waypoints[i].lat(), routeLeg.via_waypoints[i].lng()];
        }

        return route;
    };


    self.shouldNotify = true;

    self.reloadRoute = function (route, notify) {
        self.shouldNotify = notify ? true : false;
        var googleMapWaypoints = [];
        for (var i = 0; i < route.waypoints.length; i++) {
            googleMapWaypoints[i] = {
                location: new google.maps.LatLng(route.waypoints[i][0], route.waypoints[i][3]),
                stopover: false
            };
        }

        var request = {
            origin: new google.maps.LatLng(route.start.latitude, route.start.longitude),
            destination: new google.maps.LatLng(route.end.latitude, route.end.longitude),
            travelMode: google.maps.DirectionsTravelMode[route.travelMode],
            waypoints: googleMapWaypoints
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                self.clear();
                self.directionsRenderer.setDirections(response);
            } else {
                alert("Error! See console log for status.");
                console.log(status);
            }
            self.shouldNotify = true;
        });
    };
};

Rota.StartPage = function () {
    var self = this;
    self.app = new Rota.Application();
    self.routes = ko.observableArray([]);
    self.travelMode = ko.observable("DRIVING");
    self.start = ko.observable("São Paulo, SP");
    self.end = ko.observable("Rio de Janeiro, RJ");

    self.calculate = function () {
        self.app.calculateRoute(self.travelMode(), self.start(), self.end());
    };

    self.reload = function (route) {
        self.app.AtualizaRotas(route, true);
    };

    self.addRoute = function (route) {
        var routeMatch = ko.utils.arrayFirst(self.routes(), function (item) {
            return route.start.latitude == item.start.latitude && route.start.longitude == item.start.longitude &&
                  route.end.latitude == item.end.latitude && route.end.longitude == item.end.longitude && route.travelMode == item.travelMode;
        });

        if (!routeMatch) {
            self.routes.push(route);
        }
    };
};

