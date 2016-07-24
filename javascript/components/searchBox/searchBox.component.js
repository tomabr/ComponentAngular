
var module = angular.module('mySearch');

module.service('flickrService', FlickrService);
module.constant('apiKey', 'f8ce2d65669e201b2b50723818e2b16b');

module.component('searchBox', {
  templateUrl: "components/searchBox/searchBox.component.html",
  controllerAs: 'model',
  controller: controller
});


function controller(flickrService, $window, $document, $sce) {
  var model = this;

  model.searchTerm = undefined;
  var term;
  model.favouritePhotos = [];


  angular.element($window).bind("scroll", function() {
    var move = $window.innerHeight + $window.pageYOffset;
    var height = $($document).height();

    if (move === height) {
      flickrService.get(term).then(function(response) {
        model.photos = response;
      });
    }
  });


  model.search = function(searchTerm) {
    term = searchTerm;
    flickrService.clearPhotos();
    flickrService.get(term).then(function(response) {
      model.photos = response;
    });
  };

  model.removeAll = function(){
    model.favouritePhotos = [];
  };


  model.addToFavourite = function(photo){
    model.favouritePhotos.push(photo);
    model.favouritePhotos = Array.from(new Set(model.favouritePhotos));
  };
}

function FlickrService($http, $q, apiKey, $sce) {
  var apiURL = 'https://api.flickr.com/services/rest/';
  var urlPhotos = [];
  var page = 1;

  return {
    clearPhotos: function() {
      urlPhotos = [];
      page: 1;
    },

    get: function(searchTerm) {
      var params = {
        text: searchTerm,
        method: 'flickr.photos.search',
        api_key: encodeURIComponent(apiKey),
        format: 'json',
        per_page: 40,
        nojsoncallback: 1,
        page: page
      };

      page += 1;

      var url = apiURL + '?' + $.param(params);
      var deferred = $q.defer();
      $http.get(url).then(function(response) {

        var data = response.data;

        if (data.stat === 'fail') {
          return deferred.reject({ message: 'Problem with connection' });
        } else if (data.photos.pages === 0) {
          return deferred.reject({ message: 'Not found photos' });
        } else if (data.photos.page > data.photos.pages) {
          return deferred.reject({ message: 'Not more photos' });
        } else {

          var photos = data.photos.photo;

          angular.forEach(photos, function(photo) {

            var img = $sce.trustAsResourceUrl('https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
              '/' + photo.id + '_' + photo.secret + '_q' + '.jpg');

            var obj = {
              url: img,
              title: photo.title
            };

            urlPhotos.push(obj);
          });

          deferred.resolve(urlPhotos);
        }
      }, function(response) {
        deferred.reject({ message: 'Problem with connection' });
      });

      return deferred.promise;
    }
  };
}
