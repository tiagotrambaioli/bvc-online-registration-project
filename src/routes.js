import { Router } from 'express';
import HelloController from './controllers/HelloController.js';
import QuestionFormsController from './controllers/QuestionFormsController.js';
import UsersController from './controllers/UsersController.js';

const routes = new Router();

routes.get('/hello', HelloController.index);

// USERS ROUTES
routes.post('/users', UsersController.create);
routes.post('/users/show', UsersController.showAll);
routes.get('/users/:uuid', UsersController.show);
routes.put('/users/update', UsersController.update);
routes.delete('/users/delete/:uuid', UsersController.destroy);

// QUESTION FORMS

routes.post('/questionform', QuestionFormsController.create);
routes.get('/questionform/show', QuestionFormsController.showAll);
routes.get('/questionform/:uuid', QuestionFormsController.show);
routes.put('/questionform/update', QuestionFormsController.update);
routes.delete('/questionform/delete/:uuid', QuestionFormsController.destroy);

export default routes;
