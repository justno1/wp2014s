
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("get", function (request, response) {
  Parse.Cloud.httpRequest({
    url: 'https://itunes.apple.com/search',
    params: {
      term: request.params.singer 
    },
    success: function (httpResponse) {
      var SongClass = Parse.Object.extend('SongClass');
      var ResObj = JSON.parse(httpResponse.text);
      var newlyCreatedObjList = ResObj.results.map(function(e){
        var object = new SongClass();
        object.set('trackName', e['trackName']);
        return object;
      }); 
      Parse.Object.saveAll(newlyCreatedObjList, {
        success: function(list){
          response.success(request.params.singer+" is awesome!");
        }, error: {
        
        }
      });
    },
    error: function (httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
});


Parse.Cloud.job("iTunesAPI", function(request, status) {
  Parse.Cloud.httpRequest({
    url: 'https://itunes.apple.com/search',
    params: {
      term: request.params.singer
    },
    success: function (httpResponse) {
      var SongClass = Parse.Object.extend('SongClass');
      var ResObj = JSON.parse(httpResponse.text);
      var newlyCreatedObjList = ResObj.results.map(function(e){
        var object = new SongClass();
        object.set('trackName', e['trackName']);
        return object;
      });
      Parse.Object.saveAll(newlyCreatedObjList, {
        success: function(list){
          status.success(request.params.singer+" is awesome!");
        }, error: {}
      });
    },
    error: function (httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
});
