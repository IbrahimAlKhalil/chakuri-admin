import VueRouter from 'vue-router';
import viddleware, {group} from '@modules/viddleware';
import guest from '@middleware/guest';
import auth from '@middleware/auth';
import global from '@middleware/global';
import lazy from '@modules/lazy';
import users from '@/pages/dashboard/pages/users/page';

// TODO: Add 404 page

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard/profile'
        },

        {
            path: '/jobs/:id',
            component: () => lazy(import('./pages/job/page'))
        },

        ...group(guest, [
            {
                path: '/sign-in',
                component: () => lazy(import('./pages/sign-in/page'))
            },
            {
                path: '/forgot-password',
                component: () => lazy(import('./pages/forgot-password/page'))
            },
            {
                path: '/password-reset',
                component: () => lazy(import('./pages/password-reset/page'))
            }
        ]),

        ...group(auth, [
            {
                path: '/dashboard',
                redirect: {
                    path: '/dashboard/profile'
                },
                component: () => lazy(import('@/pages/dashboard/layout')),
                children: [
                    {
                        path: 'notifications',
                        component: () => lazy(import('@/pages/dashboard/pages/notification/page')),
                    },
                    {
                        path: 'job-requests',
                        component: () => lazy(import('@/pages/dashboard/pages/job-requests/page'))
                    },
                    {
                        path: 'profile',
                        component: () => lazy(import('@/pages/dashboard/pages/profile/page'))
                    },
                    {
                        path: 'moderators',
                        component: () => lazy(import('@/pages/dashboard/pages/moderators/page'))
                    },
                    {
                        path: 'roles',
                        component: () => lazy(import('@/pages/dashboard/pages/roles/page'))
                    },
                    {
                        path: 'positions',
                        component: () => lazy(import('@/pages/dashboard/pages/positions/page'))
                    },
                    {
                        path: 'categories',
                        component: () => lazy(import('@/pages/dashboard/pages/categories/page'))
                    },
                    {
                        path: 'institute-types',
                        component: () => lazy(import('@/pages/dashboard/pages/institute-types/page'))
                    },
                    {
                        path: 'divisions',
                        component: () => lazy(import('@/pages/dashboard/pages/divisions/page'))
                    },
                    {
                        path: 'districts/:division',
                        component: () => lazy(import('@/pages/dashboard/pages/districts/page'))
                    },
                    {
                        path: 'thanas/:district',
                        component: () => lazy(import('@/pages/dashboard/pages/thanas/page'))
                    },
                    {
                        path: 'users',
                        component: () => lazy(import('@/pages/dashboard/pages/users/page'))
                    },
                    {
                        path: 'pages',
                        component: () => lazy(import('@/pages/dashboard/pages/pages/page'))
                    },
                    {
                        path: 'pages/create',
                        component: () => lazy(import('@/pages/dashboard/pages/pages/create'))
                    },
                    {
                        path: 'pages/edit/:id',
                        component: () => lazy(import('@/pages/dashboard/pages/pages/create'))
                    },
                    {
                        path: 'menu',
                        component: () => lazy(import('@/pages/dashboard/pages/menu/page'))
                    },
                    {
                        path: 'menu/:id',
                        component: () => lazy(import('@/pages/dashboard/pages/menu-items/page'))
                    },
                    {
                        path: 'settings',
                        component: () => lazy(import('@/pages/dashboard/pages/settings/page'))
                    }
                ]
            }
        ]),
    ]
});

export default viddleware(router, [global]);
