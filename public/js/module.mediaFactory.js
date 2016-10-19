/**
 * Created by foolishklown on 9/29/2016.
 */
angular.module('MyPiCloud')
    .factory('MyPiFactory', [
        myPiFactFunc
    ]);

function myPiFactFunc() {
    console.log('Factory Function initialized');

    var factory = this;

    factory.userMedia = {
        audio: [],
        video: [],
        image: [],
        document: []
    };

    factory.images = {
        audioUrl: '../img/audio.png',
        videoUrl: '../img/video.png',
        imageUrl: '../img/image.png',
        documentUrl: '../img/document.png'
    };

    factory.buildRequest = function(url, reqType, fileType, uid, info, formData, location, contentType) {
        var request = {
            method: reqType,
            url: url,
            params: {
                type: fileType || '',
                id: uid || '',
                info: info || '',
                location: location || ''
            },
            data: formData || '',
            headers: {
                'Content-Type': contentType || undefined
            }
        };
      return request;
    };

    return {
        media: factory.userMedia,
        imageUrl: factory.images,
        request: factory.buildRequest
    }
}