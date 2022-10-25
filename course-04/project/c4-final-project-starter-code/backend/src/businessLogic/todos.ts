import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger';
import config from '../config/config';
import { TodoItem } from '../dataLayer/models/TodoItem';
import { TodoUpdate } from '../dataLayer/models/TodoUpdate';

// TODO: Implement businessLogic
export class TodoService {
  todoAccess = new TodosAccess()
  logger = createLogger('TodosAccess')

  createTodoItem = async (tableName: string, userId: string, newTodo: CreateTodoRequest) => {
    const id = uuid.v4()

    const item: TodoItem = {
      todoId: id,
      userId: userId,
      name: newTodo.name,
      dueDate: newTodo.dueDate,
      createdAt: new Date().toLocaleDateString(),
      done: false
    }

    this.logger.debug(`Item ${item}`)

    await this.todoAccess.createTodoItem(tableName, item)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: item
      })
    }
  }

  deleteTodoItem = (tableName: string, todoId: string, userId: string) => {
    this.todoAccess.deleteItem(tableName, todoId, userId)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
  }

  getSignedUrl = async (todoId: string, userId: string) => {
    const attachmentUtil = new AttachmentUtils()

    this.logger.info(`Bucket name: ${config['bucket-name']}`)
    this.logger.info(`Todo ID: ${todoId}`)
    const url = await attachmentUtil.getUrl(todoId)

    this.logger.info(`Signed Put URL: ${url}`)

    if (url) {
      // add url to todo item
      await this.todoAccess.updateTodoItemAttachmentUrl(todoId, userId)
      this.logger.info('Added attachment url')
      
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          message: 'URL is empty'
        })
      }
    }
  }

  getAllTodos = async (tableName: string, userId: string) => {
    const todos = await this.todoAccess.getAllTodos(tableName, userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos
      })
    }
  }

  updateTodo = async (tableName: string, todoId: string, updatedTodo: UpdateTodoRequest, userId: string) => {
    const item: TodoUpdate = {
      done: updatedTodo.done,
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate
    }

    await this.todoAccess.updateTodoItem(tableName, todoId, item, userId)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ""
    }
  }
}
