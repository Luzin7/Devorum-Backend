import { authMiddleware } from '@infra/http/middlewares/authMiddleware'
import { CreateSessionController } from '@module/users/controllers/createSessionController'
import { CreateUserController } from '@module/users/controllers/createUserController'
import { DeleteUserController } from '@module/users/controllers/deleteUserUseCase'
import { GetUserController } from '@module/users/controllers/getUserController'
import { RefreshTokenController } from '@module/users/controllers/refreshTokenController'
import { Router } from 'express'

const createUserController = new CreateUserController()
const createSessionController = new CreateSessionController()
const getUserController = new GetUserController()
const deleteUserController = new DeleteUserController()
const refreshTokenController = new RefreshTokenController()

const usersRoutes = Router()

usersRoutes.post('/users', createUserController.handle)
usersRoutes.post('/sessions', createSessionController.handle)
usersRoutes.post('/sessions/refresh', refreshTokenController.handle)

usersRoutes.get('/users', authMiddleware.middle, getUserController.handle)
usersRoutes.delete('/users', authMiddleware.middle, deleteUserController.handle)

export { usersRoutes }
