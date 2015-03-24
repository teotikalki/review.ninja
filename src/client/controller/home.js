'use strict';
// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$HUB', '$RPC',
    function($rootScope, $scope, $state, $stateParams, $HUB, $RPC) {

        $scope.repos = [];

        $RPC.call('user', 'get', {}, function(err, user) {
            var count = 0;
            var repos = user ? user.value.repos : [];

            $scope.loaded = count === repos.length;

            repos.forEach(function(uuid) {
                $HUB.call('repos', 'one', {
                    id: uuid
                }, function(err, repo) {
                    $scope.loaded = ++count === repos.length;
                    if(!err) {
                        $scope.repos.push(repo.value);
                    }
                });
            });
        });

        $scope.allRepos = $HUB.call('repos', 'getAll', {
            headers: {accept: 'application/vnd.github.moondragon+json'},
            per_page: 50
        });

        //
        // Actions
        //

        $scope.add = function(repo) {
            $RPC.call('user', 'addRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err) {
                $scope.active = null;
                if(!err) {
                    repo.adddate = -new Date();
                    $scope.repos.push(repo);

                    $scope.search = '';
                    $scope.show = false;
                }
            });
        };

        $scope.remove = function(repo) {
            var index = $scope.repos.indexOf(repo);
            $RPC.call('user', 'rmvRepo', {
                user: repo.owner.login,
                repo: repo.name,
                repo_uuid: repo.id
            }, function(err) {
                if(!err) {
                    $scope.repos.splice(index, 1);
                }
            });
        };

        $scope.contains = function(id) {
            var contains = false;
            $scope.repos.forEach(function(repo) {
                contains = contains || repo.id === id;
            });

            return contains;
        };
    }
]);
