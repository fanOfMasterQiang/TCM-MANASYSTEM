export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'number'] },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },

      // hide
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },

      // forms
      {
        path: '/number',
        icon: 'form',
        name: 'number',
        routes: [
          {
            path: '/number/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Number/AdvancedForm',
          },
        ],
      },
      // account
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },
      // users
      {
        path: '/users',
        icon: 'table',
        name: 'users',
        routes: [
          {
            path: '/users/page-list',
            name: 'users-mana',
            component: './Users/pageList',
          },
          {
            path: '/users/info',
            name: 'userInfo',
            component: './Users/userInfo',
          },
        ],
      },
      // diagnosis
      {
        path: '/diagnosis',
        icon: 'table',
        name: 'diagnosis',
        routes: [
          {
            path: '/diagnosis/syndrome',
            name: 'syndrome',
            component: './Diagnosis/syndrome',
          },
          {
            path: '/diagnosis/symptom',
            name: 'symptom',
            component: './Diagnosis/symptom',
          },
        ],
      },
      // nearby
      {
        path: '/nearby',
        icon: 'form',
        name: 'nearby',
        routes: [
          {
            path: '/nearby/doctor',
            name: 'doctor',
            component: './NearBy/Doctor',
          },
          {
            path: '/nearby/doctorInfo',
            name: 'doctorInfo',
            component: './NearBy/DoctorInfo',
          },
        ],
      },
      // recipes
      {
        path: '/recipes',
        icon: 'form',
        name: 'recipes',
        routes: [
          {
            path: '/recipes/index',
            name: 'recipes',
            component: './Recipes/Recipes',
          },
          {
            path: '/recipes/recipeInfo',
            name: 'recipeInfo',
            component: './Recipes/RecipeInfo',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
