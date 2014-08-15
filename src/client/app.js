module = angular.module('app', 
    ['ninja.filters', 
     'ninja.config',
     'ui.router', 
     'ui.bootstrap',
     // 'mgcrea.ngStrap.popover',
     'angulartics', 
     'angulartics.google.analytics']);

filters = angular.module('ninja.filters', []);

// *************************************************************
// Delay start 
// *************************************************************

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

// *************************************************************
// States
// *************************************************************

module.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$analyticsProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $analyticsProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('repo', {
                abstract: true,
                url: '/:user/:repo',
                templateUrl: '/templates/repo.html',
                resolve: {
                    repo: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('repos', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo
                            });
                        }
                    ]
                }
            })
            .state('repo.list', {
                url: '',
                templateUrl: '/templates/list.html',
                controller: 'RepoCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }]
                }
            })
            .state('repo.pull', {
                url: '/pull/:number',
                templateUrl: '/templates/pull.html',
                controller: 'PullCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }],
                    pull: ['$stateParams', '$HUBService',
                        function($stateParams, $HUBService) {
                            return $HUBService.call('pullRequests', 'get', {
                                user: $stateParams.user,
                                repo: $stateParams.repo,
                                number: $stateParams.number
                            });
                        }
                    ]
                }
            })
            .state('repo.settings', {
                url: '/settings',
                templateUrl: '/templates/settings.html',
                controller: 'SettingsCtrl',
                resolve: {
                    repo: ['repo', function(repo) {
                        return repo; // inherited from parent state
                    }],
                    settings: ['$RPCService', 'repo', function($RPCService, repo) {
                        return $RPCService.call('conf', 'all', {
                            repo: repo.value.id
                        });
                    }],
                    bots: ['$RPCService', 'repo', function($RPCService, repo) {
                        return $RPCService.call('tool', 'all', {
                            repo: repo.value.id
                        });
                    }]
                }
            });

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        $analyticsProvider.withAutoBase(true); // Records full path

    }
])
.run(['$config', '$rootScope', '$state', '$stateParams',
    function($config, $rootScope, $state, $stateParams) {

        console.log( $state );

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $config.get(function(data, status) {
            if (data.gacode) {
                ga('create', data.gacode, 'auto');
            }
        });
    }
]);
