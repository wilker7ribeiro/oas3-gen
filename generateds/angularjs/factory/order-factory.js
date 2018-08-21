;(function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.factory')
                .factory('Order', OrderFactory);
            
            /* @ngInject */
            function OrderFactory() {
                function Order(){
                    this.id = null,this.petId = null,this.quantity = null,this.shipDate = null,this.status = "",this.complete = false
                }
                return Order;
            }
        }());