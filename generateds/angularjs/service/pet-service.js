;
        (function() {
            'use strict';
            /**
            * @module <modulo>
            */
            angular
                .module('<modulo>.service')
                .service('PetService', PetService);
            
            /* @ngInject */
            function PetService(Restangular) {
                var endpoint = Restangular

                this.addPet = addPet
this.updatePet = updatePet
this.findPetsByStatus = findPetsByStatus
this.findPetsByTags = findPetsByTags
this.getPetById = getPetById
this.updatePetWithForm = updatePetWithForm
this.deletePet = deletePet
this.uploadFile = uploadFile
                    
                
        // post /pet - 
        function addPet(Pet) {
            return endpoint.one('pet').post(Pet)
        };

        // put /pet - 
        function updatePet(Pet) {
            return endpoint.one('pet').put(Pet)
        };

        // get /pet/findByStatus - any
        function findPetsByStatus(status) {
            return endpoint.one('pet').all('findByStatus').get()
        };

        // get /pet/findByTags - any
        function findPetsByTags(tags) {
            return endpoint.one('pet').all('findByTags').get()
        };

        // get /pet/{petId} - Pet
        function getPetById(petId) {
            return endpoint.one('pet').one('petId', petId).get()
        };

        // post /pet/{petId} - 
        function updatePetWithForm(petId) {
            return endpoint.one('pet').one('petId', petId).post()
        };

        // delete /pet/{petId} - 
        function deletePet(api_key,petId) {
            return endpoint.one('pet').one('petId', petId).delete()
        };

        // post /pet/{petId}/uploadImage - ApiResponse
        function uploadFile(petId) {
            return endpoint.one('pet').one('petId', petId).one('uploadImage').post()
        };                    
            }   
        }());