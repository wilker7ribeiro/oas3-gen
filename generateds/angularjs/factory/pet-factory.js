;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('Pet', PetFactory);
            
            /* @ngInject */
            function PetFactory() {
                function Pet(){
                    this.id = null,this.category = null,this.name = "",this.photoUrls = [  ],this.tags = [  ],this.status = ""
                }
                return Pet;
            }
        }());