import store from '@/store';

/*
* This middleware will change the layout of the page
*/

export default async function (route, from, next) {
    store.commit('menu/toggle', false);
    store.commit('changeLayout', /\/dashboard\/?.*/.test(route.path) ? 'dashboard' : 'master');
    next();
}
