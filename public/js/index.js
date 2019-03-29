var leaseMgt = angular.module('leaseMgt', ['ngRoute', 'ngDialog']);
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var token;
function leaseMgtRouteConfig($routeProvider, $locationProvider) {
    var app_dir = '../pages';

    $routeProvider.otherwise('/login');

    $routeProvider
        .when('/login', {
            templateUrl: app_dir + '/login.html',
            controller: loginCtrl
        })
        .when('/lease-list', {
            templateUrl: app_dir + '/lease-list.html',
            controller: leaseListCltr
        }).when('/lease', {
            templateUrl: app_dir + '/lease.html',
            controller: leaseCtrl
        }).when('/register', {
            templateUrl: app_dir + '/register.html',
            controller: registerCltr
        })
}
leaseMgt.config(leaseMgtRouteConfig);

//=================login controller===================//
function loginCtrl($scope, $location, $http ,ngDialog){
    $scope.key=localStorage.getItem("key")
    $scope.login = function () {
       
    if(!$scope.key){
      ngDialog.open({
            template: '../pages/dialog/provideKey.html',
            scope: $scope,
            className: 'ngdialog-theme-default pub_key',
           preCloseCallback:()=>{
              $scope.key=$("#pubkey").val()
           }
         });
       }else{
           $http.post('/sign', { "signedMsg": $scope.user, "key": $scope.key }).then(function(response){
              sessionStorage.setItem('token', response.data.token);
              $location.path('/lease-list');
           });
       }
        }
        $scope.ok=()=>{
         $scope.key=$("#pubkey").val()
         ngDialog.close();
        $http.post('/sign', { "signedMsg": $scope.user, "key": $scope.key }).then(function(response){
              sessionStorage.setItem('token', response.data.token);
              $location.path('/lease-list');
           });
        }

}

//==============register controller==============//
function  registerCltr(ngDialog, $http, $scope, $location) {
    $scope.localStorages = false;
    $scope.register = () => {
        $http.post('/register', $scope.user).then(function (response) {
            $scope.key = response.data;

            if (response.status == 200) {
                ngDialog.open({
                    template: '../pages/dialog/message.html',
                    scope: $scope,
                    className: 'ngdialog-theme-default pub_key'
                })
            }

        })

        $scope.setLocalStorage = () => {
            if (!$scope.localStorages)
                localStorage.setItem("key", $("#pubkey").val());
            else
                localStorage.setItem("key", null);

            $scope.localStorages = !$scope.localStorages;
        }
    }
}
//=================lease-list controller=====================//
function leaseListCltr($scope , $http ,$location){
    $scope.leaseList=[];
 $("#grid").kendoGrid({
                dataSource:$scope.leaseList,
                height: 50,
                groupable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "requestId",
                    title: "Request ID",
                    width: 240
                }, {
                    field: "propertyType",
                    title: "Property Type"
                }, {
                    field: "address",
                    title: "Address",
                    width: 240
                }, {
                    field: "submittedBy",
                    title: "Submitted By",
                    width: 150
                }, {
                    field: "status",
                    title: "Status",
                    width: 150
                }
                ]
            });

            $scope.createLease=function(){
                 $location.path("/lease")
            }
}
//=================lease controller=====================//
function leaseCtrl($scope,$http) {
     $scope.createLease =function(){
            $http.post('/secure-api/lease-create',{"msg":$scope.lease,"token":sessionStorage.getItem("token")}).then(function(response){

            })
     }
    
    }