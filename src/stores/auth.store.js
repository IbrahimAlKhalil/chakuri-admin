/***
 * This module handles authentication related functionality
 */

import request, {Fetcher} from '../modules/request';
import {clearTokens, retrieveToken, saveToken} from '../modules/tokenizer';
import photo from '../assets/images/user.svg';
import router from '@/router';

// Auth state change handlers
const handlers = [];
const immediateHandlers = [];

// Add authentication before every request token
Fetcher.before(instance => {
    const {options} = instance;
    const token = retrieveToken();

    // Respect auth option
    // Token must exists
    if (options.auth !== false && token) {
        options.headers.Authorization = `Bearer ${token}`;
    }
});


// Handle refresh token
Fetcher.after((instance, response) => {
    const refreshToken = response.header('X-refresh-token');

    if (refreshToken) {
        // Refresh token provided
        saveToken(refreshToken);
    }
});

export default {
    namespaced: true,

    state: {
        user: null,
        initialized: false,
        altPhoto: photo
    },

    actions: {
        async initialized({state, dispatch}) {
            // Don't initialize authentication twice
            if (state.initialized) {
                // Auth is already initialized
                return state.user;
            }


            state.initialized = true;

            // Authorization token
            const token = retrieveToken();

            // Token should be saved in localStorage/sessionStorage
            if (!token) {
                return null;
            }

            // Token found

            // Attempt to sign-in

            return await dispatch('signIn');
        },

        async initialize() {
            observeAuthState(async user => {
                if (!user) {
                    return;
                }

                const loadAuthDep = (await import('@/modules/auth-extra-loader')).default;

                loadAuthDep(user);

            }, true);

            observeAuthState(user => {
                if (!user) {
                    router.replace('/sign-in').catch(() => {
                    });
                }
            });
        },

        async signIn({state}) {

            // Try to get user data
            const response = await request('user').response();

            // In order to get data, user must be authenticated
            if (response.status === 401) {
                // User is not authenticated

                // Clear old tokens
                clearTokens();
            }

            const user = response.status === 401 ? null : response.json();

            // Call immediate handlers
            await Promise.all(immediateHandlers.map(handler => handler(user)));

            // Set user which will render all the auth dependent info
            state.user = user;

            // Call auth state change handlers
            handlers.forEach(async handler => handler(state.user));

            return user;
        },

        signOut({state}) {
            state.user = null;

            // Clear saved tokens
            clearTokens();

            // Call auth state change handlers
            handlers.forEach(handler => handler(state.user));
        }
    },

    mutations: {
        updateUser(state, payload) {
            state.user[payload.prop] = payload.value;
        }
    }
};

export function observeAuthState(handler, immediate = false) {
    const arr = immediate ? immediateHandlers : handlers;

    arr.push(handler);

    return () => {
        arr.splice(arr.indexOf(handler), 1);
    };
}
