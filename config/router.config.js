export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login/Login' },
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
        icon: 'contacts',
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
        icon: 'desktop',
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
        icon: 'team',
        name: 'users',
        routes: [
          {
            path: '/users/mana',
            name: 'userMana',
            component: './Users/pageList',
          },
          {
            path: '/users/mana/userInfo',
            name: 'userInfo',
            hideInMenu: true,
            component: './Users/userInfo',
          },
        ],
      },

      // diagnosis
      // {
      //   path: '/diagnosis',
      //   icon: 'table',
      //   name: 'diagnosis',
      //   routes: [
      //     {
      //       path: '/diagnosis/syndrome',
      //       name: 'syndrome',
      //       component: './Diagnosis/syndrome',
      //     },
      //     {
      //       path: '/diagnosis/symptom',
      //       name: 'symptom',
      //       component: './Diagnosis/symptom',
      //     },
      //   ],
      // },

      // nearby
      {
        path: '/nearby',
        icon: 'environment',
        name: 'nearby',
        routes: [
          {
            path: '/nearby/doctor',
            name: 'doctor',
            component: './NearBy/Doctor',
          },
          {
            path: '/nearby/doctor/doctorInfo',
            name: 'doctorInfo',
            hideInMenu: true,
            component: './NearBy/DoctorInfo',
          },
        ],
      },
      // recipes
      {
        path: '/recipes',
        icon: 'profile',
        name: 'recipes',
        routes: [
          {
            path: '/recipes/recipes',
            name: 'recipes',
            component: './Recipes/Recipes',
          },
          {
            path: '/recipes/recipes/recipeInfo',
            name: 'recipeInfo',
            hideInMenu: true,
            component: './Recipes/RecipeInfo',
          },
        ],
      },
      // acupoint
      {
        path: '/acupoint',
        icon: 'pushpin',
        name: 'acupoint',
        routes: [
          {
            path: '/acupoint/acupoint',
            name: 'acupoint',
            component: './Acupoint/Acupoint',
          },
          {
            path: '/acupoint/acupoint/acupointVideo',
            name: 'acupointVideo',
            hideInMenu: true,
            component: './Acupoint/AcupointVideo',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
