import * as core from "./core.js"
import { Event } from "./event.js"
import { D } from "./d.js"

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

    let msg = ((!event.task.is_func && !event.task.is_component) ? ' - ' : ' ') + event.msg

    let eph = new D(event.ephemeral)
    let blob_text = eph.get('text')
    if (blob_text)
      eph.delete('text')
    let blob_binary = eph.get('binary')
    if (blob_binary)
      eph.delete('binary')


    console.log(`${event.code} ${label_comp}${label_task}${msg} <${id}> {${eph.text()}}${(eph)?' ':''}${(blob_text || blob_binary)?'>>':''}`+((blob_text)?"\n"+blob_text:'')+((blob_binary)?"\n"+blob_binary:''))

  }

}
core.addOutput(new ConsoleOutput())
