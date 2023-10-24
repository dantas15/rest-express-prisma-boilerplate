import {
  CreateUser,
  EditUser,
  GetUsers,
  GetUser,
  DeleteUser,
  LoginUser,
  ForgotPassword,
} from '@/services/UserService';
import { Router } from 'express';
import { userSchema, loginSchema } from '@/models/User';
import { AppError } from '@/errors/AppError';
import { sign } from 'jsonwebtoken';

const routes = Router();

routes.get('/', async (req, res) => {
  res.send(await GetUsers());
});

routes.get('/:id', async (req, res) => {
  res.send(await GetUser(req.params.id));
});

routes.post('/', async (req, res) => {
  const body = req.body;

  const validatedBody = userSchema.safeParse(body);

  if (!validatedBody.success) {
    throw new AppError(validatedBody.error);
  }

  res.send(await CreateUser(validatedBody.data));
});

routes.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  res.send(await ForgotPassword(email));
});

routes.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await LoginUser(email, password);

  const token = sign({ id: user.id, isAdmin: user.isAdmin }, 'secret', {
    expiresIn: '1d',
  });

  res.send({ user, token });
});

routes.put('/:id', async (req, res) => {
  res.send(await EditUser(req.params.id, req.body));
});

routes.delete('/:id', async (req, res) => {
  res.send(await DeleteUser(req.params.id));
});

export { routes as UserController };