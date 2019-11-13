import store from '@/store';

// function waitUntilChange(prop, expected) {
//     return new Promise(resolve => {
//         const unwatch = store.watch(state => {
//             const path = prop.split('.');
//
//             let watched = state;
//
//             path.forEach(prop => {
//                 watched = watched[prop];
//             });
//
//             return watched;
//         }, newValue => {
//             if (expected !== undefined && newValue !== expected) {
//                 return;
//             }
//
//             unwatch();
//
//             resolve(newValue);
//         });
//     });
// }


export default function waitUntilInitialized() {
    return new Promise(resolve => {
        if (store.state.initialized === true) {
            return resolve();
        }

        const unsubscribe = store.subscribeAction(function (action) {
            if (action.type !== 'bootstrapped') {
                return;
            }

            unsubscribe();

            resolve();
        });
    });
}
