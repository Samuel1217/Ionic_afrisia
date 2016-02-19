var AfrisiaApp = angular.module(
        'ionicApp',
        [
            'ionic',
            'ionic.contrib.drawer',
            'ngCookies',
            'ngCordova',
            'ngStorage',
            'ngResource',
            'ionicLazyLoad'
            
        ]
    )
 
        .run(function($ionicPlatform,$ionicPopup,$state,$location,$localStorage,$rootScope,$cordovaNetwork,$ionicLoading,$ionicHistory,$ionicBackdrop,$timeout,User) {
            $ionicPlatform.ready(function() {
                if(window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }
                // Disable BACK button on home
                $ionicPlatform.registerBackButtonAction(function (event) {
                    if($state.current.name === 'welcome' || $state.current.name === 'resort-list'){
                        User.confirmExit(function(res){
                            if (res) {
                                User.logout(function(){
                                    navigator.app.exitApp();
                                });
                            }
                        });
                    }else{
                        navigator.app.backHistory();
                    }
                }, 100);

                $rootScope.loginType = User.getLoginType();
                $rootScope.loggedin = User.isLoggedIn();
                
             
         


                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                    console.log(networkState);
                    $rootScope.networkType = $cordovaNetwork.getNetwork();
                    $rootScope.networkState = ($cordovaNetwork.isOnline())?'online':'offline';
                })

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    console.log(networkState);
                    $rootScope.networkType = $cordovaNetwork.getNetwork();
                    $rootScope.networkState = ($cordovaNetwork.isOnline())?'online':'offline';
                    $ionicLoading.show({
                        template: 'You are offline',
                        duration: 3000
                    });
                })
            });
        })
        .config(function($stateProvider, $urlRouterProvider) {

            $stateProvider
  
                .state('offline', {
                    url: "/offline",
                    templateUrl: "templates/offline.html",
                    controller: 'OfflineCtrl'
                })
                .state('about', {
                    url: "/about",
                    templateUrl: "templates/about.html",
                    controller: 'AboutCtrl'
                })


                .state('profile', {
                    url: "/profile",
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'UserCtrl'
                })
 
                .state('register', {
                    url: '/register',
                    templateUrl: 'templates/register.html',
                    controller:'UserCtrl'
                })
                .state('forgot', {
                    url: '/forgot',
                    templateUrl: 'templates/forgot.html',
                    controller: 'UserCtrl'
                })
                .state('contact', {
                    url: '/contact',
                    templateUrl: 'templates/contact.html',
                    controller: 'ContactCtrl'
                })
                .state('research', {
                    url: '/research',
                    templateUrl: 'templates/research.html',
                    controller: 'ResearchCtrl'
                })
                .state('search-result', {
                    url: '/search-result',
                    templateUrl: 'templates/search-result.html',
                    controller: 'SearchResultCtl'
                })
                .state('search-map', {
                    url: '/search-map',
                    templateUrl: 'templates/search-map.html',
                    controller: 'MapCtrl'
                })
                .state('single-map', {
                    url: '/single-map',
                    templateUrl: 'templates/single-map.html',
                    controller: 'SingleMapCtrl'
                })
                .state('comment-view', {
                    url: '/comment-view',
                    templateUrl: 'templates/comment-view.html',
                    controller: 'CommentCtl'
                })
                .state('label-comment', {
                    url: '/label-comment',
                    templateUrl: 'templates/label-comment.html',
                    controller: 'LabelCommentCtl'
                })
                .state('myinstall', {
                    url: '/myinstall',
                    templateUrl: 'templates/myinstall.html',
                    controller: 'MyInstallCtl'
                })
                .state('myfavorit', {
                    url: '/myfavorit',
                    templateUrl: 'templates/myfavorit.html',
                    controller: 'MyFavoritCtl'
                })
                .state('mycomment', {
                    url: '/mycomment',
                    templateUrl: 'templates/mycomment.html',
                    controller: 'MyCommentCtl'
                })
                .state('addinstitution', {
                    url: '/addinstitution',
                    templateUrl: 'templates/addInstitution.html',
                    controller: 'AddInstitutionCtl'
                })
                .state('addopinion', {
                    url: '/addopinion',
                    templateUrl: 'templates/addopinion.html',
                    controller: 'AddOpinionCtl'
                })
                
    
                .state('resort-list', {
                    url: '/resort-list',
                    templateUrl: 'templates/resort-list.html',
                    controller: 'ResortListCtrl'
                })
               
           
       
            $urlRouterProvider.otherwise("/resort-list");

        })
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $ionicConfigProvider.navBar.alignTitle('center')
        })
        .config(['$ionicConfigProvider', function($ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('top'); // other values: top
        }])
        .config(function($ionicConfigProvider) {
            // remove back button text completely
            $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
        })
        .config(function($cordovaInAppBrowserProvider) {

            var defaultOptions = {
                location: 'no',
                clearcache: 'no',
                toolbar: 'no'
            };
            $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
        })
        .config(function($ionicConfigProvider) {
            $ionicConfigProvider.views.swipeBackEnabled(false);
        });


   
    