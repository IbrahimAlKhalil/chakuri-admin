import request from '@/modules/request';
import socket from '@/modules/socket';
import {observeAuthState} from '@/stores/auth.store';

let menuItem;

function resolveNotificationMenuItem(rootState) {
    if (menuItem) {
        return menuItem;
    }

    rootState.menu.dashboard.some(item => {
        const ok = item.link === '/dashboard/notifications';

        if (ok) {
            menuItem = item;
        }

        return ok;
    });

    return menuItem;
}

export default {
    namespaced: true,

    state: {
        unread: 0,
        items: [],
        page: 0,
        perPage: 6,
        loading: false
    },

    mutations: {

        leaveRooms() {
            socket().removeAllListeners('n');
            socket().disconnect();
        },

        cleanup(state) {
            state.items = [];
            state.unreadCount = state.page = 0;
        },

        addNotification(state, payload) {
            state.items.unshift(payload);
            state.showCount = true;
        },

        unreadCount(state, payload) {
            const {rootState, count} = payload;

            let menuItem = resolveNotificationMenuItem(rootState);

            state.unread = menuItem.badge = count;
        }
    },

    actions: {

        async initialize({state, commit, dispatch, rootState}) {
            observeAuthState(user => {

                if (!user) {
                    // Do cleanup
                    commit('cleanup');

                    // Leave socket.io rooms
                    commit('leaveRooms');
                    return;
                }

                dispatch('loadUnreadCount');


                // Join socket.io rooms
                // Listen for notifications
                socket().on('n', payload => {
                    commit('addNotification', payload);
                    commit('unreadCount', {
                        rootState,
                        count: state.unread + 1
                    });
                });
            });
        },

        async loadUnreadCount({state, commit, rootState}) {
            // Load notifications

            const response = await request('notifications/unread-count').response();

            if (response.status !== 200) {
                return;
            }

            commit('unreadCount', {
                rootState,
                count: parseInt(response.text)
            });
        },

        async loadItems({state}) {
            const {page, perPage} = state;

            state.loading = true;

            const response = await request(`notifications?page=${page + 1}&perPage=${perPage}`).response();

            state.loading = false;

            const items = response.json();

            if (items.length) {
                state.page = page + 1;
            }

            items.forEach(item => state.items.push(item));
        },

        async hideCount({state, rootState}) {
            resolveNotificationMenuItem(rootState).badge = state.unread = 0;

            await request('activities/notificationClick').response();
        },

        async seen(context, item) {
            item.seen = true;

            await request('notifications/' + item.id, {
                method: 'POST'
            }).response();
        }
    }
};
