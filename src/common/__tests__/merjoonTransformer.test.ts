import { MerjoonTransformer } from '../MerjoonTransformer';

describe('MerjoonTransformer', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseTypedKey', () => {
    describe('STRING', () => {
      it('Should return string case', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('STRING("content")');

        expect(type).toBe('STRING');
        expect(key).toBe('content');
      });
    });

    describe('UUID', () => {
      it('Should return uuid case given a key', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toBe('UUID');
        expect(key).toBe('remote_id');
      });

      it('Should return uuid case given an array of objects', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('[assignees]->UUID("id")');

        expect(type).toBe('UUID');
        expect(key).toBe('id');
      });
    });

    describe('TIMESTAMP', () => {
      it('Should return timestamp case', () => {
        const {type, key} = MerjoonTransformer.parseTypedKey('TIMESTAMP("created-on")');

        expect(type).toBe('TIMESTAMP');
        expect(key).toBe('created-on');
      });
    });

    describe("type 'undefined'", () => {
      it('Should return undefined as type and given argument as key if there is no value type', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(key).toBe('remote_id');
      });

      it('Should return undefined as type and given argument as key if input contains only separator', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('board->status');

        expect(type).toBeUndefined();
        expect(key).toBe('board->status');
      });

      it('Should return undefined as type and given argument as key if UUID is lowercase', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('uuid("content")');

        expect(type).toBeUndefined();
        expect(key).toBe('uuid("content")');
      });

      it('Should return undefined as type and given argument as key if STRING is lowercase', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('string("content")');

        expect(type).toBeUndefined();
        expect(key).toBe('string("content")');
      });
    });

    describe('matches', () => {
      it('match is not null', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toBe('UUID');
        expect(key).toBe('remote_id');
      });
    });

    describe('does not match', () => {
      it('match is null', () => {
        const { type, key} = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(key).toBe('remote_id');
      });
    });
  });

  describe('parseValue', () => {
    describe('UUID', () => {
      describe('UUID succeeded', () => {
        it('should assign hashed value to newVal given string', () => {
          const data = {
            accountId: '712020:950855f3-65cc-4b69-b797-0f2f60973fd1',
          };
          const path = 'UUID("accountId")';
          const value = MerjoonTransformer.parseValue(data, path);
  
          expect(value).toBe('58e957f4607f014a3bf04664a7f0eb6f');
        });
  
        it('should assign hashed value to newVal given number', () => {
          const data = {
            accountId: 10019,
          };
          const path = 'UUID("accountId")';
          const value = MerjoonTransformer.parseValue(data, path);
  
          expect(value).toBe('73c730319cf839f143bf40954448ce39');
        });

        it('Should return undefined given null', () => {
          const data = {
            accountId: null
          };
          const path = 'UUID("accountId")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBeUndefined();
        });

        it('Should return undefined given undefined', () => {
          const data = {
            accountId: undefined
          };
          const path = 'UUID("accountId")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBeUndefined();
        });
      });
      
      describe('UUID failed', () => {
        it('Should throw error given object', () => {
          const data = {
            accountId: {}
          };
          const path = 'UUID("accountId")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot create uuid from object');
        });
      });
    });

    describe('STRING', () => {
      describe('STRING succeeded', () => {
        it('should return string if parsing value is number', () => {
          const data = {
            id: 123712020,
          };
          const path = 'STRING("id")';
          const value = MerjoonTransformer.parseValue(data, path);
  
          expect(value).toBe('123712020');
        });
  
        it('should return string if parsing value is string', () => {
          const data = {
            id: '1c4e0c5ae58279011090ab54ee347ecc',
          };
          const path = 'STRING("id")';
          const value = MerjoonTransformer.parseValue(data, path);
  
          expect(value).toBe('1c4e0c5ae58279011090ab54ee347ecc');
        });
      });
      
      describe('STRING failed', () => {
        it('Should throw error given null', () => {
          const data = {
            id: null
          };
          const path = 'STRING("id")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse string from object');
        });

        it('Should throw error given undefined', () => {
          const data = {
            id: undefined
          };
          const path = 'STRING("id")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse string from undefined');
        });

        it('Should throw error given object', () => {
          const data = {
            id: {}
          };
          const path = 'STRING("id")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse string from object');
        });
      });
    });

    describe('TIMESTAMP', () => {
      describe('TIMESTAMP succeeded', () => {
        it('Should return a number given a number timestamp', () => {
          const data = {
            'created-on': 1728608492080
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1728608492080);
        });

        it('Should return a number given a string representing a number', () => {
          const data = {
            'created-on': '1711309341022'
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1711309341022);
        });

        it('Should return a number given a valid string in ISO format', () => {
          const data = {
            'created-on': '2024-05-08T18:07:33.852Z'
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1715191653852);
        });
      });

      describe('TIMESTAMP failed', () => {
        it('Should throw error given an invalid string', () => {
          const data = {
            'created-on': 'hello'
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Timestamp value is NaN');
        });

        it('Should throw error given null', () => {
          const data = {
            'created-on': null
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse timestamp from object');
        });

        it('Should throw error given undefined', () => {
          const data = {
            'created-on': undefined
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse timestamp from undefined');
        });

        it('Should throw error given object', () => {
          const data = {
            'created-on': {}
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse timestamp from object');
        });
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
    describe('toUuid succeeded', () => {
      it('should return hashed value given string', () => {
        const value = '712020:950855f3-65cc-4b69-b797-0f2f60973fd1';
        const hashedValue = MerjoonTransformer.toUuid(value);
  
        expect(hashedValue).toBe('58e957f4607f014a3bf04664a7f0eb6f');
      });
  
      it('should return hashed value given number', () => {
        const value = 10019;
        const hashedValue = MerjoonTransformer.toUuid(value);
  
        expect(hashedValue).toBe('73c730319cf839f143bf40954448ce39');
      });
  
      it('should return undefined given falsy value', () => {
        const value = '';
        const hashedValue = MerjoonTransformer.toUuid(value);

        expect(hashedValue).toBeUndefined();
      });

      it('Should return undefined given null', () => {
        const value = null;
        const hashedValue = MerjoonTransformer.toUuid(value);

        expect(hashedValue).toBeUndefined();
      });

      it('Should return undefined given undefined', () => {
        const value = undefined;
        const hashedValue = MerjoonTransformer.toUuid(value);

        expect(hashedValue).toBeUndefined();
      });
    });

    describe('toUuid failed', () => {
      it('Should throw error given object', () => {
        const value = {};

        expect(() => MerjoonTransformer.toUuid(value)).toThrow('Cannot create uuid from object');
      });
    });
  });

  describe('toString', () => {
    describe('toString succeeded', () => {
      it('should return string from string', () => {
        const value = 'hello';
        const strValue = MerjoonTransformer.toString(value);
  
        expect(strValue).toBe('hello');
      });
  
      it('should return string from number', () => {
        const value = 695840784;
        const strValue = MerjoonTransformer.toString(value);
  
        expect(strValue).toBe('695840784');
      });
    });

    describe('toString failed', () => {
      it('Should throw error given null', () => {
        const value = null;
  
        expect(() => MerjoonTransformer.toString(value)).toThrow('Cannot parse string from object');
      });
  
      it('Should throw error  given undefined', () => {
        const value = undefined;
  
        expect(() => MerjoonTransformer.toString(value)).toThrow('Cannot parse string from undefined');
      });
  
      it('Should throw error given object', () => {
        const value = {};
  
        expect(() => MerjoonTransformer.toString(value)).toThrow('Cannot parse string from object');
      });
    });
  });

  describe('toTimestamp', () => {
    describe('toTimestamp succeeded', () => {
      it('Should return a number given a number timestamp', () => {
        const value = 1728608492080;
        const timestampValue = MerjoonTransformer.toTimestamp(value);

        expect(timestampValue).toBe(1728608492080);
      });

      it('Should return a number given a string representing a number', () => {
        const value = '1711309341022';
        const timestampValue = MerjoonTransformer.toTimestamp(value);

        expect(timestampValue).toBe(1711309341022);
      });

      it('Should return a number given a valid string in ISO format', () => {
        const value = '2024-05-08T18:07:33.852Z';
        const timestampValue = MerjoonTransformer.toTimestamp(value);

        expect(timestampValue).toBe(1715191653852);
      });
    });

    describe('toTimestamp failed', () => {
      it('Should throw error given an invalid string', () => {
        const value = 'hello';

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Timestamp value is NaN');
      });

      it('Should throw error given null', () => {
        const value = null;

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Cannot parse timestamp from object');
      });

      it('Should throw error given undefined', () => {
        const value = undefined;

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Cannot parse timestamp from undefined');
      });

      it('Should throw error given object', () => {
        const value = {};

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Cannot parse timestamp from object');
      });
    });
  });

  describe('withTimestamp', () => {
    it('should return data items with timestamp', () => {
      const data = [{}];

      jest.spyOn(Date, 'now').mockImplementation(() => 1633024800000);

      const dataWithTimestamp = MerjoonTransformer.withTimestamps(data);
      const expectedDataWithTimestamp = [{
        created_at: 1633024800000,
        modified_at: 1633024800000,
      }];
      expect(dataWithTimestamp).toEqual(expectedDataWithTimestamp);
    });
  });

  describe('hasArrayPathKey', () => {
    it('should return array path key if it exists',  () => {
      const path = '[assignees]->UUID("id")';
      const pathKey = MerjoonTransformer.hasArrayPathKey(path);

      expect(pathKey).toEqual('[assignees]');
    });

    it('should return undefined if key is not array path key',  () => {
      const path = 'UUID("id")';
      const pathKey = MerjoonTransformer.hasArrayPathKey(path);

      expect(pathKey).toEqual(undefined);
    });
  });
});
