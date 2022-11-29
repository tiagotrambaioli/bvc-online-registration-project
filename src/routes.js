import { Router } from 'express';
import HelloController from './controllers/HelloController.js';
import UsersController from './controllers/UsersController.js';

const routes = new Router();

routes.get('/hello', HelloController.index);
routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);
routes.post('/users/show', UsersController.showAll);
routes.get('/users/:uuid', UsersController.show);
routes.put('/users/update', UsersController.update);
routes.delete('/users/delete/:uuid', UsersController.destroy);

export default routes;
