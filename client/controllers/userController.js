//============
// User Page (index)
//============
CMDBappControllers.controller('userCtrl', function($scope, $http, $location, $cookies, $cookieStore, $rootScope){
    $scope.title = "";
    console.log("User Controller");

    $scope.usertitle = "CMDB App - User Info";

    var username = $cookies.get('username');
    console.log("Username : " + username);

    $scope.getUserInfo = function(){
        console.log("Ask for User Info...");
                    
        var req = $http.get("api/user/"+username)
            .success(function(response){
                console.log("Back from Server with success ! > " + response.status + ": " + response.data);
                // Todo : Create Alert windows if status is not 200
                if (response.status != 200){
                    $scope.message = response.data;
                } else {
                    console.log(response.data);
                    var answer = response.data.entries[0];
                    $scope.FullName = answer.values['Full Name'];
                    $scope.EmailAddress = answer.values['Email Address'];
                    $scope.NofifyMechanism = answer.values['Default Notify Mechanism'];
                    $scope.LicenseType = answer.values['License Type'];
                    $scope.ComputedGrpList = answer.values['Computed Grp List'];
                    $scope.ApplicationLicense = answer.values['Application License'];
                };
            })
            .error(function(err){
                console.log("Something goes wrong with in the login process..." + err.data);
                $scope.message = "Error : " + err.data.message.code + " - ";
            }); 
    };

    $scope.Cancel = function(){
        $location.path('/query');
    }

    $scope.Logout = function(){
        console.log("Logout");
        var req = $http.post("api/logout")
            .success(function(response){
                if (response.status != 204){

                } else {
                    $rootScope.loggedInUser = null;
                    console.log("Disconnected");                   
                    $location.path('/login');
                }

            })
            .error(function(err){
                console/log("Something goes wrong with the logout process... "+ err.data);
            })
    };

});

