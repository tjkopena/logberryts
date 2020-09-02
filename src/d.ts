export class D extends Map<string, any> {
  text() :string {
    let s: string[] = []
    for (const [k, v] of this) {
      if (k.startsWith('_'))
        continue
      s.push(k + ": " + ((typeof v === "string")?('"'+v+'"'):v))
    }
    return s.join(', ')
  }
}
