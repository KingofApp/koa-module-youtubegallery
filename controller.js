angular
  .controller('youtubeGalleryCtrl', loadFunction);

loadFunction.$inject = ['$http','$scope', 'structureService', '$location', '$routeParams', '$filter'];

function loadFunction($http, $scope, structureService, $location, $routeParams, $filter){
  //Register upper level modules
  structureService.registerModule($location,$scope,"youtubegallery");
  var moduleConfig = angular.copy($scope.youtubegallery.modulescope);

  $scope.visualization = moduleConfig.visualization || 'card';

  $http.get('https://www.googleapis.com/youtube/v3/search',{  params: {
          channelId : moduleConfig.channelid,
          part      : "snippet",
          order     : "date",
          key       : moduleConfig.token
      }}
    ).success(function(data){

      var elements = [];
      angular.forEach( data.items, function(item){
        if(item.id.videoId){
          elements.push({
            link    :  moduleConfig.childrenUrl.youtubevideo+'?video='+item.id.videoId,
            title   : item.snippet.title,
            img     : item.snippet.thumbnails.medium.url,
            channel : item.snippet.channelTitle,
            publish : moment(item.snippet.publishedAt).format($filter('translate')('youtube-gallery.dateFormat'))
          });
        }
      });
      $scope.youtubegallery.items = elements;
    }).error(function(data, error){
    	$scope.youtubegallery.message = 'Opps! There was a problem loading the feed! '+data.error.message;
    });
}
