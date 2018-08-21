;
        (function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.service')
                .service('StoreService', StoreService);
            
            /* @ngInject */
            function StoreService(Restangular) {
                var endpoint = Restangular

                this.getInventory = getInventory
this.placeOrder = placeOrder
this.getOrderById = getOrderById
this.deleteOrder = deleteOrder
                    
                
        // get /store/inventory - any
        function getInventory() {
            return endpoint.one('store').one('inventory').get()
        };

        // post /store/order - Order
        function placeOrder(Order) {
            return endpoint.one('store').one('order').post(Order)
        };

        // get /store/order/{orderId} - Order
        function getOrderById(orderId) {
            return endpoint.one('store').one('order').one('orderId', orderId).get()
        };

        // delete /store/order/{orderId} - 
        function deleteOrder(orderId) {
            return endpoint.one('store').one('order').one('orderId', orderId).delete()
        };                    
            }   
        }());