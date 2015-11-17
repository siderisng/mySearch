//This module is used to provide authentication etc.
//This solution does not belong to me. It has been written
//by Deividi Cavarzan in a solution he gave to Stack Overflow
//http://stackoverflow.com/questions/17982868/angularjs-best-practice-for-ensure-user-is-logged-in-or-out-using-cookiestore

angular.module('Auth', [
        'ngCookies'
    ])
    .factory('Auth', ['$cookieStore', function ($cookieStore) {

        var _user = {};

        return {

            user : _user,

            set: function (_user) {
                // you can retrive a user setted from another page, like login sucessful page.
                existing_cookie_user = $cookieStore.get('current.user');
                _user =  _user || existing_cookie_user;
                $cookieStore.put('current.user', _user);
            },

            remove: function () {
                $cookieStore.remove('current.user', _user);
            }
        };
    }])
;