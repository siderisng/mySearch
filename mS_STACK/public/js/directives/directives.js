angular.module('mySearch').directive('wrap', function() {
    return function (scope, element, attrs) {
        element.height($(window).height() - $('.navbar-header').outerHeight()+120);
    }
});

angular.module('mySearch').directive('wrapmap', function() {
    return function (scope, element, attrs) {
        element.width($('.infoContainer').outerWidth());
    }
});