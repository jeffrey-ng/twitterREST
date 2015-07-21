angular.module('tweetCtrl', ['tweetService'])
  .controller('homeTweetController', function(Tweet,User, Auth) {
    var vm = this;

    vm.processing = true;

    vm.loggedIn = Auth.isLoggedIn();

    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;
        Tweet.getHomeTimeline(vm.user.username)
        .success(function(data) {
          vm.processing = false;
          vm.tweets = data;
        });
      });
    //
  });
