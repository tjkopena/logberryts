import { EventCode, main } from './core.js'
import * as _ from './task.js'
import { D } from './d.js'

export class Event {
  code: EventCode
  component: Event.Component | null
  task: Event.Task
  msg: string
  timestamp: number
  ephemeral: D

  constructor(code: EventCode, component: _.Task|null, task: _.Task,
              msg: string, timestamp: number, ephemeral: D) {
    this.code = code
    this.component = (component) ? new Event.Component(component) : null
    this.task = new Event.Task(task)
    this.msg = msg
    this.timestamp = timestamp
    this.ephemeral = ephemeral
  }

}

export namespace Event {
  export class Component {
    id: number
    label: string
    identifiers: D

    constructor(component: _.Task) {
      this.id = component.id
      this.label = component.label
      this.identifiers = component.identifiers
    }
  }

  export class Task {
    id: number
    parent_id: number
    is_func: boolean
    is_component: boolean
    label: string
    identifiers: D
    failed: boolean

    constructor(task: _.Task) {
      this.id = task.id
      this.parent_id = (task.parent) ? task.parent.id : 0
      this.is_func = task.is_func
      this.is_component = task.is_component
      this.label = task.label
      this.identifiers = task.identifiers
      this.failed = task.failed
    }
  }
}
