import config from '@/config';

const key = config.tokenKey;

export function retrieveToken() {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
}

export function saveToken(token, persist) {
    if (persist) {
        sessionStorage.removeItem(key);
        return localStorage.setItem(key, token);
    }

    const storage = localStorage.getItem(key) ? {store: localStorage, clear: sessionStorage} : {
        store: sessionStorage,
        clear: localStorage
    };

    storage.clear.removeItem(key);
    storage.store.setItem(key, token);
}

export function clearTokens() {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
}
