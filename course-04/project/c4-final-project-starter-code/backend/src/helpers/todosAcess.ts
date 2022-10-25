import * as AWSXRay from 'aws-xray-sdk'
// import * as AWSXRay from 'aws-xray-sdk-core'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import config from '../config/config';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

export class TodosAccess {
  dynamoDbClient
  
  logger = createLogger('TodosAccess')
  
  constructor() {
    this.logger.info('Setting up Todos Access')
    this.dynamoDbClient = this.createDynamoClient()

    this.logger.info('Completed setup')
  }

  createDynamoClient = () => {
    AWSXRay.captureAWS(AWS)
    if (config.is_offline) {
      this.logger.info('Creating local dynamo instance')
      return new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }

    return new AWS.DynamoDB.DocumentClient({
      service: new DynamoDB({})
    })
  }

  updateTodoItemAttachmentUrl = async (todoId: string, userId: string) => {
    const urlFormat = `https://${config['bucket-name']}.s3.amazonaws.com/${todoId}`
    this.logger.info(`Todo ID: ${todoId}`)
    this.logger.info(`URL to save ${urlFormat}`)
    await this.dynamoDbClient.update({
      TableName: config['todoTable'],
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set attachmentUrl =:a',
      ExpressionAttributeValues: {
        ':a': urlFormat
      }
    }).promise()
  }

  // TODO: Implement the dataLayer logic
  createTodoItem = async (tableName: string, item: TodoItem) => {

    this.logger.info('Create a new Todo Item')
    await this.dynamoDbClient.put({
      TableName: tableName,
      Item: item
    }).promise()
  }

  updateTodoItem = async (tableName: string, todoId: string, item: TodoUpdate, userId: string) => {

    this.logger.info('Update an existing Todo Item')
    await this.dynamoDbClient.update({
      TableName: tableName,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set #todoName = :n, dueDate = :d, done = :done',
      ExpressionAttributeNames: {
        '#todoName': 'name'
      },
      ExpressionAttributeValues: {
        ':n': item.name,
        ':d': item.dueDate,
        ':done': item.done
      }
    }).promise()
  }

  getAllTodos = async (tableName: string, userId: string) => {
    this.logger.info('Getting all todo items by user id')
    const result = await this.dynamoDbClient.query({
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items
  }

  deleteItem = async (tableName: string, todoId: string, userId: string) => {
    await this.dynamoDbClient.delete({
      TableName: tableName,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }).promise()
  }
}

