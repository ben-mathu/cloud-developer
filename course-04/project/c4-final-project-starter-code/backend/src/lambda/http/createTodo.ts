import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import config from '../../config/config'
import { TodoService } from '../../businessLogic/todos'

const tableName = config['todoTable']

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const todoService = new TodoService()
    return await todoService.createTodoItem(tableName, getUserId(event), newTodo)
  }
)

handler.use(
  cors({
    credentials: true
  })
)
