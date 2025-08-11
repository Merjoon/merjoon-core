import crypto from 'node:crypto';
import {
  ConvertibleValueType,
  IMerjoonEntity,
  IMerjoonTransformConfig,
  IMerjoonTransformer,
} from './types';
import { HTML_CHAR_ENTITIES, SUBSCRIPT_CHARS, SUPERSCRIPT_CHARS } from './consts';

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

  static toTimestamp(values: ConvertibleValueType[]) {
    const value = values[0];
    if (typeof value === 'object' && value !== null) {
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

  static parseValue<T2>(data: T2, path: string): ConvertibleValueType | undefined {
    let value: ConvertibleValueType | Record<string, ConvertibleValueType> | T2 | null | undefined =
      data;

    const keys = path.split(this.separator);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (value === null || typeof value !== 'object') {
        value = undefined;
        break;
      }

      let newVal: ConvertibleValueType | undefined;
      const currentObject = value as Record<string, ConvertibleValueType> | ConvertibleValueType[];

      if (Array.isArray(currentObject)) {
        const index = Number(key);
        if (!isNaN(index) && index >= 0 && index < currentObject.length) {
          newVal = currentObject[index];
        } else {
          newVal = undefined;
        }
      } else {
        if (i === keys.length - 1) {
          const { type, keys: parsedKeys } = this.parseTypedKey(key);
          const values = this.getValuesFromObject(
            parsedKeys,
            currentObject as Record<string, ConvertibleValueType>,
          );
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
            case 'HTML_TO_STRING':
              newVal = this.htmlToString(values);
              break;
            default:
              newVal = (currentObject as Record<string, ConvertibleValueType>)?.[key];
              break;
          }
        } else {
          newVal = (currentObject as Record<string, ConvertibleValueType>)?.[key];
        }
      }

      value = newVal;

      if (value === undefined) {
        break;
      }
    }
    return value as ConvertibleValueType | undefined;
  }

  static hasArrayPathKey(path: string) {
    return path.split(this.separator).find((key) => /^\[.+]$/.exec(key));
  }

  static withTimestamps<T extends IMerjoonEntity>(
    parsedObjects: T[],
  ): (T & {
    created_at: number;
    modified_at: number;
  })[] {
    return parsedObjects.map((item) => ({
      ...item,
      created_at: Date.now(),
      modified_at: Date.now(),
    }));
  }

  constructor(protected readonly config: IMerjoonTransformConfig) {}

  protected transformItem<T1>(
    item: T1,
    config: Record<string, string>,
    parsedObject: Partial<IMerjoonEntity> | Partial<IMerjoonEntity>[] = {},
  ): IMerjoonEntity | IMerjoonEntity[] {
    const parsedObjectIsArray = Array.isArray(parsedObject);

    // Create a properly typed mutable reference
    let mutableParsedObject: Partial<IMerjoonEntity> | Partial<IMerjoonEntity>[];
    if (parsedObjectIsArray) {
      mutableParsedObject = [...parsedObject] as Partial<IMerjoonEntity>[];
    } else {
      mutableParsedObject = {
        ...parsedObject,
      } as Partial<IMerjoonEntity>;
    }
    configLoop: for (const [k, v] of Object.entries(config)) {
      const keys = k.split(MerjoonTransformer.separator);
      let currentLevel: Partial<IMerjoonEntity> | ConvertibleValueType = mutableParsedObject;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const arrayMatched = /^\[(.+)]$/.exec(key);

        if (!arrayMatched) {
          if (i !== keys.length - 1) {
            if (!(currentLevel as Record<string, ConvertibleValueType>)[key]) {
              (currentLevel as Record<string, ConvertibleValueType>)[key] = {};
            }
          } else {
            const parsed = MerjoonTransformer.parseValue(item, v);
            if (parsed !== undefined) {
              (currentLevel as Record<string, ConvertibleValueType>)[key] = parsed;
            }
          }
          currentLevel = (currentLevel as Record<string, ConvertibleValueType>)[key];
        } else {
          const arrKey = arrayMatched[1];
          (currentLevel as Record<string, ConvertibleValueType>)[arrKey] = [];
          const includesValueArray = MerjoonTransformer.hasArrayPathKey(v);

          if (!includesValueArray) {
            const newKey = [0, ...keys.slice(i + 1)].join(MerjoonTransformer.separator);
            (currentLevel as Record<string, ConvertibleValueType>)[arrKey] = this.transformItem(
              item,
              {
                [newKey]: v,
              },
              [],
            );
          } else {
            const valueKey = v.substring(0, v.indexOf(']') + 1);
            const arrayKey = valueKey
              .split(MerjoonTransformer.separator)
              .map((oneKey) => {
                const matched = /^\[(.+)]$/.exec(oneKey);
                return matched ? MerjoonTransformer.parseTypedKey(matched[1]).keys : oneKey;
              })
              .join(MerjoonTransformer.separator);
            const arrayValues = MerjoonTransformer.parseValue(item, arrayKey) ?? [];
            if (!Array.isArray(arrayValues)) {
              continue configLoop;
            }
            const { type } = MerjoonTransformer.parseTypedKey(v);
            (currentLevel as Record<string, ConvertibleValueType>)[arrKey] = arrayValues.map(
              (val) => {
                switch (type) {
                  case 'UUID':
                    if (typeof val === 'object') {
                      return MerjoonTransformer.toUuid([val.id]);
                    } else {
                      return MerjoonTransformer.toUuid([val]);
                    }
                  case 'STRING':
                    return MerjoonTransformer.toString([val]);
                  case 'HTML_TO_STRING':
                    return MerjoonTransformer.htmlToString([val]);
                  case 'TIMESTAMP':
                    return MerjoonTransformer.toTimestamp([val]);
                  default:
                    return val;
                }
              },
            );
          }
        }
      }
    }

    if (parsedObjectIsArray) {
      return (mutableParsedObject as Partial<IMerjoonEntity>[]).filter(
        (item) => Object.keys(item).length > 0,
      ) as IMerjoonEntity[];
    }
    return mutableParsedObject as IMerjoonEntity;
  }

  private toRecordString<T extends object>(obj: T): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        result[key] = String(value);
      }
    }

    return result;
  }

  public transform<TInput, D extends object, TOutput extends IMerjoonEntity>(
    data: TInput[],
    config: D,
  ): TOutput[] {
    const parsedObjects: IMerjoonEntity[] = [];
    data.forEach((item) => {
      const parsedObject = this.transformItem<TInput>(item, this.toRecordString(config));
      if (!Array.isArray(parsedObject)) {
        parsedObjects.push(parsedObject);
      }
    });

    return MerjoonTransformer.withTimestamps(parsedObjects) as TOutput[];
  }
}
