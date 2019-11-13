import Vue from 'vue';
import store from '@/store';
import socket from '@/modules/socket';
import {dispatch} from '@/modules/store-initializer';
import notification from '@/stores/notification.store';

export default async function (user) {

    const path = 'notification';

    // Undo
    if (!user) {
        store.unregister(path);

        return;
    }

    // Don't modify prototype twice
    if (!Vue.prototype.$socket) {
        Vue.prototype.$socket = socket;
    }

    // Add menu items based on roles
    const {permissions} = user;
    const items = [
        {
            title: 'Profile',
            link: 'profile',
            icon: 'fa fa-user',
        },
        {
            title: 'নোটিফিকেশন',
            link: 'notifications',
            icon: 'fa fa-bell',
            badge: 0
        },
        {
            permission: 'roles',
            title: 'Roles',
            link: 'roles',
            icon: 'fa fa-shield-alt'
        },
        {
            permission: 'moderators',
            title: 'Moderators',
            link: 'moderators',
            icon: 'fas fa-user-shield'
        },
        {
            permission: 'users',
            title: 'Users',
            link: 'users',
            icon: 'fa fa-users',
        },
        {
            permission: 'job-requests',
            title: 'Job Requests',
            link: 'job-requests',
            icon: 'fa fa-stream',
        },
        {
            permission: 'positions',
            title: 'Positions',
            link: 'positions',
            icon: 'fa fa-graduation-cap',
        },
        {
            permission: 'categories',
            title: 'Categories',
            link: 'categories',
            icon: 'fa fa-school',
        },
        {
            permission: 'institute-types',
            title: 'Institute Types',
            link: 'institute-types',
            icon: 'fa fa-clipboard-list',
        },
        {
            permission: 'geolocation',
            title: 'Geolocation',
            link: 'divisions',
            icon: 'fa fa-globe-asia',
        },
        {
            permission: 'pages',
            title: 'Pages',
            link: 'pages',
            icon: 'fa fa-scroll',
        },
        {
            permission: 'menu',
            title: 'Menu',
            link: 'menu',
            icon: 'fa fa-bars',
        },
        {
            permission: 'settings',
            title: 'Settings',
            link: 'settings',
            icon: 'fa fa-cog',
        }
    ];
    const filtered = items.filter(item => {
        if (permissions.includes('all')) {
            return true;
        }

        if (!item.permission) {
            return true;
        }

        return permissions.includes(item.permission);

    }).map(item => {
        item.link = `/dashboard/${item.link}`;
        return item;
    });


    // Push menu items
    store.commit('menu/items', filtered);

    // Register notification store module

    store.registerModule(path, notification);

    const modules = [store._modules.root._children[path]];

    await dispatch(modules, 'initialize');
    await dispatch(modules, 'initialized');
}
