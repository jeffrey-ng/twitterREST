angular.module('tweetService', [])
  .factory('Tweet', function($http) {
  var tweetFactory = {};

  //get single Tweet
  tweetFactory.get = function(id) {
    return $http.get('/api/tweets/' + id);
  };

  //create a tweet
  tweetFactory.create = function(tweetData) {
    return $http.post('/api/tweets/', tweetData);
  };

  //get a profile timeline
  tweetFactory.getProfileTimeline = function(id) {
    return $http.get('/api/tweets/?stream=profile_timeline&username='+id);
  };

  //get a home timeline
  tweetFactory.getHomeTimeline = function(id) {
    return $http.get('/api/tweets/?stream=home_timeline&username='+id);
  };

  //Delete a tweet
  tweetFactory.delete = function(id) {
    return $http.delete('/api/tweets/'+id);
  };

  return tweetFactory;
});
