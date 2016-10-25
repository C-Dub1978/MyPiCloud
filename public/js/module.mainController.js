/**
 * Created by foolishklown on 9/29/2016.
 */
angular.module('MyPiCloud')
    .directive('ngFiles', ['$parse', function ($parse) {
        function fn_link(scope, element, attrs) {
            console.log('directive called');
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
            console.log('element after change listener', element);
        }
        return {
            link: fn_link
        }
    } ])
    .controller('MyPiController', [
        '$http',
        '$scope',
        '$timeout',
        'Upload',
        '$location',
        'MyPiFactory',
        myPiContFunc
    ]);

function myPiContFunc($http, $scope, $timeout, Upload, $location, MyPiFactory) {
    console.log('Main Controller set');

    var myCtrl = this;    
    var alertError = ['alert','alert-danger'];    
    
    myCtrl.media = MyPiFactory.media;
    myCtrl.icons = MyPiFactory.imageUrl;
    myCtrl.currentUser = '';
    myCtrl.info = '';
    myCtrl.theFile = null;
    $scope.finderLoader = false;

    var formdata = new FormData();

    $scope.getTheFiles = function ($files) {
        if($files == null) {
            formdata = new FormData();
        } else {
            angular.forEach($files, function (value, key) {
                formdata.append(key, value);
            });
        }
        myCtrl.theFile = $files;
        console.log('the file is: ', myCtrl.theFile);
    };

    $scope.uploadFiles = function(url, fileType, uid, info) {
        console.log('checking to see about the scope files variable: ', myCtrl.theFile);
        if(!info) {
            info = 'Unkown';
        }
        if(myCtrl.theFile === null || myCtrl.theFile.length === 0) {
            return;
        } else {

            var request = {
                method: 'POST',
                url: url,
                params: {
                    type: fileType,
                    id: uid,
                    info: info
                },
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };
            console.log('the request built is ', request);
            myCtrl.uploadFile.file(request);
        }
    };

    myCtrl.init = function(uid) {
        myCtrl.currentUser = uid;
        var getAllReq = {
            method: 'GET',
            url: '/dashboard/getAll',
            params: {
                id: uid
            }
        };
        $http(getAllReq)
            .then(function successCallback(res) {
                if(res.data.media) {
                    console.log('all media sent from db: ', res.data.media);
                    var audio = res.data.media.audio;
                    var video = res.data.media.video;
                    var image = res.data.media.image;
                    var document = res.data.media.image;
                    myCtrl.addIndividualMedia(audio, 'audio');
                    myCtrl.addIndividualMedia(video, 'video');
                    myCtrl.addIndividualMedia(image, 'image');
                    myCtrl.addIndividualMedia(document, 'document');
                } else {
                    return;
                }
            },
            function errorCallback() {
                console.error('Error getting all media back from server');
            });
    };

    myCtrl.uploadFile = {
        file: function(request) {
            $scope.finderLoader = true;
            $http(request)
                .success(function (res) {
                    myCtrl.checkType(res, res.type);
                    $scope.getTheFiles(null);
                    myCtrl.info = '';
                    $scope.finderLoader = false;
                });
        }
    };

    myCtrl.downloadFile = function(url, reqType, fileType, uid, info, formData, location, name) {
        console.log('download file clicked');
        var request = MyPiFactory.request(url, reqType, fileType, uid, info, formData, location, name);
        console.log('request built is: ', request);
        $http(request)
            .then(function successCallback(res) {
                console.log('got successful response from download file: ', typeof(res));
            },
            function errorCallback(res) {
                console.error('bad response in download file: ', res);
            });
    };

    myCtrl.redirect = function(url) {
        console.log('location switch call: ', url);
        $location.path(url);
    };

    myCtrl.addIndividualMedia = function(array, type) {
        console.log('we are adding individual objects into the ' + type + ' array');
        for(var i = 0; i < array.length; i++) {
            if(type === 'audio') {
                myCtrl.media.audio.push(array[i]);
            } else if(type === 'video') {
                myCtrl.media.video.push(array[i]);
            } else if(type === 'image') {
                myCtrl.media.image.push(array[i]);
            } else if(type === 'document') {
                myCtrl.media.document.push(array[i]);
            } else {
                return;
            }
        }
    };

    myCtrl.streamMedia = function(ref) {
        console.log('need to stream file: ', ref);
    };

    myCtrl.removeFile = function(url, reqType, fileType, uid, ref) {
        console.log('need to remove file: ', ref);
        var req = MyPiFactory.request(url, reqType, fileType, uid, ref, 'none');
        $http(req).success((res) => {
            console.log('request sent back from file deletion in http call: ', res);
            var currentArray;
            if(fileType === 'audio') {
                currentArray = myCtrl.media.audio;
            } else if(fileType === 'video') {
                currentArray = myCtrl.media.video;
            } else if(fileType === 'image') {
                currentArray = myCtrl.media.image;
            } else if(fileType === 'document') {
                currentArray = myCtrl.media.document;
            } else {
                console.error('File type not found');
            }
            console.log('media array before splice removal: ', currentArray);
            for(var i = 0; i < currentArray.length; i++) {
                if(ref === currentArray[i].ref) {
                    currentArray.splice(i, 1);
                }
            }
            console.log('media array after splice removal: ', currentArray);
        })
    };

    myCtrl.checkType = function(res, type) {
        switch(type) {
            case 'audio':
                res.url = myCtrl.icons.audioUrl;
                myCtrl.media.audio.push(res);
                console.log('the array is now: ', MyPiFactory.media.audio);
                break;
            case 'video':
                console.log('video type');
                res.url = myCtrl.icons.videoUrl;
                myCtrl.media.video.push(res);
                console.log('the array is now: ', myCtrl.media.video);
                break;
            case 'image':
                console.log('image type');
                //var obj = res;
                res.url = myCtrl.icons.imageUrl;
                myCtrl.media.image.push(res);
                console.log('the array is now: ', myCtrl.media.image);
                break;
            case 'document':
                console.log('document type');
                //var obj = res;
                res.url = myCtrl.icons.documentUrl;
                myCtrl.media.document.push(res);
                console.log('the array is now: ', myCtrl.media.document);
                break;
            default:
                console.log('unkown type returned');
                break;
        }
    }
}