'use strict';

var module = angular.module('mySearch', []);

module.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
});

