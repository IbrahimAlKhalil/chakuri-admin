import waitUntilInitialized from '@/modules/tool-kit';

export default function (router, globalMiddleware = []) {
    router.beforeResolve(async (route, from, next) => {

        // Make sure that the middleware array does exist
        if (!route.meta.hasOwnProperty('middleware') && !globalMiddleware.length) {
            //No middleware, call next
            return next();
        }

        const givenMiddleware = route.meta.middleware || [];

        // Middleware can be a NavigationGuard or an array of NavigationGuard
        // Middleware stack
        // Keep the "next" in the stack which should be called after all the middleware is called
        const stack = typeof givenMiddleware === 'function' ? [...globalMiddleware, givenMiddleware, next] : [...globalMiddleware, ...givenMiddleware, next];

        // This function will be used to make the chain
        const chain = (to) => {
            // Break the chain when there is no middleware to be called
            if (!stack.length) {
                return;
            }

            // Break the chain when next is called with parameter
            if (to !== undefined) {
                return next(to);
            }

            // Keep a reference to current middleware in the stack before removing it
            const middleware = stack[0];

            // Remove current middleware from the stack
            stack.shift();

            // Make sure that current middleware in the stack is not the next
            // If so, then call it without parameter
            if (middleware === next) {
                return next();
            }

            // Finally call the middleware

            middleware(route, from, chain);
        };

        // Wait until stores are initialized
        await waitUntilInitialized();

        // Make the chain
        chain();
    });

    return router;
}

export function group(middleware, routes) {
    let givenMiddleware = typeof middleware === 'function' ? [middleware] : middleware;

    // Iterate over all the routes and add middleware
    routes.forEach(route => {

        if (!route.hasOwnProperty('meta')) {
            route.meta = {};
        }

        // Check whether route has personal middleware
        if (route.meta.hasOwnProperty('middleware')) {
            const personalMiddleware = route.meta.middleware;

            if (typeof personalMiddleware === 'function') {
                givenMiddleware.push(personalMiddleware);
            } else if (Array.isArray(personalMiddleware)) {
                givenMiddleware = [...givenMiddleware, ...personalMiddleware];
            }
        }

        route.meta.middleware = givenMiddleware;

        if (route.children) {
            route.children = group(middleware, route.children);
        }
    });

    return routes;
}
