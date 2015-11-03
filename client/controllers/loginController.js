//============
// Login Page
//============

CMDBappControllers.controller('loginProcess', function($scope,$http, $location, $rootScope, $cookies, $cookieStore ){
    $scope.message = "";
    console.log("Login Controller");
    $scope.signIn = function(){
        console.log("button 'SignIn' : clicked " + $scope.servername);
        var config = {};
        var data =  {
                        servername: $scope.servername,
                        portnumber: $scope.portnumber,
                        username: $scope.username,
                        password: $scope.password
                    };
                    
        var req = $http.post("api/login",data, config)
            .success(function(response){
                console.log("Back from Server with success ! > " + response.status + ": " + response.data);
                // Todo : Create Alert windows if status is not 200
                if (response.status != 200){
                    $scope.message = response.data;
                } else {
                    console.log("Mark as logged and go to new route...");
                    $rootScope.loggedInUser = $scope.username;
                    $cookies.put('username', $scope.username);
                    $location.path('query');
                };
            })
            .error(function(err){
                console.log("Something goes wrong with in the login process..." + err.data);
                $scope.message = "Error : " + err.data.message.code + " - ";
            });
    };

});
