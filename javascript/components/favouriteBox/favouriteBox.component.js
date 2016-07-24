var module = angular.module('mySearch');

module.component('favouriteBox', {
  templateUrl: "components/favouriteBox/favouriteBox.component.html",
  controllerAs: 'model',
  controller: controllerFavourite,
  bindings:{
  	photos: "=",
    remove: "&"
  }
});

function controllerFavourite(){
	var model = this;

	model.removeFavourites = function(){
    model.remove();
	};
}
