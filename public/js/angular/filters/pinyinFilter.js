angular.module('woxuexiApp')
.filter('pinyinFilter', [
  '$filter',
  function($filter) {
    return function(text, accent) {
      if (text === undefined) {
        return '';
      }
      if (accent === undefined) {
        return text;
      }
      var out = '';
      var currentChar = '';
      var accentOn = false;
      for (var index = 0; index < text.length; index++) {
        currentChar = text.charAt(index);
        if (currentChar.match(/a|e|i|o|u/) && accentOn === false) {
          out += $filter('accentFilter')(accent, currentChar);
          accentOn = true;
        } else {
          out += currentChar;
        }
      }
      return out;
    };
  }]
);
