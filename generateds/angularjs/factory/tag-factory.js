;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('Tag', TagFactory);
            
            /* @ngInject */
            function TagFactory() {
                function Tag(){
                    this.id = null,this.name = ""
                }
                return Tag;
            }
        }());