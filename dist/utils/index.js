"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = (middleware, router) => {
    middleware.forEach(func => func(router));
};
exports.applyRoutes = (routes, router) => {
    routes.forEach(route => {
        const { method, path, handler } = route;
        /**
         * this translates to
         * router.get('/', (req, res) => res.send('hello'))
         */
        router[method](path, handler);
    });
};
//# sourceMappingURL=index.js.map