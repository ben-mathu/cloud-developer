import 'source-map-support/register'
import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import config from '../../config/config'
import { getUserId } from '../utils'
import { TodoService } from '../../helpers/todos'

const tableName = config['todoTable']

if (config.is_offline) {
  AWSXRay.getSegment()
}

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return new TodoService().getAllTodos(tableName, getUserId(event))
  }
)

handler.use(
  cors({
    credentials: true
  })
)
