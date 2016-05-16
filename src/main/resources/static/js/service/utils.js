angular
  .module('app.services')
  .factory('Utils', UtilsService);

function UtilsService() {

  return {
    toMap: toMap
  };

  function toMap(list) {
    return list.reduce(function (map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});
  }

}
