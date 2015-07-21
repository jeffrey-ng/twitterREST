angular.module('userApp', ['ngAnimate','app.routes','authService','mainCtrl','userCtrl','userService','tweetCtrl','tweetService'])

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });
