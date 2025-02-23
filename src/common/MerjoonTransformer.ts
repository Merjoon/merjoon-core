import crypto from 'node:crypto';
import { IMerjoonTransformConfig, IMerjoonTransformer, ConvertibleValueType } from './types';

export class MerjoonTransformer implements IMerjoonTransformer {
  static separator = '->';
  static parseTypedKey(key: string) {
    const regex = /(UUID|STRING|TIMESTAMP)\("([a-zA-Z0-9-_.\->[\]]+)"\)/;
    const match = regex.exec(key);

    return {
      type: match?.[1],
      key: match ? match[2] : key,
    };
  }

  static toUuid(value: ConvertibleValueType) {
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(String(value)).digest('hex');
  }

  static toString(value: ConvertibleValueType) {
    if (!value) {
      return;
    }
    return value.toString();
  }

  static toTimestamp(value: ConvertibleValueType) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error(`Cannot parse timestamp from ${typeof value}`);
    }
    if (!value) {
      return;
    }
    let timestamp;
    if (typeof value === 'number') {
      timestamp = value;
    } else {
      const date = Number(value);
      if (!isNaN(date)) {
        timestamp = date;
      } else {
        timestamp = Date.parse(value);
      }
    }
    if (isNaN(timestamp)) {
      throw new Error('Timestamp value is NaN');
    }
    return timestamp;
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static parseValue(data: any, path: string) {
    // if (path === 'assignees') {
    //   console.log(('entered parsevalue'))
    // }
    let value = data;
    const keys = path.split(this.separator);
    // if (path === 'assignees') {
    //   console.log((`value = ${JSON.stringify(value)}, keys = ${keys}`))
    // }
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let newVal = value?.[key];
      if (i === keys.length - 1) {
        const { type, key: parsedKey } = this.parseTypedKey(key);
        key = parsedKey;
        const val = value?.[key];
        switch (type) {
          case 'UUID':
            newVal = this.toUuid(val);
            break;
          case 'STRING':
            newVal = this.toString(val);
            break;
          case 'TIMESTAMP':
            newVal = this.toTimestamp(val);
            break;
        }
      }
      if (path === 'assignees') {
        console.log((`newVal = ${JSON.stringify(newVal)}\n`))
      }

      value = newVal;

      if (newVal === undefined) {
        break;
      }
    }
    return value;
  }
  static hasArrayPathKey(path: string) {
    return path.split(this.separator).find((key) => /^\[.+]$/.exec(key));
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static withTimestamps(parsedObjects: any[]): any[] {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return parsedObjects.map((item: any) => {
      item.created_at = Date.now();
      item.modified_at = Date.now();
      return item;
    });
  }

  constructor(protected readonly config: IMerjoonTransformConfig) {
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected transformItem(item: any, config: Record<string, string>, parsedObject: any = {}) {
    const parsedObjectIsArray = Array.isArray(parsedObject);
    configLoop: for (const [k, v] of Object.entries(config)) {
      const keys = k.split(MerjoonTransformer.separator);
      let p = parsedObject;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const arrayMatched = /^\[(.+)]$/.exec(key);

        if (!arrayMatched) {
          if (i !== keys.length - 1) {
            if (!p[key]) {
              p[key] = {};
            }
          } else {
            const parsed = MerjoonTransformer.parseValue(item, v);
            if (parsed !== undefined) {
              p[key] = parsed;
            }
          }
          p = p[key];
        } else {
          const arrKey = arrayMatched[1];
          p[arrKey] = [];
          const includesValueArray = MerjoonTransformer.hasArrayPathKey(v);
          if (!includesValueArray) {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const newKey = [0].concat(keys.slice(i + 1) as any).join(MerjoonTransformer.separator);
            const config = {
              [newKey]: v
            };
            p[arrKey] = this.transformItem(item, config, p[arrKey]);
          } else {
            const valueKey = v.substring(0, v.indexOf(']') + 1);
            console.log(`\n\n\n\n\nvalueKey = ${valueKey}`)

            let arrayKey = valueKey.split(MerjoonTransformer.separator).map((oneKey) => {
              const matched = /^\[(.+)]$/.exec(oneKey);
              if (matched) {
                return matched[1];
              }
              return oneKey;
            }).join(MerjoonTransformer.separator);
            console.log(`arrayKey = ${arrayKey}`)

            const hasTypedKey = MerjoonTransformer.parseTypedKey(arrayKey);
            if (hasTypedKey.type) {
              console.log(`hasTypedKey = ${JSON.stringify(hasTypedKey)}`);
              arrayKey = hasTypedKey.key;
            }

            const arrayValues = MerjoonTransformer.parseValue(item, arrayKey) || [];
            console.log(`arrayValues = ${arrayValues}\n`)

            for (let j = 0; j < arrayValues.length; j++) {

              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              let newKey = [j].concat(keys.slice(i + 1) as any).join(MerjoonTransformer.separator);
              // if(hasTypedKey.type) {
              //   newKey = hasTypedKey.key;
              // }
              console.log(`newKey = ${newKey}`)

              const newValue = v.split(MerjoonTransformer.separator).map((val) => {
                
                const matched = /^\[(.+)]$/.exec(val);
                if(hasTypedKey.type) {
                  const res = `${hasTypedKey.key}->${hasTypedKey.type}(${j})`
                  console.log(res);
                  return res
                }
                if (matched) {
                  console.log(`matched return = ${[matched[1], j].join(MerjoonTransformer.separator)}`)
                  return [matched[1], j].join(MerjoonTransformer.separator);
                }
                
                return val;
              }).join(MerjoonTransformer.separator);
              console.log(`newValue = ${newValue}`)

              const config = {
                [newKey]: newValue
              };

              console.log(`config = ${JSON.stringify(config)}`)
              console.log(`p before = ${JSON.stringify(p)}`)
              console.log(`arrayMatched = ${arrayMatched}`)

              p[arrayMatched[1]] = this.transformItem(item, config, p[arrayMatched[1]]);
              console.log(`p after = ${JSON.stringify(p)}\n`)

            }
          }
          continue configLoop;
        }
      }
    }
    if (parsedObjectIsArray) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      parsedObject = parsedObject.filter((item: any) => Object.keys(item).length);
      // console.log(`parsedObject = ${parsedObject}`)

    }
    return parsedObject;
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public transform(data: any[], config: Record<string, any>): any[] {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const parsedObjects: any[] = [];
    data.forEach((item) => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const parsedObject: any = this.transformItem(item, config);
      parsedObjects.push(parsedObject);
    });
    return MerjoonTransformer.withTimestamps(parsedObjects);
  }
}
