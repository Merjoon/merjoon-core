import { IMerjoonTransformConfig, IMerjoonTransformer } from './types';
import crypto from 'node:crypto';

export class MerjoonTransformer implements IMerjoonTransformer {
  static separator = '->';
  static parseTypedKey(key: string) {
    const regex = /(UUID|STRING)\("([a-z0-9-_.\->\[\]]+)"\)/;
    const match = key.match(regex);

    return {
      type: match && match[1],
      key: match ? match[2] : key,
    };
  }

  static toHash(value: string) {
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(String(value)).digest('hex');
  }

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
    return path.split(this.separator).find((key) => key.match(/^\[.+]$/));
  }

  constructor(protected readonly config: IMerjoonTransformConfig) {}

  protected transformItem(
    item: any,
    config: { [k: string]: string },
    parsedObject: any = {}
  ) {
    console.log({ item, config, parsedObject });
    const parsedObjectIsArray = Array.isArray(parsedObject);
    configLoop: for (let [k, v] of Object.entries(config)) {
      const keys = k.split(MerjoonTransformer.separator);
      let p = parsedObject;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const arrayMatched = key.match(/^\[(.+)]$/);
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
            const newKey = [0]
              .concat(keys.slice(i + 1) as any)
              .join(MerjoonTransformer.separator);
            const config = {
              [newKey]: v,
            };
            p[arrKey] = this.transformItem(item, config, p[arrKey]);
          } else {
            const valueKey = v.substring(0, v.indexOf(']') + 1);
            const arrayKey = valueKey
              .split(MerjoonTransformer.separator)
              .map((oneKey) => {
                const matched = oneKey.match(/^\[(.+)]$/);
                if (matched) {
                  return matched[1];
                }
                return oneKey;
              })
              .join(MerjoonTransformer.separator);
            const arrayValues =
              MerjoonTransformer.parseValue(item, arrayKey) || [];
            for (let j = 0; j < arrayValues.length; j++) {
              const newKey = [j]
                .concat(keys.slice(i + 1) as any)
                .join(MerjoonTransformer.separator);
              const newValue = v
                .split(MerjoonTransformer.separator)
                .map((val) => {
                  const matched = val.match(/^\[(.+)]$/);
                  if (matched) {
                    return [matched[1], j].join(MerjoonTransformer.separator);
                  }
                  return val;
                })
                .join(MerjoonTransformer.separator);
              const config = {
                [newKey]: newValue,
              };
              p[arrayMatched[1]] = this.transformItem(
                item,
                config,
                p[arrayMatched[1]]
              );
            }
          }
          continue configLoop;
        }
      }
    }
    if (parsedObjectIsArray) {
      parsedObject = parsedObject.filter(
        (item: any) => Object.keys(item).length
      );
    }
    return parsedObject;
  }

  public transform(data: any[], config: { [k: string]: any }): any[] {
    const parsedObjects: any[] = [];
    data.forEach((item) => {
      const parsedObject: any = this.transformItem(item, config);
      parsedObjects.push(parsedObject);
    });
    return parsedObjects;
  }
}
