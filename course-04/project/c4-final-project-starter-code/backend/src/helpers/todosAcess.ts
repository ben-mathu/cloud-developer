import * as AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export class TodosAccess {
  documentClient = new DocumentClient({
    service: new DynamoDB()
  })

  logger = createLogger('TodosAccess')

  constructor() {
    AWSXRay.captureAWSClient((this.documentClient as any).service)
  }

  // TODO: Implement the dataLayer logic
  createTodoItem = async (tableName: string, item: TodoItem) => {

    this.logger.info('Create a new Todo Item')
    await this.documentClient.put({
      TableName: tableName,
      Item: item
    }).promise()
  }

  updateTodoItem = async (tableName: string, todoId: string, item: TodoUpdate) => {

    this.logger.info('Update an existing Todo Item')
    await this.documentClient.update({
      TableName: tableName,
      Key: {
        todoId: todoId
      },
      UpdateExpression: 'set name = :n, dueDate = :d, done = :done',
      ExpressionAttributeValues: {
        ':n': item.name,
        ':d': item.dueDate,
        ':done': item.done
      }
    }).promise()
  }

  getAllTodos = async (tableName: string, userId: string) => {
    this.logger.info('Getting all todo items by user id')
    const result = await this.documentClient.query({
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items
  }

  deleteItem = async (tableName: string, todoId: string, userId: string) => {
    await this.documentClient.delete({
      TableName: tableName,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }).promise()
  }
}

