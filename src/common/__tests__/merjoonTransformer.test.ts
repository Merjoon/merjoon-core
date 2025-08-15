import { MerjoonTransformer } from '../MerjoonTransformer';
import { TimestampType } from '../types';

describe('MerjoonTransformer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseTypedKey', () => {
    describe('STRING', () => {
      it('Should return string case', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('STRING("content")');

        expect(type).toEqual('STRING');
        expect(keys).toEqual(['content']);
      });
    });

    describe('JOIN_STRINGS', () => {
      it('Should return join_string case', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey(
          'JOIN_STRINGS("firstName", "lastName", "-")',
        );

        expect(type).toEqual('JOIN_STRINGS');
        expect(keys).toEqual(['firstName', 'lastName', '-']);
      });

      it('Should return join_string case include separator', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey(
          'JOIN_STRINGS("firstName", "field -> id", "-")',
        );

        expect(type).toEqual('JOIN_STRINGS');
        expect(keys).toEqual(['firstName', 'field -> id', '-']);
      });

      it('Should return join_string case when have value starts with $$', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey(
          'JOIN_STRINGS("firstName", "$$lastName")',
        );

        expect(type).toEqual('JOIN_STRINGS');
        expect(keys).toEqual(['firstName', '$$lastName']);
      });

      it('Should return join_string case when have one value', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('JOIN_STRINGS("firstName")');

        expect(type).toEqual('JOIN_STRINGS');
        expect(keys).toEqual(['firstName']);
      });

      it('Should return join_string case when have one value and it starts with $$', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('JOIN_STRINGS("$$lastName")');

        expect(type).toEqual('JOIN_STRINGS');
        expect(keys).toEqual(['$$lastName']);
      });
    });

    describe('UUID', () => {
      it('Should return uuid case given a key', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toEqual('UUID');
        expect(keys).toEqual(['remote_id']);
      });

      it('Should return uuid case given an array of objects', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('[assignees]->UUID("id")');

        expect(type).toEqual('UUID');
        expect(keys).toEqual(['id']);
      });
    });

    describe('TIMESTAMP', () => {
      it('Should return timestamp case', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('TIMESTAMP("created-on")');

        expect(type).toEqual('TIMESTAMP');
        expect(keys).toEqual(['created-on']);
      });
    });

    describe('HTML_TO_STRING', () => {
      it('Should return html to string case', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('HTML_TO_STRING("description")');

        expect(type).toEqual('HTML_TO_STRING');
        expect(keys).toEqual(['description']);
      });
    });

    describe("type 'undefined'", () => {
      it('Should return undefined as type and given argument as key if there is no value type', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(keys).toEqual(['remote_id']);
      });

      it('Should return undefined as type and given argument as key if input contains only separator', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('board->status');

        expect(type).toBeUndefined();
        expect(keys).toEqual(['board->status']);
      });

      it('Should return undefined as type and given argument as key if UUID is lowercase', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('uuid("content")');

        expect(type).toBeUndefined();
        expect(keys).toEqual(['uuid("content")']);
      });

      it('Should return undefined as type and given argument as key if STRING is lowercase', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('string("content")');

        expect(type).toBeUndefined();
        expect(keys).toEqual(['string("content")']);
      });
    });

    describe('matches', () => {
      it('match is not null', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toEqual('UUID');
        expect(keys).toEqual(['remote_id']);
      });
    });

    describe('does not match', () => {
      it('match is null', () => {
        const { type, keys } = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(keys).toEqual(['remote_id']);
      });
    });
  });

  describe('parseValue', () => {
    describe('UUID', () => {
      it('should assign hashed value to newVal given string', () => {
        const data = {
          accountId: '712020:950855f3-65cc-4b69-b797-0f2f60973fd1',
        };
        const path = 'UUID("accountId")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('58e957f4607f014a3bf04664a7f0eb6f');
      });

      it('should assign hashed value to newVal given number', () => {
        const data = {
          accountId: 10019,
        };
        const path = 'UUID("accountId")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('73c730319cf839f143bf40954448ce39');
      });

      it('Should return undefined given null', () => {
        const data = {
          accountId: null,
        };
        const path = 'UUID("accountId")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toBeUndefined();
      });

      it('Should return undefined given undefined', () => {
        const data = {
          accountId: undefined,
        };
        const path = 'UUID("accountId")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toBeUndefined();
      });
    });

    describe('STRING', () => {
      it('should return string if parsing value is number', () => {
        const data = {
          id: 123712020,
        };
        const path = 'STRING("id")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('123712020');
      });

      it('should return string if parsing value is string', () => {
        const data = {
          id: '1c4e0c5ae58279011090ab54ee347ecc',
        };
        const path = 'STRING("id")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('1c4e0c5ae58279011090ab54ee347ecc');
      });
    });

    describe('TIMESTAMP', () => {
      describe('TIMESTAMP succeeded', () => {
        it('Should return milliseconds given a number in milliseconds', () => {
          const data = {
            'created-on': 1728608492080,
          };
          const path = 'TIMESTAMP("created-on","$$millisecond")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toEqual(1728608492080);
        });

        it('Should return milliseconds given a string in milliseconds', () => {
          const data = {
            'created-on': '1711309341022',
          };
          const path = 'TIMESTAMP("created-on", "$$millisecond")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toEqual(1711309341022);
        });

        it('Should return milliseconds given a number in seconds', () => {
          const data = {
            'created-on': 1728608492,
          };
          const path = 'TIMESTAMP("created-on","$$second")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toEqual(1728608492000);
        });

        it('Should return milliseconds given a string in seconds', () => {
          const data = {
            'created-on': '1711309341',
          };
          const path = 'TIMESTAMP("created-on", "$$second")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toEqual(1711309341000);
        });

        it('Should return a number given a valid string in ISO format', () => {
          const data = {
            'created-on': '2024-05-08T18:07:33.852Z',
          };
          const path = 'TIMESTAMP("created-on", "$$iso_string")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toEqual(1715191653852);
        });
      });

      describe('TIMESTAMP failed', () => {
        it('Should throw error given an invalid string', () => {
          const data = {
            'created-on': 'hello',
          };
          const path = 'TIMESTAMP("created-on", "$$iso_string")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Timestamp value is NaN');
        });

        it('Should return undefined when the value is null', () => {
          const data = {
            'created-on': null,
          };
          const path = 'TIMESTAMP("created-on","$$iso_string")';

          expect(MerjoonTransformer.parseValue(data, path)).toBeUndefined();
        });

        it('Should return undefined when the value is undefined', () => {
          const data = {
            'created-on': undefined,
          };
          const path = 'TIMESTAMP("created-on","$$iso_string")';
          expect(MerjoonTransformer.parseValue(data, path)).toBeUndefined();
        });

        it('Should return undefined given an empty string', () => {
          const data = {
            'created-on': '',
          };
          const path = 'TIMESTAMP("created-on", "$$iso_string")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBeUndefined();
        });

        it('Should throw error when the value is object', () => {
          const data = {
            'created-on': {},
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow(
            'Cannot parse timestamp from object',
          );
        });

        it('Should throw error when timestamp unit is missing', () => {
          const data = {
            'created-on': '1728608492080',
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow(
            'Timestamp unit is missing',
          );
        });

        it('Should throw error when timestamp unit has invalid value', () => {
          const data = {
            'created-on': '1728608492080',
          };
          const path = 'TIMESTAMP("created-on", "$$milli")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Invalid timestamp unit');
        });
      });
    });

    describe('JOIN_STRINGS', () => {
      it('should return valid value', () => {
        const data = {
          firstName: 'Test',
          lastName: 'Testyan',
          middleName: 'Testi',
        };
        const path = 'JOIN_STRINGS("firstName", "lastName", "$$ ", "middleName")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('TestTestiTestyanTesti ');
      });

      it('should return valid value test, last parameter starts with $$', () => {
        const data = {
          firstName: 'Test',
          lastName: 'Testyan',
          middleName: 'Testi',
        };
        const path = 'JOIN_STRINGS("firstName", "lastName", "middleName", "$$_")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('Test_Testyan_Testi');
      });

      it('should check when value is empty string, undefined or null', () => {
        const data = {
          firstName: 'Test',
          lastName: '',
          age: undefined,
          status: null,
        };
        const path = 'JOIN_STRINGS("firstName", "lastName", "middleName", "$$_")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('Test');
      });

      it('should return valid value test include key starts with $$', () => {
        const data = {
          firstName: 'Test',
          lastName: 'Testyan',
        };
        const path = 'JOIN_STRINGS("firstName", "$$lastName", "$$_")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('Test_lastName');
      });

      it('should return valid value test one parameter', () => {
        const data = {
          firstName: 'Test',
        };
        const path = 'JOIN_STRINGS("firstName")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('');
      });

      it('Should return join_string case when have one value', () => {
        const data = {
          firstName: 'Test',
        };
        const path = 'JOIN_STRINGS("$$firstName")';
        const value = MerjoonTransformer.parseValue(data, path);
        expect(value).toEqual('');
      });

      it('should return valid value test when data is empty object', () => {
        const data = {};
        const path = 'JOIN_STRINGS("firstName","lastName", "$$_")';
        const value = MerjoonTransformer.parseValue(data, path);

        expect(value).toEqual('');
      });
    });

    describe('new value is undefined', () => {
      it('should break loop and return undefined if new value is undefined', () => {
        const data = {
          accountId: '712020:950855f3-65cc-4b69-b797-0f2f60973fd1',
        };
        const path = 'id';
        const value = MerjoonTransformer.parseValue(data, path);
        expect(value).toBeUndefined();
      });
    });
  });

  describe('toUuid', () => {
    it('should return hashed value given string', () => {
      const value = ['712020:950855f3-65cc-4b69-b797-0f2f60973fd1'];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toEqual('58e957f4607f014a3bf04664a7f0eb6f');
    });

    it('should return hashed value given number', () => {
      const value = [10019];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toEqual('73c730319cf839f143bf40954448ce39');
    });

    it('should return undefined given falsy value', () => {
      const value = [''];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toBeUndefined();
    });

    it('Should return undefined given null', () => {
      const value = [null];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toBeUndefined();
    });

    it('Should return undefined given undefined', () => {
      const value = [undefined];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toBeUndefined();
    });

    it('Should return hashed value given object', () => {
      const value = [{}];
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toEqual('1441a7909c087dbbe7ce59881b9df8b9');
    });
  });

  describe('toJoinedString', () => {
    it('should return valid array from string', () => {
      const value = ['Test', 'Testyan', 'Testi', '-'];
      const joinedString = MerjoonTransformer.toJoinedString(value);
      expect(joinedString).toEqual('Test-Testyan-Testi');
    });

    it('should return valid array from string when have empty string in values', () => {
      const value = ['Test', '', 'Testyan', 'Testi', ' '];
      const joinedString = MerjoonTransformer.toJoinedString(value);
      expect(joinedString).toEqual('Test Testyan Testi');
    });

    it('should return valid array from string when have one value', () => {
      const value = ['Test'];
      const joinedString = MerjoonTransformer.toJoinedString(value);
      expect(joinedString).toEqual('');
    });
  });

  describe('toString', () => {
    it('should return string from string', () => {
      const value = ['hello'];
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toEqual('hello');
    });

    it('should return string from number', () => {
      const value = [695840784];
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toEqual('695840784');
    });

    it('should return string from object', () => {
      const value = [{}];
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toEqual('[object Object]');
    });

    it('should return undefined from null', () => {
      const value = [null];
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toBeUndefined();
    });

    it('should return undefined from undefined', () => {
      const value = [undefined];
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toBeUndefined();
    });
  });

  describe('toTimestamp', () => {
    describe('toTimestamp succeeded', () => {
      it('Should return milliseconds given a number in milliseconds', () => {
        const values: TimestampType = [1728608492080, 'millisecond'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toEqual(1728608492080);
      });

      it('Should return milliseconds given a number in seconds', () => {
        const values: TimestampType = [1728608492, 'second'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toEqual(1728608492000);
      });

      it('Should return milliseconds given a string in milliseconds', () => {
        const values: TimestampType = ['1711309341022', 'millisecond'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toEqual(1711309341022);
      });

      it('Should return milliseconds given a string in seconds', () => {
        const values: TimestampType = ['1711309341', 'second'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toEqual(1711309341000);
      });

      it('Should return a number given a valid string in ISO format', () => {
        const values: TimestampType = ['2024-05-08T18:07:33.852Z', 'iso_string'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toEqual(1715191653852);
      });
    });

    describe('toTimestamp failed', () => {
      it('Should throw error when value is NaN', () => {
        const values: TimestampType = ['hello', 'iso_string'];

        expect(() => MerjoonTransformer.toTimestamp(values)).toThrow('Timestamp value is NaN');
      });

      it('Should return undefined when value is null', () => {
        const values: TimestampType = [null, 'iso_string'];

        const result = MerjoonTransformer.toTimestamp(values);
        expect(result).toBeUndefined();
      });

      it('Should return undefined when value is undefined', () => {
        const value: TimestampType = [undefined, 'iso_string'];

        const result = MerjoonTransformer.toTimestamp(value);
        expect(result).toBeUndefined();
      });

      it('Should return undefined given an empty string', () => {
        const values: TimestampType = ['', 'iso_string'];
        const timestampValue = MerjoonTransformer.toTimestamp(values);

        expect(timestampValue).toBeUndefined();
      });

      it('Should throw error when the value is object', () => {
        const values: TimestampType = [{}, 'iso_string'];

        expect(() => MerjoonTransformer.toTimestamp(values)).toThrow(
          'Cannot parse timestamp from object',
        );
      });

      it('Should throw error when timestamp unit is missing', () => {
        const value = ['2024-05-08T18:07:33.852Z'] as never;
        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Timestamp unit is missing');
      });

      it('Should throw error when timestamp unit has invalid value', () => {
        const values = ['2024-05-08T18:07:33.852Z', 'ISO'] as never;
        expect(() => MerjoonTransformer.toTimestamp(values)).toThrow('Invalid timestamp unit');
      });
    });
  });

  describe('getValuesFromObject', () => {
    it('should return valid array', () => {
      const keys = ['firstName', 'lastName'];
      const object = {
        firstName: 'Test1',
        lastName: 'Test2',
      };
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual(['Test1', 'Test2']);
    });

    it('should return valid array when key not have', () => {
      const keys = ['firstName', 'middleName'];
      const object = {
        firstName: 'Test1',
        lastName: 'Test2',
      };
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual(['Test1', undefined]);
    });

    it('should return valid array when key starts with $$', () => {
      const keys = ['firstName', '$$777'];
      const object = {
        firstName: 'Test1',
        lastName: 'Test2',
      };
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual(['Test1', '777']);
    });

    it('should return valid array when not fint value at all', () => {
      const keys = ['middleName', '777'];
      const object = {
        firstName: 'Test1',
        lastName: 'Test2',
      };
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual([undefined, undefined]);
    });

    it('should return valid array when keys is empty array', () => {
      const keys: string[] = [];
      const object = {
        firstName: 'Test1',
        lastName: 'Test2',
      };
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual([]);
    });

    it('should return valid array when keys is empty array and object is empty object', () => {
      const keys: string[] = [];
      const object = {};
      const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
      expect(expectedArray).toEqual([]);
    });

    describe('getValuesFromObject falsy values', () => {
      it('should input is empty string', () => {
        const keys = ['field'];
        const object = {
          field: '',
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual(['']);
      });

      it('should input is null', () => {
        const keys = ['field'];
        const object = {
          field: null,
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([null]);
      });

      it('should input is NaN', () => {
        const keys = ['field'];
        const object = {
          field: NaN,
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([NaN]);
      });

      it('should input is undefined', () => {
        const keys = ['field'];
        const object = {
          field: undefined,
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([undefined]);
      });

      it('should input is zero', () => {
        const keys = ['field'];
        const object = {
          field: 0,
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([0]);
      });

      it('should input is empty object', () => {
        const keys = ['fields'];
        const object = {
          fields: {},
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([{}]);
      });

      it('should input is empty array', () => {
        const keys = ['fields'];
        const object = {
          fields: [],
        };
        const expectedArray = MerjoonTransformer.getValuesFromObject(keys, object);
        expect(expectedArray).toEqual([[]]);
      });
    });
  });

  describe('withTimestamp', () => {
    it('should return data items with timestamp', () => {
      const data = [
        {
          id: '0023a1e3447fdb31836536cc903f1310',
          name: 'Task4',
          status: 'In Review',
        },
      ];

      const dateNowSpy = jest.spyOn(Date, 'now');
      dateNowSpy.mockImplementation(() => 1633024800000);

      const dataWithTimestamp = MerjoonTransformer.withTimestamps(data);
      const expectedDataWithTimestamp = [
        {
          id: '0023a1e3447fdb31836536cc903f1310',
          name: 'Task4',
          status: 'In Review',
          created_at: 1633024800000,
          modified_at: 1633024800000,
        },
      ];
      expect(dataWithTimestamp).toEqual(expectedDataWithTimestamp);
    });
  });

  describe('hasArrayPathKey', () => {
    it('should return array path key if it exists', () => {
      const path = '[assignees]->UUID("id")';
      const pathKey = MerjoonTransformer.hasArrayPathKey(path);

      expect(pathKey).toEqual('[assignees]');
    });

    it('should return undefined if key is not array path key', () => {
      const path = 'UUID("id")';
      const pathKey = MerjoonTransformer.hasArrayPathKey(path);

      expect(pathKey).toEqual(undefined);
    });
  });

  describe('transform', () => {
    let transformer: MerjoonTransformer;
    beforeEach(() => {
      const config = {
        projects: {
          id: '',
          remote_id: '',
          name: '',
          description: '',
          remote_created_at: '',
          remote_modified_at: '',
        },
        users: {
          id: '',
          remote_id: '',
          name: '',
          email_address: '',
        },
        tasks: {
          id: '',
          remote_id: '',
          name: '',
          '[assignees]': '',
          status: '',
          description: '',
          '[projects]': '',
          remote_created_at: '',
          remote_modified_at: '',
        },
      };
      transformer = new MerjoonTransformer(config);
    });

    it('should return array of uuid strings', () => {
      const items = [
        {
          assignees: ['a', 'b'],
        },
      ];

      const config = {
        '[assignees]': '[UUID("assignees")]',
      };

      const result = transformer.transform(items, config);
      const field = result[0].assignees;

      expect(field).toEqual([
        '0cc175b9c0f1b6a831c399e269772661',
        '92eb5ffee6ae2fec3ad71c777531578f',
      ]);
    });

    it('should return array of strings', () => {
      const items = [
        {
          test: ['a', 'b'],
        },
      ];

      const config = {
        '[myField]': '[test]',
      };

      const result = transformer.transform(items, config);
      const field = result[0].myField;
      expect(field).toEqual(['a', 'b']);
    });

    it('should return array of uuid strings from nested', () => {
      const items = [
        {
          test: {
            nested: ['c', 'd'],
          },
        },
      ];

      const config = {
        '[myField]': 'test->[UUID("nested")]',
      };

      const result = transformer.transform(items, config);
      const field = result[0].myField;

      expect(field).toEqual([
        '4a8a08f09d37b73795649038408b5f33',
        '8277e0910d750195b448797616e091ad',
      ]);
    });

    it('should return array of strings from nested', () => {
      const items = [
        {
          test: {
            nested: ['c', 'd'],
          },
        },
      ];

      const config = {
        '[myField]': 'test->[nested]',
      };

      const result = transformer.transform(items, config);
      const field = result[0].myField;

      expect(field).toEqual(['c', 'd']);
    });

    describe('HTML_TO_STRING', () => {
      it('should return string parsed from html', () => {
        const data = {
          description:
            '<ol><li>Register</li>\n<li>Create 2 projects- not needed</li>\n<li>Create 1 more user</li>\n<li>Create 5 statuses/columns</li>\n<li>Create and distribute 10 tasks randomly among the columns</li>\n<li>Assign randomly or leave Unassigned</li>\n<li>Provide credentials</li></ol>',
        };
        const path = 'HTML_TO_STRING("description")';

        const expectedValue =
          '• Register\n• Create 2 projects- not needed\n• Create 1 more user\n• Create 5 statuses/columns\n• Create and distribute 10 tasks randomly among the columns\n• Assign randomly or leave Unassigned\n• Provide credentials';

        const result = MerjoonTransformer.parseValue(data, path);
        expect(result).toEqual(expectedValue);
      });

      it('should return undefined if value is undefined or null', () => {
        const data = {
          description: null,
        };
        const path = 'HTML_TO_STRING("description")';

        const result = MerjoonTransformer.parseValue(data, path);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('htmlToString', () => {
    it('Should return plain text given heading tag', () => {
      const data = ['<h1><a name="headingName"></a>Heading1</h1>'];

      const expectedValue = 'Heading1';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given bold tag', () => {
      const data = ['<p><b>Register(Bold)</b></p>'];

      const expectedValue = 'Register(Bold)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given italic tag', () => {
      const data = ['<p><em>Create 2 projects- not needed (Italic)</em></p>'];

      const expectedValue = 'Create 2 projects- not needed (Italic)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given underline tag', () => {
      const data = ['<p><ins>Create 1 more user (underline)</ins></p>\n'];

      const expectedValue = 'Create 1 more user (underline)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given strikethrough tag', () => {
      const data = ['<p><del>Create 5 statuses/columns (strikethrough)</del></p>\n'];

      const expectedValue = 'Create 5 statuses/columns (strikethrough)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given monospace tag', () => {
      const data = [
        '<p><tt>Create and distribute 10 tasks randomly among the columns(code)</tt></p>\n',
      ];

      const expectedValue = 'Create and distribute 10 tasks randomly among the columns(code)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given superscript tag', () => {
      const data = [
        '<p>Provide^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz(superscript)^</p>',
      ];

      const expectedValue =
        'Provide⁰¹²³⁴⁵⁶⁷⁸⁹ᴬᴮCᴰᴱFᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿSᵀᵁⱽᵂˣYZᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ(ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given subscript tag', () => {
      const data = [
        '<p>Assign <sub>0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz(subscript)</sub></p>',
      ];

      const expectedValue =
        'Assign ₀₁₂₃₄₅₆₇₈₉ABCDEFGHIJKLMNOPQRSTUVWXYZₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz(ₛᵤbₛcᵣᵢₚₜ)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given font tag', () => {
      const data = ['<p><font color="#ff5630">Color</font></p>\n'];

      const expectedValue = 'Color\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given unordered list tag', () => {
      const data = ['<ul>\n\t<li>ul1</li>\n\t<li>ul2</li>\n</ul>'];

      const expectedValue = '\n\t• ul1\n\t• ul2\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given ordered list tag', () => {
      const data = ['<ol>\n\t<li>ol</li>\n\t<li>ol</li>\n</ol>'];

      const expectedValue = '\n\t• ol\n\t• ol\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given  link tag', () => {
      const data = [
        '<p><a href="https://merjoontest1.atlassian.net/browse/PROJ1-8" class="external-link" rel="nofollow noreferrer">link</a></p>\n',
      ];

      const expectedValue = 'link\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should skip images', () => {
      const data = [
        '<p><span class="image-wrap" style="\
        "><img src="/rest/api/3/attachment/content/10001" alt=\
        "img" height="500" width="1316" style="border: 0px solid black\
        " /></span></p>',
      ];

      const expectedValue = '';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given emoji', () => {
      const data = ['<p>:smiling_face_with_3_hearts: :smiling_face_with_3_hearts: </p>\n'];

      const expectedValue = ':smiling_face_with_3_hearts: :smiling_face_with_3_hearts: \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given tables', () => {
      const data = [
        "<div class='table-wrap'>\n<table class='confluenceTable'><tbody>\n<tr>\n<th class='confluenceTh'><b>column1</b></th>\n<th class='confluenceTh'><b>column2</b></th>\n</tr>\n<tr>\n<td class='confluenceTd'>text</td>\n<td class='confluenceTd'>text</td>\n</tr>\n</tbody></table>\n</div>\n\n\n",
      ];

      const expectedValue = '\n\n\ncolumn1\ncolumn2\n\n\ntext\ntext\n\n\n\n\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given code snippet', () => {
      const data = [
        '<div class="preformatted panel" style="border-width: 1px;"><div class="preformattedContent panelContent"><pre>Code snippet</pre>\n</div></div>\n\n',
      ];

      const expectedValue = 'Code snippet\n\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given info panel', () => {
      const data = [
        '<div class="panel" style="background-color: #deebff;border-width: 1px;"><div class="panelContent" style="background-color: #deebff;"><p>info panel</p>\n</div></div>',
      ];

      const expectedValue = 'info panel\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given blockquote', () => {
      const data = ['<blockquote><p>Quote</p></blockquote>'];

      const expectedValue = 'Quote';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given expand section', () => {
      const data = ['<p><b>Expand</b></p>\n\n<p>Expand1</p>\n\n'];

      const expectedValue = 'Expand\n\nExpand1\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given date', () => {
      const data = ['<p><tt>2025-01-07</tt> </p>\n'];

      const expectedValue = '2025-01-07 \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = ['<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n'];

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = ['<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n'];

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return line given hr tag', () => {
      const data = [
        '<p>This is a paragraph before the horizontal rule.</p><hr><p>This is a paragraph after the horizontal rule.</p><hr/>',
      ];

      const expectedValue =
        'This is a paragraph before the horizontal rule.\n__________\nThis is a paragraph after the horizontal rule.\n__________\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text with spaces', () => {
      const data = ['<p><a>dsfsdfsd</a> </p>'];

      const expectedValue = 'dsfsdfsd ';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return image description given image', () => {
      const data = [
        '<img src="/rest/api/3/attachment/content/10001" alt="img" height="500" width="1316" />',
      ];

      const expectedValue = 'image:img';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should plain text with decoded html', () => {
      const data = [
        '<p>&lt;&#60;&gt;&#62;&Tab;&#9;&NewLine;&#10;&nbsp;&#32;&quot;&#34;&amp;&#38; &#97;&#98;&#99; &d; decision</p>',
      ];

      const expectedValue = '<<>>\t\t\n\n  ""&& abc &d; decision';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('should add @ before mention in a tag', () => {
      const text =
        'Hello <a href="https://merjoontest1.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A123" class="user-hover" rel="712020:123" data-account-id="712020:123" accountid="712020:123" rel="noreferrer">Merjoon Test</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual('Hello @Merjoon Test');
    });

    it('should handle no mention links (a tag)', () => {
      const text =
        '<a href="https://merjoontest1.atlassian.net/browse/PROJ1-8" class="external-link" rel="nofollow noreferrer">link</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual(
        '<a href="https://merjoontest1.atlassian.net/browse/PROJ1-8" class="external-link" rel="nofollow noreferrer">link</a>',
      );
    });

    it('should add @ if already present in name', () => {
      const text =
        'Hi <a href="https://merjoontest1.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A456" class="user-hover" rel="712020:456" data-account-id="712020:456" accountid="712020:456" rel="noreferrer">@Aram</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual('Hi @@Aram');
    });

    it('should return original text if no a tags match', () => {
      const result = MerjoonTransformer.addUserMentions('No user mention here.');
      expect(result).toEqual('No user mention here.');
    });

    it('should add @ for multiple valid user mentions in the same string with surrounding text', () => {
      const text =
        '<a href="https://merjoon1.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A1" class="user-hover" rel="712020:1" data-account-id="712020:1" accountid="712020:1" rel="noreferrer">Armen</a> is assigned to the task.\nMeanwhile, <a href="https://merjoon2.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A2" class="user-hover" rel="712020:2" data-account-id="712020:2" accountid="712020:2" rel="noreferrer">@Karen 12</a> will review it.\nFinal approval goes to <a href="https://merjoon3.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A3" class="user-hover" rel="712020:3" data-account-id="712020:3" accountid="712020:3" rel="noreferrer">Garik Avetisyan</a>.\nEnd.';

      const result = MerjoonTransformer.addUserMentions(text);

      expect(result).toEqual(
        '@Armen is assigned to the task.\nMeanwhile, @@Karen 12 will review it.\nFinal approval goes to @Garik Avetisyan.\nEnd.',
      );
    });

    it('should handle non latin letters', () => {
      const text =
        'Բարև <a href="https://merjoontest1.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A456" class="user-hover" rel="712020:456" data-account-id="712020:456" accountid="712020:456" rel="noreferrer">Արմեն</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual('Բարև @Արմեն');
    });

    it('should handle symbol "%" in accountId', () => {
      const text =
        'Привет <a href="https://merjoontest1.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A456%gdsdf5454" class="user-hover" rel="712020:456%gdsdf5454" data-account-id="712020:456%gdsdf5454" accountid="712020:456%gdsdf5454" rel="noreferrer">Александр</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual('Привет @Александр');
    });

    it('should handle all symbols in username', () => {
      const text =
        'Hello <a href="https://merjoontest.atlassian.net/secure/ViewProfile.jspa?accountId=712020%3A456%gdsdf5454" class="user-hover" rel="712020:456%gdsdf5454" data-account-id="712020:456%gdsdf5454" accountid="712020:456%gdsdf5454" rel="noreferrer">@Poghos.95*#%!. , ; : ? ! - – — \' \\" ( ) [ ] { } … + − × ÷ = ≠ &lt; &gt; ≤ ≥ ∑ ∏ √ ∞ ∫ ∂ = == === != !== &amp;&amp; || ! ++ &#8211; =&gt; :: ~ &amp; | ^ % \\\\ / $ € £ ¥ ֏ ₿ ∧ ∨ ¬ ∈ ∉ ⊂ ⊆ ∪ ∩ ∅ @ # * _ ~ ` ^ | \\ `</a>';
      const result = MerjoonTransformer.addUserMentions(text);
      expect(result).toEqual(
        'Hello @@Poghos.95*#%!. , ; : ? ! - – — \' \\" ( ) [ ] { } … + − × ÷ = ≠ &lt; &gt; ≤ ≥ ∑ ∏ √ ∞ ∫ ∂ = == === != !== &amp;&amp; || ! ++ &#8211; =&gt; :: ~ &amp; | ^ % \\\\ / $ € £ ¥ ֏ ₿ ∧ ∨ ¬ ∈ ∉ ⊂ ⊆ ∪ ∩ ∅ @ # * _ ~ ` ^ | \\ `',
      );
    });
  });
});
