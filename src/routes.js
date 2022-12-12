import { Router } from 'express';
import AuthController from './controllers/auth/AuthController.js';
import CoursesController from './controllers/CoursesController.js';
import ProgramsController from './controllers/ProgramsController.js';
import QuestionFormsController from './controllers/QuestionFormsController.js';
import UsersController from './controllers/UsersController.js';
import ReportsController from './controllers/ReportsController.js';
import AuthenticateRole from './middlewares/AuthenticateRole.js';
import AuthenticateToken from './middlewares/AuthenticateToken.js';

const routes = new Router();

// AUTHENTICATION ROUTES
routes.post('/login', AuthController.login);
routes.post('/logout', AuthController.deleteToken);
routes.post('/token', AuthController.token);

// USERS ROUTES
routes.post('/users', UsersController.create);
routes.post('/users/show', AuthenticateToken, AuthenticateRole('admin'), UsersController.showAll);
routes.get('/users/:uuid', AuthenticateToken, UsersController.show);
routes.put('/users', AuthenticateToken, AuthenticateRole('admin'), UsersController.update);
routes.delete('/users/:uuid', AuthenticateToken, UsersController.destroy);

// QUESTION FORMS

routes.post('/questionforms', QuestionFormsController.create);
routes.get('/questionforms', AuthenticateToken, AuthenticateRole('admin'), QuestionFormsController.showAll);
routes.get('/questionforms/:uuid', AuthenticateToken, AuthenticateRole('admin'), QuestionFormsController.show);
routes.put('/questionforms', AuthenticateToken, AuthenticateRole('admin'), QuestionFormsController.update);
routes.delete('/questionforms/:uuid', AuthenticateToken, AuthenticateRole('admin'), QuestionFormsController.destroy);

// COURSES

routes.post('/courses', AuthenticateToken, AuthenticateRole('admin'), CoursesController.create);
routes.get('/courses', CoursesController.showAll);
routes.get('/courses/:search', CoursesController.show);
routes.put('/courses', AuthenticateToken, AuthenticateRole('admin'), CoursesController.update);
routes.delete('/courses/:uuid', AuthenticateToken, AuthenticateRole('admin'), CoursesController.destroy);

// PROGRAMS

routes.post('/programs', AuthenticateToken, AuthenticateRole('admin'), ProgramsController.create);
routes.get('/programs', ProgramsController.showAll);
routes.get('/programs/:search', ProgramsController.show);
routes.put('/programs', AuthenticateToken, AuthenticateRole('admin'), ProgramsController.update);

routes.get('/programs/students/:uuid', AuthenticateToken, AuthenticateRole('admin'), ProgramsController.students);
routes.delete('/programs/:uuid', AuthenticateToken, AuthenticateRole('admin'), ProgramsController.destroy);

// REPORTS
routes.post('/program-students', AuthenticateToken, AuthenticateRole('admin'), ReportsController.programStudents);

export default routes;
