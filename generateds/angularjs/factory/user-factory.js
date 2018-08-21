;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('User', UserFactory);
            
            /* @ngInject */
            function UserFactory() {
                function User(){
                    this.id = null,this.username = "",this.firstName = "",this.lastName = "",this.email = "",this.password = "",this.phone = "",this.userStatus = null
                }
                return User;
            }
        }());