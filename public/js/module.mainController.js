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

    var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            //console.log('key: ' + key + ', val: ' + $files[key]);
            formdata.append(key, value);
        });
    };

    $scope.uploadFiles = function(url, fileType, uid) {
        var request = {
            method: 'POST',
            url: url,
            params: {
                type: fileType,
                id: uid
            },
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };
        console.log('the request built is ', request);
        if(fileType === 'image') {
            myCtrl.uploadFile.image(request);
        } else if(fileType === 'audio') {
            myCtrl.uploadFile.audio(request);
        } else if(fileType === 'video') {
            myCtrl.uploadFile.video(request);
        } else if(fileType === 'document') {
            myCtrl.uploadFile.document(request);
        } else {
            console.error('Error, invalid file type');
        }
    };

    myCtrl.init = function(uid) {
        myCtrl.currentUser = uid;
        console.log('user id set: ', myCtrl.currentUser);
    };

    myCtrl.uploadFile = {
        image: function(request) {
            //console.log('called the image upload function from scope, request is: ', request);
            $http(request).success(function(res) {
                console.log('data returned: ', res);
            })
                .error(function(err) {
                    console.error('Error with request');
                });
        },
        audio: function(request) {
            console.log('called the audio upload function from scope, request is: ', request);
            $http(request).success(function(res) {
                console.log('data returned back to angular: ', res);
                switch(res.type) {
                    case 'audio':                        
                        //var obj = res;
                        res.url = myCtrl.icons.audioUrl;
                        myCtrl.media.audio.push(res);
                        console.log('the array is now: ', MyPiFactory.media.audio);
                        break;
                    case 'video':
                        console.log('video type');
                        //var obj = res;
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
                $location.path('/audio');
            })
                .error(function(err) {
                    console.error('Error with request');
                });
        },
        video: function(request) {
            console.log('called the video upload function from scope, request is: ', request);
            $http(request).success(function(res) {
                console.log('data returned: ', res);
            })
                .error(function(err) {
                    console.error('Error with request');
                });
        },
        document: function(request) {
            console.log('called the document upload function from scope, request is: ', request);
            $http(request).success(function(res) {
                console.log('data returned: ', res);
            })
                .error(function(err) {
                    console.error('Error with request');
                });
        },
        progress: function(evt) {
            var percent = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + percent + '%' + evt.config.data.file.name);
        }
    };

    myCtrl.redirect = function(url) {
        console.log('location switch call: ', url);
        $location.path(url);
    };
}