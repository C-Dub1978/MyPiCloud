/**
 * Created by foolishklown on 9/29/2016.
 */
angular.module('MyPiCloud')
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/templates/home.html',
            controller: 'MyPiController'
        });
        $routeProvider.when('/audio', {
            templateUrl: '/templates/audio.html',
            controller: 'MyPiController'
        });
        $routeProvider.when('/video', {
            templateUrl: '/templates/video.html',
            controller: 'MyPiController'
        });
        $routeProvider.when('/image', {
            templateUrl: '/templates/image.html',
            controller: 'MyPiController'
        });
        $routeProvider.when('/document', {
            templateUrl: '/templates/document.html',
            controller: 'MyPiController'
        });
        $routeProvider.when('/home', {
            templateUrl: '/templates/home.html',
            controller: 'MyPiController'
        });
        $routeProvider.otherwise({
            redirectTo: '/templates/home.html',
            controller: 'MyPiController'
        });

});
