import crypto from 'node:crypto';
import he from 'he';
import { IMerjoonTransformConfig, IMerjoonTransformer, ConvertibleValueType } from './types';

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

  static replaceWithSuperscript(text: string) {
    return text.replace(/\^(.*?)\(superscript\)\^/g, (_, match) => {
      return match.split('').map((char: string) => MerjoonTransformer.getSuperscriptChar(char)).join('');
    });
  }

  static replaceWithSubscript(text: string) {
    return text.replace(/<sub>(.*?)\(subscript\)<\/sub>/g, (_, match) => {
      return match.split('').map((char: string) => MerjoonTransformer.getSubscriptChar(char)).join('');
    });
  }

  static getSuperscriptChar(char: string) {
    const superscriptMap: Record<string, string> = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
        'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
        'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
        'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
        'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
        'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ',
        'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ',
        'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ',
        'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ', 'U': 'ᵁ',
        'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ'
    };
    return superscriptMap[char] || char;
}

  static getSubscriptChar(char: string) {
    const subscriptMap: Record<string, string> = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
        'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
        'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
        'v': 'ᵥ', 'x': 'ₓ',
    };
    return subscriptMap[char] || char;
}

  static toUuid(value: ConvertibleValueType) {
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(String(value)).digest('hex');
  }

  static htmlToString(value: string) {
    if (!value) {
      return;
    }
    const imageTagRegex = /<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/g;

    let res = value.replace(imageTagRegex, (match, img) => `image:${img || 'img-description'}`);
    res = MerjoonTransformer.replaceWithSuperscript(res);
    res = MerjoonTransformer.replaceWithSubscript(res);
    res = res.replace(/<hr\s*\/?>/g, '__________');
    res = res.replace(/<[^>]*>/g, '');
    res = he.decode(res);
    return res;
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
    let value = data;
    const keys = path.split(this.separator);
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
          case 'HTML_TO_STRING':
            newVal = this.htmlToString(val);
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
                  return MerjoonTransformer.parseTypedKey(matched[1]).key;
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
                    const { type, key } = MerjoonTransformer.parseTypedKey(matched[1]);
                    return [key, type ? `${type}("${j}")` : j].join(MerjoonTransformer.separator);
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
