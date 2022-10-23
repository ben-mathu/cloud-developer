import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import config from '../../config/config'
import { getUserId } from '../utils'
import { TodoService } from '../../helpers/todos'

const tableName = config['todoTable']

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    // logger.info('Getting all todo items by user id')
    // const result = await dynamoClient.query({
    //   TableName: tableName,
    //   KeyConditionExpression: 'userId = :userId',
    //   ExpressionAttributeValues: {
    //     ':userId': getUserId(event)
    //   }
    // }).promise()

    // return {
    //   statusCode: 200,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   body: JSON.stringify({
    //     items: result.Item
    //   })
    // }
    return new TodoService().getAllTodos(tableName, getUserId(event))
  }
)

handler.use(
  cors({
    credentials: true
  })
)
