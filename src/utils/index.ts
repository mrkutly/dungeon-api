import { Router, Request, Response, NextFunction } from 'express';

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (middleware: Wrapper[], router: Router): void => {
  middleware.forEach(func => func(router));
};

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type Route = {
  path: string;
  method: string;
  handler: Handler | Handler[];
};

export const applyRoutes = (routes: Route[], router: Router): void => {
  routes.forEach(route => {
    const { method, path, handler } = route;
    /**
     * this translates to 
     * router.get('/', (req, res) => res.send('hello')) 
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router as any)[method](path, handler);
  });
};