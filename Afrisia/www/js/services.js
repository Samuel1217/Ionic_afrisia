AfrisiaApp
/**
 * For test, we use proxy
  */
    .constant('ApiEndpoint', {
     //    url: 'http://172.16.1.160/back-end/api'
        
        url: 'http://afrisia.yp-apple.com/back-end/api'
        
    })


    //Resort list page directive
    .directive('backImg', function(){
        return function(scope, element, attrs){
            var url = attrs.backImg;
            var content = element.find('a');
            content.css({
                'background-image': 'url(' + url +')',
                'background-position' : 'center top !important',
                'background-size' : 'cover'
            });
        };
    })
    .directive('validNumber', function() {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if(!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^0-9\.]/g, '');
                    var decimalCheck = clean.split('.');

                    if(!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0,2);
                        clean =decimalCheck[0] + '.' + decimalCheck[1];
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function(event) {
                    if(event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })
    
    .directive('map', function() {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&'
                },
            link: function ($scope, $element, $attr) {
                function initialize() {
                        var mapOptions = {
                            // center: new google.maps.LatLng(48.1149103,-1.672612),
                            zoom: 15,
                            zoomControl:false,
                            mapTypeControl:false,
                            scaleControl:false,
                            streetViewControl:false,
                            mapTypeId: google.maps.MapTypeId.Roadmap
                         };
                     var map = new google.maps.Map($element[0], mapOptions);
                     
        //               var marker = new google.maps.Marker({  // this creates a new google map marker 
        //     position: new google.maps.LatLng(48.1149103,-1.672612), // it uses uses the marker position we set above
        //     map: map,  // it grabs the $scope.map which is set to the map we created
        //     // icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' // this is the google maps icon
        //     title: 'Hello World!'
        //   });
                     
                     $scope.onCreate({map: map});
                            // Stop the side bar from dragging when mousedown/tapdown on the map
                     google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                     e.preventDefault();
                     return false;
                 });
                }
                if (document.readyState === "complete") {initialize();
                } else {
                     google.maps.event.addDomListener(window, 'load', initialize);
                }
            }
        }
    })

    .service('ModalService', function($ionicModal, $rootScope) {


        var init = function(tpl, $scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            $scope.openModal = function() {
                $scope.modal.show();
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            return promise;
        }

        return {
            init: init
        }

    })
    .factory('APIService', function ($resource,ApiEndpoint) { // Using ngResource service ,good
        var data = $resource(
            ApiEndpoint.url,
            {},
            {
                login: {
                    url: ApiEndpoint.url + '/user_login',
                    method:'POST'
                },
                register: {
                    url: ApiEndpoint.url + '/user_signup',
                    method:'POST'
                },
                editUser: {
                    url: ApiEndpoint.url + '/user_profile_update',
                    method:'POST'
                },
                forgotPassword: {
                    url: ApiEndpoint.url + '/user_retrieve_password',
                    method:'POST'
                },
                addBusiness: {
                    url: ApiEndpoint.url + '/add_newinstitution',
                    method:'GET'
                },
             
                resortList: {
                    url: ApiEndpoint.url + '/search_business',
                    method:'POST'
                },
                restaurantList: {
                    url: ApiEndpoint.url + '/listRestraurent',
                    method:'GET'
                },
                categoryList: {
                    url: ApiEndpoint.url + '/categoryList',
                    method:'GET'
                },
                topingList: {
                    url: ApiEndpoint.url + '/topingList',
                    method:'GET'
                },
                loadMine: {
                    url: ApiEndpoint.url + '/get_profile',
                    method:'POST'
                },
                addCommentApi: {
                    url: ApiEndpoint.url + '/add_comment',
                    method:'POST'
                },
                orderDetail: {
                    url: ApiEndpoint.url + '/orderDetail',
                    method:'POST'
                },
                contactUs: {
                    url: ApiEndpoint.url + '/send_contact',
                    method:'POST'
                },
                orderNow: {
                    url: ApiEndpoint.url + '/pages/orderNow',
                    method:'POST'
                }
            });
        return data;
    })
    .service('Session', ['$cookieStore', function ($cookieStore) {
        var localStoreAvailable = typeof (Storage) !== "undefined";
        this.store = function (name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                sessionStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            };
        };

        this.persist = function(name, details) {
            if (localStoreAvailable) {
                if (angular.isUndefined(details)) {
                    details = null;
                } else if (angular.isObject(details) || angular.isArray(details) || angular.isNumber(+details || details)) {
                    details = angular.toJson(details);
                };
                localStorage.setItem(name, details);
            } else {
                $cookieStore.put(name, details);
            }
        };

        this.get = function (name) {
            if (localStoreAvailable) {
                return getItem(name);
            } else {
                return $cookieStore.get(name);
            }
        };

        this.destroy = function (name) {
            if (localStoreAvailable) {
                localStorage.removeItem(name);
                sessionStorage.removeItem(name);
            } else {
                $cookieStore.remove(name);
            };
        };

        var getItem = function (name) {
            var data;
            var localData = localStorage.getItem(name);
            var sessionData = sessionStorage.getItem(name);

            if (sessionData) {
                data = sessionData;
            } else if (localData) {
                data = localData;
            } else {
                return null;
            }

            if (data === '[object Object]') { return null; };
            if (!data.length || data === 'null') { return null; };

            if (data.charAt(0) === "{" || data.charAt(0) === "[" || angular.isNumber(data)) {
                return angular.fromJson(data);
            };

            return data;
        };

        return this;
    }])
    .factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
        var self = this;

        // Handle query's and potential errors
        self.query = function (query, parameters) {
            parameters = parameters || [];
            var q = $q.defer();

            $ionicPlatform.ready(function () {
                $cordovaSQLite.execute(db, query, parameters)
                    .then(function (result) {
                        q.resolve(result);
                    }, function (error) {
                        //console.warn('I found an error');
                        //console.warn(error);
                        q.reject(error);
                    });
            });
            return q.promise;
        }

        // Proces a result set
        self.getAll = function(result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }
            return output;
        }

        // Proces a single result
        self.getById = function(result) {
            var output = null;
            output = angular.copy(result.rows.item(0));
            return output;
        }

        return self;
    })
    
    .factory('User', function ($localStorage, $rootScope, $ionicHistory, $state, $ionicLoading, $ionicPopup, APIService, $cordovaFacebook, $cordovaGooglePlus, $location) {
        /***
         * User status manage variables
         var user = {
             id: 0,
             signup_mode: "",
             user_name:"",
             user_password:"",
             user_email:"",
             user_photo_url:"",
             search_text1:"",
             search_text2:"",
             favorit_color:"",
         };
         * $localStorage.loggedIn => bool
         * $localStorage.profile => user profile
         * $localStorage.loginType => email,facebook
       
         */
        var self = this;
        var localStoreAvailable = typeof (Storage) !== "undefined";

        self.isLoggedIn = function () {
            if(localStoreAvailable){
                if($localStorage.loggedIn){
                    return $localStorage.loggedIn;
                }else{
                    return false;
                }
            }
            return false;
        }

        // Get user profile
        self.profile = function () {
            var p = {
                
                id:0,
                user_name:"",
                user_password:"",
                user_email:"",
                user_photo_url:"",
                search_text1:"",
                search_text2:"",
                favorit_color:"",
                signup_mode: "",
          
       
            };
            if(localStoreAvailable){
                if($localStorage.profile){
                    p = JSON.parse($localStorage.profile);
                }
            }
            return p;
        }

        // Store profile
        /**
         * How to use :
         *
         *  
         *  User.store(profile,'email');
         *  User.store(profile,'facebook');
         *
         * @param profile
         * @param loginType
         * @returns {boolean}
         */
        self.store = function (profile,loginType) {
            if(localStoreAvailable){
                $localStorage.profile = JSON.stringify(profile);
                $localStorage.loggedIn = true;
                $localStorage.loginType = loginType;
                return true;
            }
        }
        
        //Store Labels
        self.storeLabel = function(label){
            if(localStoreAvailable){
                $localStorage.label=JSON.stringify(label);
                return true;
            }
        }
        // //Get Labels
        // self.getLabel = function(label){
        //     var p= {
        //         user_id: "",
        //         business_name: "",
        //         business_type: "",
        //         business_localization:"",
        //         search_text: ""
        //     };
        //     if(localStoreAvailable){
        //         if($localStorage.label){
        //             p = JSON.parse($localStorage.label);
        //         }
        //     }
        //     return p;
            
        // } 
       

        // Remove user profile
        self.logout = function (callback) {

            $ionicLoading.show('Logout..');
            //User related
            var loginType = self.getLoginType();
            if(loginType === 'facebook'){
                // Facebook logout
                $cordovaFacebook.logout()
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                        $ionicPopup.alert({
                            title: 'Error',
                            template:'facebook logout error'
                        });
                    });
            }

            //if(localStoreAvailable){
            //    //delete $localStorage.profile;
            //    //delete $localStorage.loginType;
            //    //delete $localStorage.loggedIn;
            //    $localStorage.$reset();
            //    $ionicHistory.clearCache();
            //    $ionicHistory.clearHistory();
            //}

            $localStorage.$reset();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

            if(callback){
                callback();
            }else{
                $rootScope.$broadcast('user:logout',self.profile());
                setTimeout(function () {
                    $ionicLoading.hide();
                    $location.path("/resort-list");
                },1000);
            }
        }

        // Get login type
        self.getLoginType = function () {
            if(localStoreAvailable){
                var p ="email";
                if($localStorage.loginType){
                    p = $localStorage.loginType;
                }
                return p;
            }
        }

        // Set login type
        self.storeLoginType = function (type) {
            if(localStoreAvailable){
                var p = type;
                $localStorage.loginType = p;
                return true;
            }
        }
    
        // Login
        /**
            data = {
                user_email: '',
                user_password: '',
                register_type: 'email',
                logintype_id: ''
            };
            data = {
                user_email: '',
                user_password: '',
                register_type: 'facebook',
                logintype_id: ''
            };
         * @param data
         */
        self.login = function (data,loginType, succCallback, errCallback) {
            try{
                $ionicLoading.show({template:'Login...'});
                APIService.login(
                    data,
                    
                    function (result) {
                        
                        $ionicLoading.hide();
                        // Do success
                        if(result.status==1){
                            //sucess
                            self.store(result.current_user,loginType);
                            succCallback && succCallback();
                        }else{
                            //error
                            
                            errCallback && errCallback(result);
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Info',
                            template: 'Login error!'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }

        self.register = function (data,loginType,succCallback,errCallback) {
            try{
                data.signup_mode=loginType;
                
                console.log(data.user_name);
                console.log(data);
                console.log(loginType);
                $ionicLoading.show({template: 'Registering'});
                APIService.register(
                    data,
                    function(result){
                        console.log(result);
                        $ionicLoading.hide();
                        if(result.status==1){
                           
                            self.store(result.current_user,loginType);
                                              
                            succCallback && succCallback(result);
                        }else{
                            errCallback && errCallback(result);
                        }
                    },
                    function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Register Error',
                            template: 'Server connect error'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }

       
        self.forgotPassword = function (data,succCallback) {
            try{
                $ionicLoading.show({template:'Sending...'});
                APIService.forgotPassword(
                    data,
                    function (result) {
                        console.log(result);
                        $ionicLoading.hide();
                        // Do success
                        if(result.status!=2){
                            //sucess
                            $ionicPopup.alert({
                                title:"Check out",
                 //            template: result.msg
                               template: "But this fuction is not allowed in local service"
                            });
                            succCallback && succCallback();
                        }else{
                            //error
                            $ionicPopup.alert({
                                title:"Confirm!",
                                template: result.msg
                            });
                        }
                    }, function (err) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Info',
                            template: 'Server connect error'//JSON.stringify(err)
                        });
                    }
                );
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }
        /**
         * Check user login data is valid or not
         * @param data
         * @returns {boolean}
         */
        self.isValidInfo = function(data){
            if(!data)return false;
            if(!data.user_email || !data.user_password){
                return false;
            }else{
                return true;
            }
        }

        self.confirmExit = function (callback) {
            $ionicPopup.confirm({
                title: 'Warning',
                template: 'Do you want to exit and close the application? All data will be lost'
            }).then(function(res) {
                callback && callback(res);
            })
        }

        return self;
    })
    .factory('xmlParser', function () {
        var x2js = new X2JS();
        return {
            xml2json: function (args) {
                return angular.bind(x2js, x2js.xml2json, args)();
            },
            xml_str2json: function (args) {
                return angular.bind(x2js, x2js.xml_str2json, args)();
            },
            json2xml_str: function (args) {
                return angular.bind(x2js, x2js.json2xml_str, args)();
            }
        }
    })
    