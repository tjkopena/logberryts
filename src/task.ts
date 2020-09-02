import { EventCode, emit } from './core.js'
import { Exception, exception_label } from './exception.js'
import { D  } from './d.js'

export class Task {
  static counter = 0

  id: number
  label: string
  identifiers: D
  reports: D
  is_func: boolean
  is_component: boolean
  parent: Task | null
  containing_component: Task | null
  failed: boolean

  constructor(parent: Task|null, label: string, is_func=false, is_component=false,
              identifiers={}) {
    Task.counter++
    this.id = Task.counter

    this.failed = false

    this.is_func = is_func
    this.is_component = is_component

    this.identifiers = new D(Object.entries(identifiers))
    this.reports = new D()

    this.parent = parent
    while (parent && !parent.is_component)
      parent = parent.parent
    this.containing_component = parent

    this.label = (label) ? label : "Task"

    this.event(EventCode.BEGIN, "")
  }

  attach(kwargs:object) {
    for (let [k,v] of Object.entries(kwargs))
      this.identifiers.set(k, v)
  }
  detach(...keys: string[]) {
    if (keys.length)
      for (let k of keys)
        this.identifiers.delete(k)
    else
      this.identifiers.clear()
  }

  report(kwargs:object) {
    for (let [k,v] of Object.entries(kwargs))
      this.reports.set(k, v)
  }
  retract(...keys: string[]) {
    if (keys.length)
      for (let k of keys)
        this.reports.delete(k)
    else
      this.reports.clear()
  }

  event(evt: EventCode, msg: string, kwargs={}, timestamp=-1) {
    if (timestamp < 0)
      timestamp = Date.now()
    let args: D = new D([...this.reports, ...Object.entries(kwargs)])
    emit(evt, this.containing_component, this, msg, timestamp, args)
    this.reports.clear()
  }

  component(label: string, kwargs={}) :Task {
    return new Task(this, label, false, true, kwargs)
  }
  task(label='', kwargs={}, is_func=false) :Task {
    if (!label) {
      label = arguments.callee.caller.toString()
      is_func = true
    }
    return new Task(this, label, is_func, false, kwargs)
  }

  end(msg='', kwargs={}) {
    this.event(EventCode.END, msg, kwargs)
  }
  end_success(msg='', kwargs={}) {
    this.failed = false
    this.end(msg, kwargs)
  }
  end_exception(ex: Error, msg='', kwargs={}) :Error {
    this.failed = true
    msg = exception_label(ex, msg, new D(Object.entries(kwargs)))
    this.end(msg, kwargs)
    return ex
  }
  end_failure(msg='', kwargs={}, type:typeof Exception=Exception) :Exception {
    this.failed = true
    if (!msg)
      msg = "Failed"
    this.end(msg, kwargs)
    return new type(msg, { ...this.identifiers, ...kwargs })
  }

  info(msg: string, kwargs={}) {
    this.event(EventCode.INFO, msg, kwargs)
  }
  exception(ex: Error, msg='', kwargs={}) {
    msg = exception_label(ex, msg, new D(Object.entries(kwargs)))
    this.event(EventCode.ERROR, msg, kwargs)
  }
  error(msg: string, kwargs={}) {
    this.event(EventCode.ERROR, msg, kwargs)
  }
  warning(msg: string, kwargs={}) {
    this.event(EventCode.WARNING, msg, kwargs)
  }
}
