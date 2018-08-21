;
        (function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.service')
                .service('UserService', UserService);
            
            /* @ngInject */
            function UserService(Restangular) {
                var endpoint = Restangular

                this.createUser = createUser
this.createUsersWithArrayInput = createUsersWithArrayInput
this.createUsersWithListInput = createUsersWithListInput
this.loginUser = loginUser
this.logoutUser = logoutUser
this.getUserByName = getUserByName
this.updateUser = updateUser
this.deleteUser = deleteUser
                    
                
        // post /user - 
        function createUser(User) {
            return endpoint.one('user').post(User)
        };

        // post /user/createWithArray - 
        function createUsersWithArrayInput(bodyObj) {
            return endpoint.one('user').one('createWithArray').post(bodyObj)
        };

        // post /user/createWithList - 
        function createUsersWithListInput(bodyObj) {
            return endpoint.one('user').one('createWithList').post(bodyObj)
        };

        // get /user/login - any
        function loginUser(username,password) {
            return endpoint.one('user').one('login').get()
        };

        // get /user/logout - 
        function logoutUser() {
            return endpoint.one('user').one('logout').get()
        };

        // get /user/{username} - User
        function getUserByName(username) {
            return endpoint.one('user').one('username', username).get()
        };

        // put /user/{username} - 
        function updateUser(User,username) {
            return endpoint.one('user').one('username', username).put(User)
        };

        // delete /user/{username} - 
        function deleteUser(username) {
            return endpoint.one('user').one('username', username).delete()
        };                    
            }   
        }());