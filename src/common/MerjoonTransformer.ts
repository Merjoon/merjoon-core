import { IMerjoonTransformConfig, IMerjoonTransformer } from './types';
import crypto from 'node:crypto';

export class MerjoonTransformer implements IMerjoonTransformer {
  static separator = '->';
  static parseTypedKey(key: string) {
    const regex = /(UUID|STRING|TIMESTAMP|HTML_TO_STRING)\("([a-zA-Z0-9-_.\->[\]]+)"\)/;
    const match = regex.exec(key);

    return {
      type: match?.[1],
      key: match ? match[2] : key,
    };
  }

  static toHash(value: string) {
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(String(value)).digest('hex');
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static parseValue(data: any, path: string) {
    let value = data;
    const keys = path.split(this.separator);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let newVal = value?.[key];
      if (i === keys.length - 1) {
        const { type, key: parsedKey } = this.parseTypedKey(key);
        key = parsedKey;
        switch (type) {
          case 'UUID':
            newVal = this.toHash(value?.[key]);
            break;
          case 'STRING':
            newVal = value?.[key].toString();
            break;
          case 'TIMESTAMP': {
            const timestamp = value?.[key];
            if (typeof timestamp === 'number') {
              newVal = timestamp;
            } else if (typeof timestamp === 'string') {
              const date = Number(timestamp);
              if (!isNaN(date)) {
                newVal = date;
              } else {
                newVal = Date.parse(timestamp);
              }
            } else {
              throw new Error(`Cannot parse timestamp from ${typeof timestamp}`);
            }
            if (isNaN(newVal)) {
              throw new Error('Timestamp value is NaN');
            }
            break;
          }
          case 'HTML_TO_STRING':
            newVal = value[key]?.replace(/<[^>]*>/g, '');
            break;
        }
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
            const arrayKey = valueKey.split(MerjoonTransformer.separator).map((oneKey) => {
              const matched = /^\[(.+)]$/.exec(oneKey);
              if (matched) {
                return matched[1];
              }
              return oneKey;
            }).join(MerjoonTransformer.separator);
            const arrayValues = MerjoonTransformer.parseValue(item, arrayKey) || [];
            for (let j = 0; j < arrayValues.length; j++) {
              // eslint-disable-next-line  @typescript-eslint/no-explicit-any
              const newKey = [j].concat(keys.slice(i + 1) as any).join(MerjoonTransformer.separator);
              const newValue = v.split(MerjoonTransformer.separator).map((val) => {
                const matched = /^\[(.+)]$/.exec(val);
                if (matched) {
                  return [matched[1], j].join(MerjoonTransformer.separator);
                }
                return val;
              }).join(MerjoonTransformer.separator);
              const config = {
                [newKey]: newValue
              };
              p[arrayMatched[1]] = this.transformItem(item, config, p[arrayMatched[1]]);
            }
          }
          continue configLoop;
        }
      }
    }
    if (parsedObjectIsArray) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      parsedObject = parsedObject.filter((item: any) => Object.keys(item).length);
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
