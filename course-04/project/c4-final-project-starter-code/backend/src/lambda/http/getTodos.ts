import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import config from '../../config/config'
import { getUserId } from '../utils'
import { TodoService } from '../../businessLogic/todos'

const tableName = config['todoTable']

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoService = new TodoService()
    return await todoService.getAllTodos(tableName, getUserId(event))
  }
)

handler.use(
  cors({
    credentials: true
  })
)
