;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('Category', CategoryFactory);
            
            /* @ngInject */
            function CategoryFactory() {
                function Category(){
                    this.id = null,this.name = ""
                }
                return Category;
            }
        }());