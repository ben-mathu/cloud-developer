import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger';

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

  getSignedUrl = (bucketName: string, todoId: string) => {
    const attachmentUtil = new AttachmentUtils()

    let url = ""
    this.logger.debug(`Todo ID: ${todoId}`)
    attachmentUtil.getUrl(bucketName, todoId)
      .then((value: string) => {
        url = value

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
      }).catch((error) => {
        this.logger.error(error)
      })

    this.logger.info(`Signed Put URL: ${url}`)

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

  updateTodo = async (tableName: string, todoId: string, updatedTodo: UpdateTodoRequest) => {
    const item: TodoUpdate = {
      done: updatedTodo.done,
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate
    }

    await this.todoAccess.updateTodoItem(tableName, todoId, item)

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
