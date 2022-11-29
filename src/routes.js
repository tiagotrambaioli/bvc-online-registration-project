import { Router } from 'express';
import HelloController from './controllers/HelloController.js';
import UsersController from './controllers/UsersController.js';

const routes = new Router();

routes.get('/hello', HelloController.index);
routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);

export default routes;
