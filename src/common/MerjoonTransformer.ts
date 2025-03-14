import crypto from 'node:crypto';
import { ConvertibleValueType, IMerjoonTransformConfig, IMerjoonTransformer } from './types';

export class MerjoonTransformer implements IMerjoonTransformer {
  static separator = '->';

  static getValuesFromObject(keys: string[], obj: Record<string, string> | null): string[] {
    return keys.map((key) => {
      if (obj && key in obj) {
        return obj[key];
      } else if (key?.startsWith('$$')) {
        return key.slice(2);
      } else {
        return '';
      }
    });
  }

  static toJoinedString(values: string[]) {
    if (values.length < 2) {
      return values[0];
    }
    const separator = values.pop();

    return values.filter((item) => item !== '').join(separator);
  }

  static parseTypedKey(key: string) {
    const typeRegex = /((UUID|STRING|TIMESTAMP|JOIN_STRINGS)\()?"([a-zA-Z0-9-_.\->[\]\s$]+)"[),]?/g;
    const keys: string[] = [];
    let match;
    let type: string | undefined;

    while ((match = typeRegex.exec(key)) !== null) {
      if (!type) {
        type = match[2];
      }
      keys.push(match[3]);
    }

    return {
      type: type,
      keys: type ? keys : [key],
    };
  }

  static toUuid(values: ConvertibleValueType[]) {
    if (!values[0]) {
      return;
    }
    const value = values[0];
    return crypto.createHash('md5').update(String(value))?.digest('hex');
  }

  static toString(values: ConvertibleValueType[]) {
    if (!values) {
      return;
    }
    return values[0]?.toString();
  }

  static toTimestamp(values: ConvertibleValueType[]) {
    if (values === null) {
      throw new Error('Cannot parse timestamp from null');
    }
    const value = values[0];
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
    let value = data;
    const keys = path.split(this.separator);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let newVal = value?.[key];
      if (i === keys.length - 1) {
        const { type, keys: parsedKey } = this.parseTypedKey(key);
        const values = this.getValuesFromObject(parsedKey, value);
        switch (type) {
          case 'UUID':
            newVal = this.toUuid(values);
            break;
          case 'STRING':
            newVal = this.toString(values);
            break;
          case 'TIMESTAMP':
            newVal = this.toTimestamp(values);
            break;
          case 'JOIN_STRINGS':
            newVal = this.toJoinedString(values);
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

  constructor(protected readonly config: IMerjoonTransformConfig) {}
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
              [newKey]: v,
            };
            p[arrKey] = this.transformItem(item, config, p[arrKey]);
          } else {
            const valueKey = v.substring(0, v.indexOf(']') + 1);
            const arrayKey = valueKey
              .split(MerjoonTransformer.separator)
              .map((oneKey) => {
                const matched = /^\[(.+)]$/.exec(oneKey);
                if (matched) {
                  return MerjoonTransformer.parseTypedKey(matched[1]).keys;
                }
                return oneKey;
              })
              .join(MerjoonTransformer.separator);
            const arrayValues = MerjoonTransformer.parseValue(item, arrayKey) || [];
            for (let j = 0; j < arrayValues.length; j++) {
              const newKey = [j]
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                .concat(keys.slice(i + 1) as any)
                .join(MerjoonTransformer.separator);
              const newValue = v
                .split(MerjoonTransformer.separator)
                .map((val) => {
                  const matched = /^\[(.+)]$/.exec(val);
                  if (matched) {
                    const { type, keys } = MerjoonTransformer.parseTypedKey(matched[1]);
                    return [keys, type ? `${type}("${j}")` : j].join(MerjoonTransformer.separator);
                  }
                  return val;
                })
                .join(MerjoonTransformer.separator);
              const config = {
                [newKey]: newValue,
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
