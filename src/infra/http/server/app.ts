import 'reflect-metadata'
import '@infra/containers/index'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import cors, { CorsOptions } from 'cors'
import { ZodError } from 'zod'
import { statusCodeMapper } from '../statusCode/statusCodeMapper'
import { fromZodError } from 'zod-validation-error'
import { env } from '@env/index'
import { routes } from '../routes'

const app = express()
const corsOptions: CorsOptions = {
  origin: [env.DEV_URL, env.PROD_URL, env.DEPLOY_URL],
  credentials: true,
}
app.use(express.json())
app.use(cors(corsOptions))
app.use(routes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)

  if (err instanceof ZodError) {
    console.log('')

    const zodErr = fromZodError(err)

    if (env.NODE_ENV === 'dev') console.log(zodErr)

    return res.status(statusCodeMapper.BadRequest).json({
      error: zodErr,
      statusCode: statusCodeMapper.BadRequest,
      message: 'Cant be validate input user infos.',
    })
  }

  return res.status(statusCodeMapper.InternalServerError).json({
    message: 'Internal server error',
    statusCode: statusCodeMapper.InternalServerError,
  })
})

app.listen(env.PORT, () =>
  console.log(`Server is listening on port ${env.PORT}`),
)
