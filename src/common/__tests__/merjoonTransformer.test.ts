import { MerjoonTransformer } from '../MerjoonTransformer';

describe('MerjoonTransformer', () => {
  describe('parseTypedValue', () => {
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

    describe('HTML_TO_STRING', () => {
      it('Should return html to string case', () => {
        const {type, key} = MerjoonTransformer.parseTypedKey('HTML_TO_STRING("description")');

        expect(type).toBe('HTML_TO_STRING');
        expect(key).toBe('description');
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
  });

  describe('parseValue', () => {
    describe('TIMESTAMP', () => {
      describe('TIMESTAMP succeed', () => {
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

        it('Should throw error given boolean', () => {
          const data = {
            'created-on': true
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Cannot parse timestamp from boolean');
        });
      });
    });
    
    describe('HTML_TO_STRING', () => {
      it('should return string parsed from html', () => {
        const data = { description: '<ol>' +
              '<li>Register</li>\n' +
              '<li>Create 2 projects- not needed</li>\n' +
              '<li>Create 1 more user</li>\n' +
              '<li>Create 5 statuses/columns</li>\n' +
              '<li>Create and distribute 10 tasks randomly among the columns</li>\n' +
              '<li>Assign randomly or leave Unassigned</li>\n' +
              '<li>Provide credentials</li>' +
              '</ol>'};
        const path = 'HTML_TO_STRING("description")';

        const expectedValue = 'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials';

        const result = MerjoonTransformer.parseValue(data, path);
        expect(result).toEqual(expectedValue);
      });

      it('should return undefined if value is undefined or null', () => {
        const data = { description: null };
        const path = 'HTML_TO_STRING("description")';

        const result = MerjoonTransformer.parseValue(data, path);
        expect(result).toBe(undefined);
      });
    });
  });
});
