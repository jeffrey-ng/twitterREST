angular.module('userService', [])
  .factory('User', function($http) {

    var userFactory = {};

    //get single user
    userFactory.get = function(id) {
      return $http.get('/api/users/' + id);
    };

    //get all users
    userFactory.all = function() {
      console.log('Getting all');
      return $http.get('/api/users/');
    };

    //create a user
    userFactory.create = function(userData) {
      return $http.post('/api/users/', userData);
    };

    //update a user
    userFactory.update = function(id, userData) {
      return $http.put('/api/users/' + id, userData);
    };

    //delete a user
    userFactory.delete = function(id) {
      return $http.delete('/api/users/' + id);
    };

    userFactory.follow = function(followId, myUserData) {
      return $http.put('/api/users/' + followId +'/follow',myUserData);
    }
    userFactory.unfollow = function(unfollowId, myUserData) {
      return $http.put('/api/users/' + unfollowId +'/unfollow',myUserData);
    }

    userFactory.getFollowers = function(id) {
      return $http.get('/api/users/'+id+'/followers');
    }
    userFactory.getFriends = function(id) {
      return $http.get('/api/users/'+id+'/friends');
    }

    return userFactory;
  });
