angular.module('woxuexiApp')
.filter('accentFilter', [
  function() {
    return function(text, char) {
      var accents = {
        ' ': ['\u00B7', '¯', '´', 'ˇ', '`'],
        a: ['a', '\u0101', '\u00E1', '\u01CE', '\u00E0'],
        e: ['e', '\u0113', '\u00E9', '\u011B', '\u00E8'],
        i: ['i', '\u012B', '\u00ED', '\u01D0', '\u00EC'],
        o: ['o', '\u014D', '\u00F3', '\u01D2', '\u00F2'],
        u: ['u', '\u016B', '\u00FA', '\u01D4', '\u00F9'],
        ü: ['ü', '\u01D6', '\u01D8', '\u01DA', '\u01DC']
      };
      var out = '';
      if (char === undefined) {
        return accents[' '][text];
      } else if (char.match(/ |a|e|i|o|u|ü/) === null) {
        return accents[' '][text];
      } else {
        return accents[char][text];
      }
    };
  }]
);
