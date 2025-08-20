import crypto from 'node:crypto';
import {
  ConvertibleValueType,
  IMerjoonTransformConfig,
  IMerjoonTransformer,
  ToTimestampInputParams,
} from './types';
import { SUPERSCRIPT_CHARS, SUBSCRIPT_CHARS, HTML_CHAR_ENTITIES } from './consts';

export class MerjoonTransformer implements IMerjoonTransformer {
  static separator = '->';

  static getValuesFromObject(
    keys: string[],
    obj: Record<string, ConvertibleValueType> | null,
  ): ConvertibleValueType[] {
    return keys.map((key) => {
      if (key.startsWith('$$')) {
        return key.substring(2);
      }
      return obj?.[key];
    });
  }

  static toJoinedString(values: ConvertibleValueType[]): string {
    const separator = String(values.pop() ?? '');
    const filteredValues = values.filter(
      (item) => item !== null && item !== undefined && item !== '',
    );
    return filteredValues.join(separator);
  }

  static parseTypedKey(key: string) {
    const typeRegex =
      /((UUID|STRING|TIMESTAMP|JOIN_STRINGS|HTML_TO_STRING)\()?"([a-zA-Z0-9-_.\->[\]\s$]+)"[),]?/g;
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

  static replaceWithSuperscript(text: string) {
    return text.replace(/\^(.*)\^/g, (_, match) =>
      match.replace(/./g, (char: string) => MerjoonTransformer.getSuperscriptChar(char)),
    );
  }

  static replaceWithSubscript(text: string) {
    return text.replace(/<sub>(.*)<\/sub>/g, (_, match) =>
      match.replace(/./g, (char: string) => MerjoonTransformer.getSubscriptChar(char)),
    );
  }

  static getSuperscriptChar(char: string) {
    return SUPERSCRIPT_CHARS[char] || char;
  }

  static getSubscriptChar(char: string) {
    return SUBSCRIPT_CHARS[char] || char;
  }

  static markListItems(text: string) {
    return text.replace(/<li>/g, '• ');
  }

  static decodeHtml(text: string) {
    text = text.replace(/&[a-z]+;/gi, (match) => HTML_CHAR_ENTITIES[match] || match);
    text = text.replace(/&#(\d+);/g, (match, num) => String.fromCharCode(Number.parseInt(num)));
    return text;
  }

  static replaceImageTag(text: string) {
    const imageTagRegex = /<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/g;
    return text.replace(imageTagRegex, (match, img) => `image:${img || 'img-description'}`);
  }

  static replaceHrTag(text: string) {
    return text.replace(/<hr\s*\/?>/g, '\n__________\n');
  }

  static removeTags(text: string) {
    return text.replace(/<[^>]*>/g, '');
  }

  static toUuid(values: ConvertibleValueType[]) {
    const value = values[0];
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(String(value)).digest('hex');
  }

  static addUserMentions(text: string): string {
    const regex =
      /<a href="https:\/\/[\w.-]+\.atlassian\.net\/secure\/ViewProfile\.jspa\?accountId=[\w%:-]+".*?>(.*?)<\/a>/g;
    return text.replace(regex, '@$1');
  }

  static htmlToString(values: ConvertibleValueType[]) {
    const value = values[0];
    if (!value) {
      return;
    }
    if (typeof value === 'string') {
      let res = MerjoonTransformer.addUserMentions(value);
      res = MerjoonTransformer.replaceImageTag(res);
      res = MerjoonTransformer.replaceWithSuperscript(res);
      res = MerjoonTransformer.replaceWithSubscript(res);
      res = MerjoonTransformer.markListItems(res);
      res = MerjoonTransformer.replaceHrTag(res);
      res = MerjoonTransformer.removeTags(res);
      res = MerjoonTransformer.decodeHtml(res);
      return res;
    }
  }

  static toString(values: ConvertibleValueType[]) {
    const value = values[0];
    if (!value) {
      return;
    }
    return value.toString();
  }

  static toTimestamp(values: ToTimestampInputParams) {
    const [value, timestampUnit] = values;

    if (typeof value === 'object' && value !== null) {
      throw new Error(`Cannot parse timestamp from ${typeof value}`);
    }
    if (!value) {
      return;
    }

    let timestamp;
    switch (timestampUnit) {
      case 'iso':
        timestamp = Date.parse(String(value));
        break;
      case 'ms':
        timestamp = Number(value);
        break;
      case 's':
        timestamp = Number(value) * 1000;
        break;
      default:
        throw new Error('Timestamp unit is missing or invalid');
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
        const { type, keys: parsedKeys } = this.parseTypedKey(key);
        const values = this.getValuesFromObject(parsedKeys, value);
        switch (type) {
          case 'UUID':
            newVal = this.toUuid(values);
            break;
          case 'STRING':
            newVal = this.toString(values);
            break;
          case 'TIMESTAMP':
            newVal = this.toTimestamp(values as ToTimestampInputParams);
            break;
          case 'JOIN_STRINGS':
            newVal = this.toJoinedString(values);
            break;
          case 'HTML_TO_STRING':
            newVal = this.htmlToString(values);
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
