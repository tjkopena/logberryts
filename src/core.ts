import { Task } from "./task.js"
import { Event } from "./event.js"
import { D } from "./d.js"

export enum EventCode {
  NOOP    = 'NOOP',
  BEGIN   = 'BEGIN',
  END     = 'END',
  INFO    = 'INFO',
  ERROR   = 'ERROR',
  WARNING = 'WARN'
}

export interface Output {
  output(event: Event) :void
}

var outputs: Output[] = []

export function addOutput(output: Output) {
  outputs.push(output)
}

export function emit(code: EventCode, component: Task|null, task: Task,
                     msg: string, timestamp: number, args: D) {
  let event = new Event(code, component, task, msg, timestamp, args)
  for (let o of outputs) {
    o.output(event)
  }
}

export var main: Task = new Task(null, "main")
