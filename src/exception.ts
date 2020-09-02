import { D } from './d.js'

export class Exception extends Error {
  identifiers: D

  constructor(msg: string, kwargs={}) {
    super(msg)
    this.identifiers = new D(Object.entries(kwargs))

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
    // Error.captureStackTrace(this, Exception)

    // Restore prototype chain
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // https://stackoverflow.com/a/48342359
    // Not needed in ES6?
    // const actualProto = new.target.prototype
    // Object.setPrototypeOf(this, actualProto)
  }

  toString() :string {
    let d = this.identifiers.text()
    return this.message + ((d)? ' ':'') + d
  }

  text() :string {
    return this.constructor.name + ((this.message) ? ': '  : '') + this.message
  }

  data(): D {
    return this.identifiers
  }
}

export function exception_label(ex: Error, msg: string, kwargs: D) :string {
  if (ex instanceof Exception) {
    msg = ((msg)?(msg + ': '):'') + ex.text()
    for (let [k, v] of ex.data())
      kwargs.set(k, v)
  } else {
    let ex_str = ex.toString()
    let type_str = ex.constructor.name
    type_str = (ex_str.startsWith(type_str)) ? '' : (type_str + ': ')
    msg = ((msg)?(msg + ': '):'') + type_str + ex_str
  }
  return msg
}
