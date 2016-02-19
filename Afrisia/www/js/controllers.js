/**
 * Login type: Guest,Email,Fb,Google
 * Default Login type:Guest
 */

AfrisiaApp
        .controller('MainCtrl', function ($scope, $rootScope, $cordovaNetwork, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaInAppBrowser, $cordovaFacebook, $localStorage, $location, $cordovaGooglePlus, $ionicHistory, $ionicSideMenuDelegate, $state, $ionicPopup, $ionicLoading, APIService, User, Cart) {
            $scope.init = function () {
                //User manage part
                $rootScope.loginType = User.getLoginType();
                $rootScope.loggedin = User.isLoggedIn();
                $scope.user = User.profile();
                $scope.login_data = {
                    user_email: '',
                    user_password: '',
                };
                $scope.register_data = {
                    signup_mode: "",
                    user_name:"",
                    user_password:"",
                    user_email:"",
                    user_photo_data:"",
                    user_search_text1:"",
                    user_search_text2:"",
                    user_favor_color:"",
                };
                $scope.forgot_data = {
                    user_email:''
                }
                $scope.capture_image = '';
                
                /////////////////////////////////////////////
                $rootScope.active_label = null;
                            
                $scope.$on('$ionicView.afterEnter', function() {
                    $rootScope.loginType = User.getLoginType();
                    $rootScope.loggedin = User.isLoggedIn();

                    if($rootScope.loggedin){
                        $location.path("/resort-list");
                        var user = User.profile();
                        $scope.login_data = {
                            user_email: user.user_email,
                            user_password: user.user_password,
                        };
                        console.log("mainctrl:"+user);
                        User.login(
                            $scope.login_data,
                            'email',
                            function () {
                                $rootScope.updateUser();
                            },
                            function (error) {
                                User.logout();
                                $rootScope.updateUser();
                                $rootScope.$broadcast('user:logout',User.profile());
                                //Cart related                        
                                $location.path('/resort-list');
                            }
                        );
                        $rootScope.$broadcast('userLoggedIn');
                     
       
                
      
                
       
                    }               
                });
                $scope.$on('$ionicView.enter', function(){
                    $ionicSideMenuDelegate.canDragContent(false);
                });
                $scope.$on('$ionicView.leave', function(){
                    $ionicSideMenuDelegate.canDragContent(true);
                });
                $scope.$on('user:logout', function(data) {
                    $scope.user = User.profile();
                    $rootScope.loggedin = User.isLoggedIn();
                    $rootScope.updateUser();
                });

                $ionicHistory.nextViewOptions({
                    //disableAnimate: true,
                    disableBack: true
                });
            }
        })
       .controller('NavCtrl', function($scope, $state, $rootScope, $location, $ionicHistory,$ionicLoading, $localStorage, $ionicSideMenuDelegate, User) {

            $scope.init = function(){
                $scope.user_image = null;
                $scope.user_name = null;
                $rootScope.updateUser();
                $scope.label = {
                    user_id: "",
                    business_name: "",
                    business_type: "",
                    business_address:"",
                    search_text: ""
                    
                }
                var user = User.profile();
                if( User.isLoggedIn()){
                    
                    $scope.user_image = user.user_photo_url;
                    $scope.user_name = user.user_name;
                    $scope.business_count=user.user_business_count;
                    $scope.comment_count=user.user_comment_count;
                    $scope.favorit_count=user.user_favor_count;
                    
                }
            
            }

            $rootScope.showMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };
            

            $rootScope.showRightMenu = function () {
                $location.path('/about');
                //$ionicSideMenuDelegate.toggleRight();
            };
            // go to profile
            $rootScope.goToProfile = function () {
                $state.go('profile');
            };

            $scope.$on('userLoggedIn',function() {
                var user = User.profile();
                $scope.user_image = user.user_photo_url;
                $scope.user_name = user.user_name;
                $scope.loginType = User.getLoginType();
                $scope.loggedin = User.isLoggedIn();
                $scope.business_count=user.user_business_count;
                $scope.comment_count=user.user_comment_count;
                $scope.favorit_count=user.user_favor_count;
                console.log(user);
                //Label
                $scope.label.user_id=user.user_id;
                $scope.label.search_text=user.user_search_text1+","+user.user_search_text2;
                
                console.log($scope.label);
                $localStorage.label=JSON.stringify($scope.label);
                console.log($localStorage.label);
            
                
                
            
            });

            $rootScope.updateUser = function () {
                var user = User.profile();
                $scope.user_image = user.user_image;
                $scope.user_name = user.user_name;
                $scope.loginType = User.getLoginType();
                $scope.loggedin = User.isLoggedIn();
                
                
            };

            $scope.login = function(){
                $location.path('/login');
            };
    
            $scope.contact = function(){
                $location.path('/contact');
            };
            $scope.goTomyInstall = function(){
                $location.path('/myinstall');
            };
            $scope.goTomyfavorit = function(){
                $location.path('/myfavorit');
            };
            $scope.goTomyComment = function(){
                $location.path('/mycomment');
            };
        

            $scope.signup = function(){
                $location.path('/register');
            };
    
    
            $scope.logout = function(){
                User.logout();
                $location.path('/resort-list');
                $ionicSideMenuDelegate.toggleLeft(false);
            //  $rootScope.$broadcast('user:logout',User.profile());
            
        
            
            };

            $scope.$on('$ionicView.afterEnter', function() {
                $ionicLoading.hide();
                $rootScope.updateUser();
                console.log($localStorage.label);
            
            
            });
            $scope.$on('user:logout', function() {
                $rootScope.updateUser();
            
            });

        
     })
    

     
    .controller('ResortListCtrl', function ($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
        //  console.log(item);
       
        $scope.init = function () {
            $scope.label = {
                user_id: "",
                business_name: "",
                business_type: "",
                business_address:"",
                search_text: ""
                
            }
            if(!$localStorage.label){
                $localStorage.label=JSON.stringify($scope.label);
            }
            $scope.data = {
                showDelete: false
            };
            $scope.items=[];
            $scope.active_search="";
            $rootScope.active_business = null;
            
            $scope.loadResortList();
          
        }
        // if($localStorage.label){
        //     $scope.label=JSON.parse($localStorage.label);
        // }

      

        $scope.share = function(item) {
            console.log(item);

            var resort = item;
            console.log(resort);
            try{
                $ionicLoading.show({template:'Find SNS..'});
                $cordovaSocialSharing.share(resort.business_name, "AFRISIA", resort.business_photo_url, null)
                    .then(function(result) {
                        $ionicLoading.hide();
                    }, function(error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Error',
                            template:'Cannot share'
                        });
                    });
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        };
        
        
        $scope.moveItem = function(item, fromIndex, toIndex) {
            $scope.items.splice(fromIndex, 1);
            $scope.items.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function(item) {
            $scope.items.splice($scope.items.indexOf(item), 1);
        };
         $scope.openBusiness = function(item){
       
                $rootScope.active_business = item;
                //save active resort details
                $localStorage.active_business = JSON.stringify(item);
                $state.go('comment-view');
              
       
     
        }
        $scope.researchList = function (){
          
            $scope.label.search_text=$scope.active_search;
            $scope.loadResortList();
            console.log( $scope.label.search_text);
            
            console.log($scope.label);
            $localStorage.label=JSON.stringify($scope.label);
            // $scope.$broadcast('scroll.scrollTop');
           
            
        }

        // $rootScope.$broadcast('userLoggedIn');
        $scope.loadResortList = function (callback) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            
            APIService.resortList(
                
                $scope.label,
                function(result){
                    $ionicLoading.hide();
                    if(result.status){
                        if(result.result){
                            $scope.items=result.result;
                            
                            console.log(result);
                            console.log($localStorage.label);
                            //Refresh
                    
                            $state.go($state.current, {}, {reload: true});
                        }
                        else{
                            $ionicPopup.alert({
                            title: 'Info',
                            template: result.msg//JSON.stringify(result.description.error)
                            
                            });
                            $scope.active_search="";
                           
                        }
                    
                    }else{
                        $ionicPopup.alert({
                            title: 'Info',
                            template: "Fill in the blank text correctly"//JSON.stringify(result.description.error)
                        });
                    }

                    callback && callback();
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Server connect error'//JSON.stringify(err)
                    });

                    callback && callback();
                });
        };

        $scope.goResearch = function () {
            console.log($localStorage.label);
            // alert("research page");
            $scope.label.search_text=$scope.active_search;
            console.log("aafdsffdsfd");
            console.log($scope.active_search);
            
            if($localStorage.label){
               
                $localStorage.label=JSON.stringify($scope.label);
            }
            console.log($localStorage.label);
           
            $state.go('research'); 
    
            
        };
        $scope.goLeaveComment = function () {
            $state.go('comment-view');
        };

        
        
     
        $scope.doRefresh = function () {
            // $scope.$route.reload();
            $scope.loadResortList(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
     
        };

 
    })

    .controller('UserCtrl', function ($scope, $rootScope, $cordovaNetwork, $cordovaCamera, $cordovaFile, $ionicActionSheet, $cordovaInAppBrowser, $cordovaFacebook, $localStorage, $location, $cordovaGooglePlus, $ionicHistory, $ionicSideMenuDelegate, $state, $ionicPopup, $ionicLoading, APIService, User) {

        $scope.init = function () {
            //User manage part
            $rootScope.loginType = User.getLoginType();
            $rootScope.loggedin = User.isLoggedIn();
            $scope.user = User.profile();
            $scope.login_data = {
                user_email: '',
                user_password: '',
            };
            $scope.register_data = {
                signup_mode:"",
                user_name:"",
                user_password:"",
                user_email:"",
                user_photo_url:"",
                user_search_text1:"",
                user_search_text2:"",
                user_favor_color:"",
                user_photo_data:""
    
            };
            $scope.forgot_data = {
                user_email:''
            }
            $scope.capture_image = '';

   
            // $location.path("/login");
        }
        /**
         * User actions
         */
        $scope.loginByEmail = function(){

            if(User.isValidInfo($scope.login_data)){
                User.login(
                    $scope.login_data,
                    "email",
                    function () {
                        // $rootScope.updateUser();
                        
                        $rootScope.$broadcast('userLoggedIn');
                        $state.go('resort-list');
                    },
                    function (error) {
                        $ionicPopup.alert({
                            title:"Error Occured",
                            template: error.msg
                        });
                    }
                );
            }else{
                $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Invalid user info!'
                });
            }
        };
        //Register
        $scope.register = function () {
            console.log($scope.register_data.user_password);
             console.log($scope.register_data.confirm_password);
            if($scope.register_data.user_password==$scope.register_data.confirm_password){
                console.log("user_photo_data" + $scope.register_data.user_photo_data);
           
           

                User.register(
                    $scope.register_data,
                    
                    "email",
                    function(){
                        $rootScope.$broadcast('userLoggedIn');
                        $rootScope.updateUser();
                        $state.go('resort-list');
                    },
                    function (error) {
                        $ionicPopup.alert({
                            title:"Error Occured",
                            template: error.msg
                        });
                    }
                );
            }
            else{
                 $ionicPopup.alert({
                    title:"Error Occured",
                    template: "Passwords don't match"
                });
            }
        };
        //Upload Photo
        $scope.uploadAvatar = function () {

            $ionicActionSheet.show({
                titleText: 'Get User avatar image',
                buttons: [
                    { text: '<i class="icon ion-camera"></i> Camera' },
                    { text: '<i class="icon ion-ios-albums"></i> Picture' },
                ],
                //destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                },
                buttonClicked: function(buttonIndex) {
                    if (buttonIndex == 0) {
                        var options = {
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            quality: 50,
                            targetWidth: 128,
                            targetHeight: 128,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: false,
                            popoverOptions: CameraPopoverOptions,
                            correctOrientation: true
                        };
                        $cordovaCamera.getPicture(options).then(function(data) {
                            $ionicLoading.hide();
                            $scope.capture_image = "data:image/jpeg;base64," + data;
                            $scope.register_data.user_photo_data =data;
                        }, function (err) {
                            $ionicLoading.hide();
                        });

                    }else if(buttonIndex === 1){
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false
                        };
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $cordovaCamera.getPicture(options).then(function(data) {
                            $ionicLoading.hide();
                            $scope.capture_image = "data:image/jpeg;base64," + data;
                            $scope.register_data.user_photo_data = data;

                        }, function (err) {
                            $ionicLoading.hide();
                        });
                    }
                    console.log(data);
                    return true;
                },
                destructiveButtonClicked: function() {
                    return true;
                }
            });
        };
        // forgot password
        $scope.forgot = function () {

            if($scope.forgot_data.user_email){
                User.forgotPassword(
                    $scope.forgot_data,
                    function () {
                        $location.path('/resort-list');
                        
                    }
                  
                );
            }else{
                $ionicPopup.alert({
                    title: 'Info',
                    template: 'Invalid info'
                });
            }
        };

        /**
         * Redirect functions
         */
        // go to login page
        $rootScope.goToLogin = function () {
            $state.go('login');
        };
        // signup
        $rootScope.goToSignup = function () {
            $state.go('register');
        };

        // forgot password
        $rootScope.goToForgot = function () {
            $state.go('forgot');
        };

        // go to profile
        $rootScope.goToProfile = function () {
            $state.go('profile');
        };
         $rootScope.goToHome = function () {
            $location.path('/resort-list');
        };

        /**
         * SOCIAL LOGIN
         * Facebook and Google
         */
        // FB Login
        $scope.fbLogin = function () {

            try{
                $ionicLoading.show({
                    template: 'Login...'
                });
                $cordovaFacebook.getLoginStatus()
                    .then(function(success) {
                        /*
                         { authResponse: {
                         userID: "12345678912345",
                         accessToken: "kgkh3g42kh4g23kh4g2kh34g2kg4k2h4gkh3g4k2h4gk23h4gk2h34gk234gk2h34AndSoOn",
                         session_Key: true,
                         expiresIn: "5183738",
                         sig: "..."
                         },
                         status: "connected"
                         }
                         */
                        if(success.status == "connected"){
                            //Goto main page
                            $ionicLoading.hide();
                            $scope.getFBInfo();
                        }else{
                            $cordovaFacebook.login(["public_profile", "email"])
                                .then(function(success) {
                                    /*
                                     * Get user data here.
                                     * For more, explore the graph api explorer here: https://developers.facebook.com/tools/explorer/
                                     * "me" refers to the user who logged in. Dont confuse it as some hardcoded string variable.
                                     *
                                     */

                                    $ionicLoading.hide();
                                    //To know more available fields go to https://developers.facebook.com/tools/explorer/
                                    $scope.getFBInfo();

                                }, function (error) {
                                    // Facebook returns error message due to which login was cancelled.
                                    // Depending on your platform show the message inside the appropriate UI widget
                                    // For example, show the error message inside a toast notification on Android
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'FB Login first Cancelled',
                                        template: error.errorMessage
                                    });
                                });
                        }
                    }, function (error) {
                        // error
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'FB Login second Cancelled',
                            template: error.errorMessage
                        });
                    });

            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'FB Login third Cancelled',
                    template: err.message
                });
            }

        };
        // Link facebook
        $scope.fbConnect = function () {
            //will open in app browser
            var options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes'
            };
            var fbprofile = $localStorage.fbprofile;
            $cordovaInAppBrowser.open('https://www.facebook.com/'+fbprofile.name, '_blank', options)
                .then(function(event) {
                    // success
                })
                .catch(function(event) {
                    // error
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Facebook load error'
                    });
                });
        };
        $scope.getFBInfo = function () {
            try{
                $ionicLoading.show({template: 'Fetch facebook account...'});
                $cordovaFacebook.api("me?fields=id,name,first_name,last_name,gender,email,birthday,address,about,hometown,locale,location,picture", [])
                    .then(function(result){
                        /*
                         * As an example, we are fetching the user id, user name, and the users profile picture
                         * and assiging it to an object and then we are logging the response.
                         */
                        //$localStorage.fbprofile = JSON.stringify(result);
                        /****
                         * Get user info from our server
                         */
                        var loginData = {
                            user_email: result.email,
                            register_type: 'facebook',
                            logintype_id: result.id
                        };

                        User.login(loginData,
                            'Fb',
                            function(){ // login success
                                $rootScope.updateUser();
                                $location.path("/resort-list");
                            },
                            function (err) { // if invalid user info

                                var avatar = result.picture.data.url || 'https://lh3.googleusercontent.com/-77pHuyg_QFs/AAAAAAAAAAI/AAAAAAAAAAA/miTBg963mEg/W96-H96/photo.jpg';

                                $scope.convertImgToBase64(avatar,function(base64image){
                                    var registerData = {
                                        user_firstname: result.first_name || 'FirstName',
                                        user_lastname: result.last_name || 'LastName',
                                        user_email: result.email,
                                        user_image: base64image,
                                        register_type:'facebook',
                                        logintype_id: result.id
                                    };

                                    User.register(registerData,
                                        'facebook',
                                        function () {
                                            $rootScope.updateUser();
                                            $location.path("/resort-list");
                                        },
                                        function () {
                                            $ionicPopup.alert({
                                                title: 'FB Login Cancelled',
                                                template: 'Register failed'
                                            });
                                        }
                                    );
                                },'image/jpg');
                            });

                    }, function(error){
                        // Error message
                        $ionicPopup.alert({
                            title: 'FB Login Cancelled',
                            template: error.errorMessage
                        });
                    });
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        }
        // Google Plus Login
        $scope.gplusLogin = function () {
            try{
                $ionicLoading.show({template: 'Login with Google+...'});
                //CLIENT_ID: 833224562116-0vvn98au6v2udovdhmb9u1mrmabrvjj5.apps.googleusercontent.com
                //REVERSED_CLIENT_ID: com.googleusercontent.apps.833224562116-0vvn98au6v2udovdhmb9u1mrmabrvjj5    (correct this)
                //iOS API KEY : AIzaSyDxEXEDt1OZDBJsmyZZcOKcckpTUio_icY
                //$cordovaGooglePlus.login('833224562116-0vvn98au6v2udovdhmb9u1mrmabrvjj5.apps.googleusercontent.com')
                $cordovaGooglePlus.login()
                    .then(
                    function(data){
                        $ionicLoading.hide();
                        //$scope.googleData = JSON.stringify(data, null, 4);
                        /****
                         * Get user info from our server
                         */

                        var loginData = {
                            user_email: data.email,
                            register_type: 'Google',
                            logintype_id: data.userId
                        };

                        User.login(loginData,'Google',
                            function () {
                                $rootScope.updateUser();
                                $location.path("/resort-list");
                            },
                            function () {
                                if(!data.imageUrl){
                                    data.imageUrl = 'https://lh3.googleusercontent.com/-77pHuyg_QFs/AAAAAAAAAAI/AAAAAAAAAAA/miTBg963mEg/W96-H96/photo.jpg';
                                }
                                $scope.convertImgToBase64(data.imageUrl,function(base64image){
                                    var registerData = {
                                        user_firstname: data.givenName || 'FirstName',
                                        user_lastname: data.familyName || 'LastName',
                                        user_email: data.email,
                                        user_image: base64image,
                                        register_type:'Google',
                                        
                                        
                                        logintype_id: data.userId
                                    };
                                    User.register(
                                        registerData,
                                        'Google',
                                        function () {
                                            $rootScope.updateUser();
                                            $location.path("/resort-list");
                                        },
                                        function (error) {
                                            $ionicPopup.alert({
                                                title: 'Google+ Info',
                                                template: 'Register failed'
                                            });
                                        });
                                },'image/jpg');
                            }
                        );

                    },
                    function(error){
                        $ionicLoading.hide();

                        // Google returns error message due to which login was cancelled.
                        // Depending on your platform show the message inside the appropriate UI widget
                        // For example, show the error message inside a toast notification on Android

                        $ionicPopup.alert({
                            title: 'Google+',
                            template: JSON.stringify(error)
                        });
                    });
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Google+',
                    template: err.message
                });
            }
        };

        $scope.convertImgToBase64 = function(url, callback, outputFormat){
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png').replace('data:image/png;base64,','');
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }

        $scope.$on('$ionicView.afterEnter', function() {
         
            $rootScope.loggedin = User.isLoggedIn();
            if($rootScope.loggedin){

                if($rootScope.loginType){
                    var user = User.profile();
                    $scope.login_data = {
                        user_email: user.user_email,
                        user_password: user.user_password,
                
                    };
                    $state.go("resort-list");
         
                }
            }
            console.log($ionicHistory.viewHistory().views);
        });
        $scope.$on('$ionicView.enter', function(){
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function(){
            $ionicSideMenuDelegate.canDragContent(true);
        });
        $scope.$on('user:logout', function(data) {
            $scope.user = User.profile();
            $rootScope.loggedin = User.isLoggedIn();
            $rootScope.loginType = User.getLoginType();
            $rootScope.updateUser();
        });

        $ionicHistory.nextViewOptions({
            //disableAnimate: true,
            disableBack: true
        });
        
        
    })
    .controller('ContactCtrl', function ($scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService) {
        $scope.subjectList = [
            {
                id: 0,
                name:'Location',
                val:'Location',
                selected: false
            },
            {
                id: 1,
                name:'Label',
                val:'Label',
                selected: false
            },
            {
                id: 2,
                name:'Business Type',
                val:'Business Type',
                selected: false
            },
            {
                id: 3,
                name:'Community',
                val:'Community',
                selected: false
            }
        ];
        $scope.user = {
            name:'',
         
            email:'',
          
            message:'',
         
        };
        $scope.contactus = function () {
            $ionicLoading.show({template:'Contacting...'});
            APIService.contactUs(
                $scope.user,
                function (succ) {
                    $ionicLoading.hide();
                    // Do success
                    if(!succ.description.error){
                        $ionicPopup.alert({
                            title:succ.message,
                            template: succ.description
                        });
                    }else{
                        var msg = '';
                        for(var i in succ.description.error){
                            msg += i + ' : ' + succ.description.error[i] + '<br/>'
                        }
                        $ionicPopup.alert({
                            title:succ.message,
                            template: msg
                        });
                    }

                }, function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title:'Info',
                        template: 'This is not allowed in Local Service'//JSON.stringify(err)
                    });
                }
            );
        };
        $scope.goBack=function(){
            $state.go('resort-list');
        };
           
    })

    .controller('ProfileCtrl', function ($scope, $rootScope, $localStorage, $cordovaCamera, $ionicActionSheet, $cordovaInAppBrowser, $cordovaFacebook, $cordovaGooglePlus, $ionicHistory, $state, $ionicPopup, $ionicLoading, APIService, User) {
        
        $scope.init = function () {
            $scope.user=[];
            $scope.user = User.profile();
            $scope.loggedin = User.isLoggedIn();
            $scope.capture_image = '';
            console.log(User.isLoggedIn());
            console.log(User.profile());
            console.log($scope.user);
        }
        /**
         * User actions
         */
        //Profile update
        $scope.update = function () {
           
            var profile = User.profile();
            var update_data = {
                user_id: $scope.user.user_id,
                user_name:$scope.user.user_name,            
                user_email:$scope.user.user_email,           
                signup_mode:$scope.user.signup_mode,                        
             
                search_text1:$scope.user.search_text1,
                search_text2:$scope.user.search_text2,
                favorit_color:$scope.user.search_color,
                user_photo_url:""
            };
          
            // if($scope.user.user_pass!=$scope.user.user_confirm){
            //     $ionicPopup.alert({
            //         title: 'Error',
            //         template: " These passwords don't match "//JSON.stringify(err)
            //     });
            // }
            if($scope.user.user_pass){
                update_data.user_password = $scope.user.user_pass;
            }
             console.log("dff");
            console.log(update_data.user_password);
            if($scope.capture_image){
                update_data.user_photo_data = $scope.capture_image;
                $scope.userEdit(update_data);
            }else if($scope.user.user_image){
                try{
                    $rootScope.convertImgToBase64($scope.user.user_image,function(base64image){
                        update_data.user_photo_data = base64image;
                        $scope.userEdit(update_data);
                    })
                }catch (err){
                    //console.log(err.message);
                }
            }else{
                $scope.userEdit(update_data);
            }

        };
   
        $scope.userEdit = function (update_data) {
            $ionicLoading.show({
                template: 'Updating...'
            });
                
            APIService.editUser( //if user logged in by emil,then update user info
                update_data,
                function(result){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Info',
                        template: "Update Success!"
                    });
                    if(result.status==1){
                        $scope.user = result.current_user;
                        $scope.user.user_password = '';
                        $localStorage.profile = JSON.stringify(result.current_user);
                        $rootScope.updateUser();
                    }
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Update error'//JSON.stringify(err)
                    });
                });
                 console.log("dff");
            console.log($localStorage.profile);
        };
        //Login
        $scope.goLogin = function () {
            $rootScope.goToLogin();
        };
        // Logout user
        $scope.logout = function () {

            //User related
            User.logout();
            $rootScope.updateUser();
            $rootScope.$broadcast('user:logout',User.profile());
       

            $ionicLoading.show('Logout..');
            setTimeout(function () {
                $ionicLoading.hide();
                $state.go('resort-list');
            },1000);

        };
        /**
         * Redirect functions
         */
        // Link facebook
        $scope.fbConnect = function () {
            //will open in app browser
            var options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes'
            };
            $cordovaInAppBrowser.open('https://www.facebook.com/'+$scope.user.user_firstname, '_blank', options)
                .then(function(event) {
                    // success
                })
                .catch(function(event) {
                    // error
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Facebook load error'
                    });
                });
        };
        //Edit profile
        $scope.editAvatar = function () {

            $ionicActionSheet.show({
                titleText: 'Get User avatar image',
                buttons: [
                    { text: '<i class="icon ion-camera"></i> Camera' },
                    { text: '<i class="icon ion-ios-albums"></i> Picture' },
                ],
                //destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    //console.log('CANCELLED');
                },
                buttonClicked: function(buttonIndex) {

                    if (buttonIndex == 0) {
                        var options = {
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            quality: 75,
                            targetWidth: 512,
                            targetHeight: 512,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: false,
                            popoverOptions: CameraPopoverOptions,
                            correctOrientation: true
                        };

                        $cordovaCamera.getPicture(options).then(function(data) {
                            $scope.capture_image = data;
                            $scope.update();
                        }, function (err) {
                            $ionicLoading.hide();
                        });
                    }else if(buttonIndex == 1){

                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false
                        };
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $cordovaCamera.getPicture(options).then(function(data) {
                            $ionicLoading.hide();
                            $scope.capture_image = data;
                            $scope.update();
                        }, function (err) {
                            $ionicLoading.hide();
                        });
                    }
                    return true;
                },
                destructiveButtonClicked: function() {
                    return true;
                }
            });
        };

        /**
         * InAppBrowser events listener
         */

        $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
        });

        $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
            // insert CSS via code / file
            $cordovaInAppBrowser.insertCSS({
                code: 'body {background-color:red !important;}'
            });

            //insert Javascript via code / file
            //$cordovaInAppBrowser.executeScript({
            //    file: 'inappbrowser-script.js'
            //});
        });

        $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
            //alert('$cordovaInAppBrowser:loaderror');
        });

        $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
            //alert('$cordovaInAppBrowser:exit');
        });

        $scope.$on('$ionicView.afterEnter', function() {
            $rootScope.loggedin = User.isLoggedIn();
            $scope.user = User.profile();
            $scope.user.user_password = '';
        });

        $scope.$on('user:logout', function(data) {
            $rootScope.updateUser();
            $scope.user = User.profile();
            $rootScope.loggedin = User.isLoggedIn();
            $rootScope.loginType = User.getLoginType();
        });

        //Base64 encode function
        $rootScope.convertImgToBase64 = function(url, callback, outputFormat){
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this,0,0);
                var dataURL = canvas.toDataURL(outputFormat || 'image/png').replace('data:image/png;base64,','');
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }

    })
   .controller('AboutCtrl', function ($scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService) {
        $scope.goBack = function () {
            $state.go('resort-list');
        };
       
       
   })
   .controller('ResearchCtrl', function ($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
      $scope.label = {};

        $scope.init = function () {
            $scope.label = {
                user_id: "",
                business_name: "",
                business_type: "",
                business_address:"",
                search_text: "",
                search_text1:"",
                search_text2:""
                
            }
             //Refresh
            $state.go($state.current, {}, {reload: true});
     
              
        }
     
        $scope.goBack = function () {
            $state.go('resort-list',{},{reload: true});
        };
        $scope.goSearchResult = function () {
        
            $scope.label.search_text=$scope.label.search_text1;
            if($scope.label.search_text1==""){
                $scope.label.search_text=$scope.label.search_text2;
            }
            if(($scope.label.search_text1!="")&&($scope.label.search_text2!=""))
            {
                $scope.label.search_text=$scope.label.search_text1 +'@' +$scope.label.search_text2;
            }
            
            //save active label details
            console.log($scope.label);
            $localStorage.advance_label=JSON.stringify($scope.label);
            
     
           
           
            $rootScope.flag=1;
            // $rootScope.$apply();
            console.log("go");
            console.log($rootScope.flag);
          
            $state.go('search-result',{},{reaload:true} );
          
        };
       
       
   })
//    .controller('MyInstallCtl', function ($scope, $state) {
//         $scope.goBack = function () {
//             $state.go('resort-list');
//         };
//         $scope.goSearchResult = function () {
//             $state.go('search-result');
//         };
       
       
//    })
    .controller('MyInstallCtl', function ($http, $scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
    
        var profile = User.profile();
        $scope.loggedin=User.isLoggedIn();
        console.log(profile.user_id);
        var comment={
           user_id: profile.user_id,
           category: "1" 
        };
         $ionicLoading.show({
                template: 'Loading...'
            });
                
            APIService.loadMine( //if user logged in by emil,then update user info
                comment,
                function(result){
                    console.log(result);
                    $ionicLoading.hide();
                  
                    if(result.status==1){
                        $scope.items = result.category_item;
                     
                      
                    }
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Loading error'//JSON.stringify(err)
                    });
                });
        
        $scope.goBack=function(){
            $state.go('resort-list');
        };
        // $http.get('js/data.json').success(function(data){
        //      $scope.artists=data;
        // });
        $scope.goEdit_Install=function(){
            $state.go('addinstitution');
        };
        
        
   
           
    })
    .controller('AddOpinionCtl', function ($http, $scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {

        $scope.pointList = [
            {
                id: 10,
           
            },
            {
                id: 9,
               
            },
            {
                id: 8,
          
            },
            {
                id: 7,
               
            },
            {
                id: 6,
               
            },
            {
                id: 5,
               
            },
            {
                id: 4,
               
            },
            {
                id: 3,
               
            },
            {
                id: 2,
               
            },
            {
                id: 1,
               
            }
        ];
        


        $scope.label_num=0;
        console.log($scope.label_num);
        $scope.goBack=function(){
            $state.go('comment-view');
        };
        $scope.addLabel=function(){
            $scope.label_num++;
            console.log($scope.label_num);
            console.log($scope);
        };
 
 
         $scope.loadBusiness= function(callback){
    
         
            if($localStorage.active_business){
                var active_business=JSON.parse($localStorage.active_business);
                $scope.active_business=active_business;
                console.log(active_business);
            }
            
        };
         $scope.addComment= function(){
    
         
            console.log($scope.point);
            
        };
        var user=User.profile();
        console.log(user.user_id);
        
        var add_Comment={
            user_id: user.user_id,
            business_id: $scope.active_business.business_id,
            content:$scope.content,
            title: $scope.title
        }
      
    //     $scope.addComment=function(){
            
    //       $ionicLoading.show({
    //             template: 'Loading...'
    //         });
    //         APIService.addCommentApi( //if user logged in by emil,then update user info
    //             add_Comment,
    //             function(result){
    //                 console.log(result);
    //                 $ionicLoading.hide();
                  
    //                 if(result.status==1){
                        
    //                     console.log(User.isLoggedin);
                     
                      
    //                 }
    //             },
    //             function (err) {
    //                 $ionicLoading.hide();
    //                 $ionicPopup.alert({
    //                     title: 'Error',
    //                     template: 'Loading error'//JSON.stringify(err)
    //                 });
    //             });
    //             $state.go('leave-comment');
     
    //      };
        
   
           
    })
    .controller('MyFavoritCtl', function ($http, $scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
    
        $scope.goBack=function(){
            $state.go('resort-list');
        };
         var profile = User.profile();
        $scope.loggedin=User.isLoggedIn();
        console.log(profile.user_id);
        var comment={
           user_id: profile.user_id,
           category: "3" 
        };
         $ionicLoading.show({
                template: 'Loading...'
            });
                
            APIService.loadMine( //if user logged in by emil,then update user info
                comment,
                function(result){
                    console.log(result);
                    $ionicLoading.hide();
                  
                    if(result.status==1){
                        $scope.items = result.category_item;
                     
                      
                    }
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Loading error'//JSON.stringify(err)
                    });
                });
     

   
           
    })
     .controller('MyCommentCtl', function ($http, $scope, $state, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
    
     var profile = User.profile();
     $scope.user_name=profile.user_name;
     $scope.user_photo=profile.user_photo_url;
        $scope.loggedin=User.isLoggedIn();
        console.log(profile);
        var comment={
           user_id: profile.user_id,
           category: "2" 
        };
         $ionicLoading.show({
                template: 'Loading...'
            });
                
            APIService.loadMine( //if user logged in by emil,then update user info
                comment,
                function(result){
                    console.log(result);
                    $ionicLoading.hide();
                  
                    if(result.status==1){
                        $scope.items = result.category_item;
                     
                      
                    }
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Loading error'//JSON.stringify(err)
                    });
                });
        $scope.goBack=function(){
            $state.go('resort-list');
        };
     
        $scope.goEdit_Install=function(){
            $state.go('addinstitution');
        };
        
   
           
    })

   .controller('SearchResultCtl', function($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User){
         $scope.init = function () {
            $scope.label = {
                user_id: "",
                business_name: "",
                business_type: "",
                business_address:"",
                search_text: ""
                
            }
       
            $scope.data = {
                showDelete: false
            };
            $scope.items=[];
            $scope.loadSearchResult();
            $rootScope.active_business = null;
            if($localStorage.advance_label){
               var label=JSON.parse($localStorage.advance_label);
               $scope.label.user_id=label.user_id;
               $scope.label.business_name=label.business_name;
               $scope.label.business_type=label.business_type;
               $scope.label.business_address=label.business_address;
               $scope.label.search_text=label.search_text;
               console.log($scope.label);
        
           }
      
       
        }
          $scope.share = function(item) {
            console.log(item);

            var resort = item;
            console.log(resort);
            try{
                $ionicLoading.show({template:'Find SNS..'});
                $cordovaSocialSharing.share(resort.business_name, "AFRISIA", resort.business_photo_url, null)
                    .then(function(result) {
                        $ionicLoading.hide();
                    }, function(error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title:'Error',
                            template:'Cannot share'
                        });
                    });
            }catch (err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Alert',
                    template: err.message
                });
            }
        };
        
           $scope.openBusiness = function(item){

       
                $rootScope.active_business = item;
                //save active resort details
                $localStorage.active_business = JSON.stringify(item);
                $state.go('comment-view');
              
       
     
        }
       
        $scope.loadSearchResult = function () {
             if($localStorage.advance_label){
               var label=JSON.parse($localStorage.advance_label);
               $scope.label.user_id=label.user_id;
               $scope.label.business_name=label.business_name;
               $scope.label.business_type=label.business_type;
               $scope.label.business_address=label.business_address;
               $scope.label.search_text=label.search_text;
               console.log($scope.label);
        
           }
            
            console.log($scope.label);
            $ionicLoading.show({
                template: 'Loading...'
            });
            
            console.log($scope.label);
            
            APIService.resortList(
                $scope.label,
               function(result){
                    $ionicLoading.hide();
                    if(result.status){
                        if(result.result){
                            $scope.items=result.result;
                            console.log($scope.items);
                            console.log(result);
                            $localStorage.forMap=JSON.stringify($scope.items);
                            
                          
                        }
                        else{
                            $ionicPopup.alert({
                                title: 'Info',
                                template: result.msg//JSON.stringify(result.description.error)
                                
                                
                                
                            });
                            
                         
                        }
                    
                    }else{
                        $ionicPopup.alert({
                            title: 'Info',
                            template: "Fill in the blank text correctly"//JSON.stringify(result.description.error)
                        });
                        
                    }

                   
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Server connect error'//JSON.stringify(err)
                    });

                    
                });
               

        };
        $scope.goBack = function () {
            $state.go('research');
        };
        $scope.goSearchMap = function () {
            $state.go('search-map');
        };
        $scope.goComment = function (item) {
            $state.go('comment-view');
        };
        
        $scope.$on('$ionicView.afterEnter', function() {
            console.log("fsfdasdas"+$rootScope.flag);
            if($rootScope.flag==1){
                $scope.loadSearchResult();
                $rootScope.flag=0;
            }             //Refresh
            
        });
        // $scope.$on('$ionicView.afterLeave',function(){
      
        //      $state.go($state.current, {}, {reload: true});
       
            
        // })
  
   })

   .controller('CommentCtl', function($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService,$ionicViewService, User){
      
        $scope.init = function (){
            $scope.business=[];
            
        };
        $scope.goAddOpinion = function () {
            $state.go('addopinion');
        };
        $scope.goBack = function () {
            $ionicViewService.getBackView().go();
            // $state.go('resort-list');
        };
        $scope.goSingleMap = function () {
           $state.go('single-map', {}, {reload: true});
        //    $rootScope.$apply();
        };
        $scope.goLabelComment = function (callback) {
            if($localStorage.active_business){
                var active_business=JSON.parse($localStorage.active_business);
                $scope.active_business=active_business;
            }
            $state.go('label-comment');
        };
        $scope.loadBusiness= function(callback){
    
         
            if($localStorage.active_business){
                var active_business=JSON.parse($localStorage.active_business);
                $scope.active_business=active_business;
                console.log(active_business);
            }
            
        };
        $scope.doRefresh = function () {
            $scope.loadBusiness(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.$on('$ionicView.afterEnter', function() {
            $scope.loadBusiness();
        });
  
   })
   .controller('AddInstitutionCtl', function($scope, $rootScope, $localStorage, $cordovaCamera, $ionicActionSheet, $cordovaInAppBrowser, $cordovaFacebook, $cordovaGooglePlus, $ionicHistory, $state, $ionicPopup, $ionicLoading, APIService, User) {
        $scope.init= function(){
            $scope.loggedin=User.isLoggedIn();
            
        }
        $state.go($state.current, {}, {reload: true});
        
        var business={
            user_id: User.profile().user_id,
            business_name: $scope.business_name,
            business_site: $scope.business_site,
            business_address: $scope.business_address,
            business_city: $scope.business_city,
            business_description: $scope.business_description 
           
       
        }; $scope.add_business= function(){
            $ionicLoading.show({
                template: 'Loading...'
            });
            console.log(business);
               
            APIService.addBusiness( //if user logged in by emil,then update user info
                business,
                function(result){
                    console.log(result);
                    $ionicLoading.hide();
                  
                    if(result.status==1){
                        $scope.items = result.category_item;
                     
                      
                    }
                },
                function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Loading error'//JSON.stringify(err)
                    });
                })
   };

   
        $scope.goBack = function () {
            $state.go('myinstall');
        };
      
          //Edit profile
        $scope.editAvatar = function () {

            $ionicActionSheet.show({
                titleText: 'Get User avatar image',
                buttons: [
                    { text: '<i class="icon ion-camera"></i> Camera' },
                    { text: '<i class="icon ion-ios-albums"></i> Picture' },
                ],
                //destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {
                    //console.log('CANCELLED');
                },
                buttonClicked: function(buttonIndex) {

                    if (buttonIndex == 0) {
                        var options = {
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            quality: 75,
                            targetWidth: 512,
                            targetHeight: 512,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            saveToPhotoAlbum: false,
                            popoverOptions: CameraPopoverOptions,
                            correctOrientation: true
                        };

                        $cordovaCamera.getPicture(options).then(function(data) {
                            $scope.capture_image = data;
                            $scope.update();
                        }, function (err) {
                            $ionicLoading.hide();
                        });
                    }else if(buttonIndex == 1){

                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: false,
                            encodingType: Camera.EncodingType.JPEG,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false
                        };
                        $ionicLoading.show({
                            template: 'Loading...'
                        });
                        $cordovaCamera.getPicture(options).then(function(data) {
                            $ionicLoading.hide();
                            $scope.capture_image = data;
                            $scope.update();
                        }, function (err) {
                            $ionicLoading.hide();
                        });
                    }
                    return true;
                },
                destructiveButtonClicked: function() {
                    return true;
                }
            });
        };

        
  
   })
   .controller('LabelCommentCtl', function($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User){
        $scope.init = function (){
            $scope.business=[];
            
        };  
        $scope.goBack = function () {
            $state.go('comment-view');
        };
        $scope.goSingleMap = function () {
        //    $rootScope.$apply();
            $state.go('single-map');
        };
      
        $scope.isLoggedin=User.isLoggedIn();
        $scope.loadBusiness= function(callback){
    
         
            if($localStorage.active_business){
                var active_business=JSON.parse($localStorage.active_business);
                $scope.active_business=active_business;
                console.log(active_business);
            }
            
        };
        $scope.doRefresh = function () {
            $scope.loadBusiness(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.$on('$ionicView.afterEnter', function() {
            $scope.loadBusiness();
        });
  
   })
   .controller('MapCtrl', function($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
        $scope.mapT = {entity: null};
         $scope.$on('$ionicView.afterEnter', function() {
           console.log($localStorage.advance_label);
          
        });
        
        $scope.forMap=JSON.parse($localStorage.forMap);
        // var marker_position=[];
        // for(var i=0;i<$scope.forMap.length;i++){
        //     $scope.placeMarkers();
        // }
        
   

        
        $scope.mapCreated = function(map) {
       
          
         
          $scope.mapT.entity = map;  // this sets the map we just created in our directive to the $scope
          $scope.setMapCenter($scope.forMap[0].business_lati, $scope.forMap[0].business_long);
        //   $scope.placeMarkers($scope.active_business.business_lati,$scope.active_business.business_long); // we *can* initialize the map with markers if we need to here
          console.log($scope.forMap);
          console.log($scope.forMap[0].business_lati, $scope.forMap[0].business_long);
          console.log($localStorage.advance_label);
          for(var i=0; i<$scope.forMap.length; i++){
              $scope.placeMarkers($scope.forMap[i]);
          }
        };

       $scope.setMapCenter = function(glat, glong) {
           $scope.mapT.entity.setZoom(11);
            $scope.mapT.entity.setCenter(new google.maps.LatLng(glat, glong));
       };
        
        $scope.placeMarkers = function(business){ // this function will be responsible for setting the markers on the map
          var glat = business.business_lati;
          var glong = business.business_long;
          var markerPosition = new google.maps.LatLng(glat, glong); // this is the google api code that takes a latitude and longitude position
          var gmap_photo = business.business_photo_url;
          
          var image = {
            url: 'https://lh3.ggpht.com/FyJy3O3mzyRTLegsANXWynqySqfI0ujExkGTjjkkdPGzfnBFNAdRAYS-UjMQJ6pQRA=w300',
            size: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10)
          };

          var marker = new google.maps.Marker({  // this creates a new google map marker 
            position: markerPosition, // it uses uses the marker position we set above
            
            clickable: true,
            animation: google.maps.Animation.DROP,
            map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
            icon: 'img/map-marker.png', // this is the google maps icon
            title: 'Hello World!'
          });
          
          var html = '';
          var favor_link = 'img/unfavorit.png';
          
          var search_name = '[' + business.business_name + ']';
          var search_type = '';
          var search_label = '';
          if(typeof(business.business_type) !== 'undefined'){ 
              search_type = '[' + business.business_type + ']';
          }
          if(JSON.parse($localStorage.advance_label).search_text.length > 0) 
          {
              search_label = '[' + JSON.parse($localStorage.advance_label).search_text.split("@")[0] + ']';
          }
          if(typeof(business.favor_status) !== 'undefined' && business.favor_status > 0){
              favor_link = 'img/favorit.png';
          }
/*          
          var mark_html = '<div class="circle-mark" >' +
                            '<div class="project-number">' + business.business_rate_score + '</div>' +
                            '<div class="rate-number">,' + business.business_rate_num + '</div>' +
                            '<div class="total">/10</div>' + 
                            '</div><div style="list-style:none;float:right;"><li style="float:left;"><img src="' +
                            favor_link + '"/></li><li style="float:right;">' + business.business_city + '</li></ul>';
*/            
          var infoWindow = new google.maps.InfoWindow({
             // we can also have a popup window active when clicked on
            photo_url : business.business_photo_url,
            content:    '<div style:"overflow-y: hidden;">' +
                            '<div style="float:left;overflow-y: hidden;">' +
                                '<img src="'+ gmap_photo +'" style="width:180px;height:130px;" />' +
                                '<div class="circle-mark" style="margin-top:-62px;">' +
                                    '<div class="project-number">' + business.business_rate_score + '</div>' +
                                    '<div class="rate-number">,' + business.business_rate_num + '</div>' +
                                    '<div class="total">/10</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="float:left;overflow-y: hidden;">' +
                                '<li><h4 style="color:green;">' + search_name +'</h4></li>' +
                                '<li>' + search_type +'</li>' +
                                '<li>' + search_label +'</li>' +
                                '<ul style="margin-top:40px;">' + 
                                    '<li><img src="' + favor_link + '" style="float:left;width:20px"/></li>' + 
                                    '<li style="float:right;">' + business.business_city + '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>'
/*                        
                        + '<div style="float:left;width:60%;">
                        + '<div style="float:left;width:40%;"><li><h4 style="color:green;">'
                        + search_name +'</h4></li><li>' + search_type +'</li><li>' 
                        + search_label +'</li>'
                        + '</div>'
                        + '</div>'
                        + '<div style="float:none; top:70px; left:10px; position:relative; z-index:1;">'
                        + mark_html
                        + '</div>'
*/
          });
          console.log(infoWindow);


/*
 
business_city: "Paris"
business_rate_num: 0
business_rate_score: 0
business_site: "longlifevegihouse.com"
business_type: "Restaurant"
comment_count: 2
favor_status: 0
 
 */
          //add event listener for marker
           google.maps.event.addListener(marker, 'click', function(){  // this listens for click events on the markers
           console.log('asdf');
            if($scope.openInfoWindow){
              $scope.openInfoWindow.close();
            }
            $scope.openInfoWindow = infoWindow;
            $scope.openInfoWindow.open($scope.mapT.entity, marker);
          });
        }
        
   
        $scope.goBack = function () {
            $state.go('search-result');
        };
        $scope.goSearchMap = function () {
            $state.go('search-map');
        };
   })
   .controller('SingleMapCtrl', function($scope, $rootScope, $state, $cordovaSocialSharing, $localStorage, $ionicHistory, $ionicLoading, $ionicPopup, APIService, User) {
        $scope.mapT = {entity: null};

        $scope.mapCreated = function(map) {
          if($localStorage.active_business){
               var active_business=JSON.parse($localStorage.active_business);
               $scope.active_business=active_business;
          }
          
          console.log($scope.active_business);
          $scope.mapT.entity = map;  // this sets the map we just created in our directive to the $scope
          $scope.setMapCenter($scope.active_business.business_lati, $scope.active_business.business_long);
          $scope.placeMarkers($scope.active_business); // we *can* initialize the map with markers if we need to here
        };

       $scope.setMapCenter = function(glat, glong) {
           $scope.mapT.entity.setZoom(16);
            $scope.mapT.entity.setCenter(new google.maps.LatLng(glat, glong));
       };
        
         $scope.placeMarkers = function(business){ // this function will be responsible for setting the markers on the map
          var glat = business.business_lati;
          var glong = business.business_long;
          var markerPosition = new google.maps.LatLng(glat, glong); // this is the google api code that takes a latitude and longitude position
          var gmap_photo = business.business_photo_url;
          
          var image = {
            url: 'https://lh3.ggpht.com/FyJy3O3mzyRTLegsANXWynqySqfI0ujExkGTjjkkdPGzfnBFNAdRAYS-UjMQJ6pQRA=w300',
            size: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(10, 10)
          };

          var marker = new google.maps.Marker({  // this creates a new google map marker 
            position: markerPosition, // it uses uses the marker position we set above
            
            clickable: true,
            animation: google.maps.Animation.DROP,
            map: $scope.mapT.entity,  // it grabs the $scope.map which is set to the map we created
            icon: 'img/map-marker.png', // this is the google maps icon
            title: 'Hello World!'
          });
          
          var html = '';
          var favor_link = 'img/unfavorit.png';
          
          var search_name = '[' + business.business_name + ']';
          var search_type = '';
          var search_label = '';
          if(typeof(business.business_type) !== 'undefined'){ 
              search_type = '[' + business.business_type + ']';
          }
          if(JSON.parse($localStorage.advance_label).search_text.length > 0) 
          {
              search_label = '[' + JSON.parse($localStorage.advance_label).search_text.split("@")[0] + ']';
          }
          if(typeof(business.favor_status) !== 'undefined' && business.favor_status > 0){
              favor_link = 'img/favorit.png';
          }
/*          
          var mark_html = '<div class="circle-mark" >' +
                            '<div class="project-number">' + business.business_rate_score + '</div>' +
                            '<div class="rate-number">,' + business.business_rate_num + '</div>' +
                            '<div class="total">/10</div>' + 
                            '</div><div style="list-style:none;float:right;"><li style="float:left;"><img src="' +
                            favor_link + '"/></li><li style="float:right;">' + business.business_city + '</li></ul>';
*/            
          var infoWindow = new google.maps.InfoWindow({
             // we can also have a popup window active when clicked on
            photo_url : business.business_photo_url,
            content:    '<div style:"overflow-y: hidden;">' +
                            '<div style="float:left;overflow-y: hidden;">' +
                                '<img src="'+ gmap_photo +'" style="width:180px;height:130px;" />' +
                                '<div class="circle-mark" style="margin-top:-62px;">' +
                                    '<div class="project-number">' + business.business_rate_score + '</div>' +
                                    '<div class="rate-number">,' + business.business_rate_num + '</div>' +
                                    '<div class="total">/10</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style="float:left;overflow-y: hidden;">' +
                                '<li><h4 style="color:green;">' + search_name +'</h4></li>' +
                                '<li>' + search_type +'</li>' +
                                '<li>' + search_label +'</li>' +
                                '<ul style="margin-top:40px;">' + 
                                    '<li><img src="' + favor_link + '" style="float:left;width:20px"/></li>' + 
                                    '<li style="float:right;">' + business.business_city + '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>'
/*                        
                        + '<div style="float:left;width:60%;">
                        + '<div style="float:left;width:40%;"><li><h4 style="color:green;">'
                        + search_name +'</h4></li><li>' + search_type +'</li><li>' 
                        + search_label +'</li>'
                        + '</div>'
                        + '</div>'
                        + '<div style="float:none; top:70px; left:10px; position:relative; z-index:1;">'
                        + mark_html
                        + '</div>'
*/
          });
          console.log(infoWindow);


/*
 
business_city: "Paris"
business_rate_num: 0
business_rate_score: 0
business_site: "longlifevegihouse.com"
business_type: "Restaurant"
comment_count: 2
favor_status: 0
 
 */
          //add event listener for marker
           google.maps.event.addListener(marker, 'click', function(){  // this listens for click events on the markers
           console.log('asdf');
            if($scope.openInfoWindow){
              $scope.openInfoWindow.close();
            }
            $scope.openInfoWindow = infoWindow;
            $scope.openInfoWindow.open($scope.mapT.entity, marker);
          });
        }
 
   
        $scope.goBack = function () {
            $state.go('comment-view');
        };
        $scope.goSearchMap = function () {
            $state.go('leave-comment');
        };
   })
   



    .controller('OfflineCtrl', function ($scope, $location, $cordovaNetwork, $ionicLoading, $ionicSideMenuDelegate, $ionicGesture, $ionicHistory) {})
   ;
