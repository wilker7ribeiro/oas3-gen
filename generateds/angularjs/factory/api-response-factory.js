;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('ApiResponse', ApiResponseFactory);
            
            /* @ngInject */
            function ApiResponseFactory() {
                function ApiResponse(){
                    this.code = null,this.type = "",this.message = ""
                }
                return ApiResponse;
            }
        }());