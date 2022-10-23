import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import config from '../../config/config'
import { TodoService } from '../../helpers/todos'

const tableName = config['todoTable']

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    // const item: TodoUpdate = {
    //   ...updatedTodo
    // }

    // logger.info('Update an existing Todo Item')
    // await docClient.update({
    //   TableName: tableName,
    //   Key: {
    //     todoId: todoId
    //   },
    //   UpdateExpression: 'set name = :n, dueDate = :d, done = :done',
    //   ExpressionAttributeValues: {
    //     ':n': item.name,
    //     ':d': item.dueDate,
    //     ':done': item.done
    //   }
    // }).promise()

    // // await this.todoAccess.updateTodoItem(tableName, todoId, item)

    // return {
    //   statusCode: 201,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials': true
    //   },
    //   body: ""
    // }
    return new TodoService().updateTodo(tableName, todoId, updatedTodo)
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
