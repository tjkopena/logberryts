import * as core from "./core.js"
import { Event } from "./event.js"

export class ConsoleOutput implements core.Output {
  output(event: Event) {
    // let date = new Date(evt.timestamp)
    // let tstamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}

    let id = `${event.task.id}` + ((event.task.parent_id) ? `:${event.task.parent_id}` : '')

    let label_comp = ''
    if (event.component) {
      label_comp = event.component.label +
        ((event.component.identifiers) ? `${event.component.identifiers.text()}` : '') +
        '::'
    }

    let delim = ['', '']
    if (event.task.is_component)
      if (event.task.identifiers)
        delim = ['[', ']']
    else if (event.task.is_func)
      delim = ['(', ')']
    else if (event.task.identifiers)
      delim = [' {', '}']
    let label_task = `${event.task.label}${delim[0]}${event.task.identifiers.text()}${delim[1]}`

    console.log(`${event.code} ${label_comp}${label_task} ${id}`)
  }

}
core.addOutput(new ConsoleOutput())
