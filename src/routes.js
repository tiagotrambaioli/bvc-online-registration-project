import { Router } from 'express';
import CoursesController from './controllers/CoursesController.js';
import ProgramsController from './controllers/ProgramsController.js';
import QuestionFormsController from './controllers/QuestionFormsController.js';
import UsersController from './controllers/UsersController.js';

const routes = new Router();

// USERS ROUTES
routes.post('/users', UsersController.create);
routes.post('/users/show', UsersController.showAll);
routes.get('/users/:uuid', UsersController.show);
routes.put('/users', UsersController.update);
routes.delete('/users/:uuid', UsersController.destroy);

// QUESTION FORMS

routes.post('/questionforms', QuestionFormsController.create);
routes.get('/questionforms', QuestionFormsController.showAll);
routes.get('/questionforms/:uuid', QuestionFormsController.show);
routes.put('/questionforms', QuestionFormsController.update);
routes.delete('/questionforms/:uuid', QuestionFormsController.destroy);

// COURSES

routes.post('/courses', CoursesController.create);
routes.get('/courses', CoursesController.showAll);
routes.get('/courses/:search', CoursesController.show);
routes.put('/courses', CoursesController.update);
routes.delete('/courses/:uuid', CoursesController.destroy);

// PROGRAMS

// COURSES

routes.post('/programs', ProgramsController.create);
routes.get('/programs', ProgramsController.showAll);
routes.get('/programs/:search', ProgramsController.show);
routes.put('/programs', ProgramsController.update);
routes.delete('/programs/:uuid', ProgramsController.destroy);

export default routes;
