import { MerjoonTransformer } from '../MerjoonTransformer';

describe('MerjoonTransformer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parseTypedKey', () => {
    describe('STRING', () => {
      it('Should return string case', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('STRING("content")');

        expect(type).toBe('STRING');
        expect(key).toBe('content');
      });
    });

    describe('UUID', () => {
      it('Should return uuid case given a key', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toBe('UUID');
        expect(key).toBe('remote_id');
      });

      it('Should return uuid case given an array of objects', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('[assignees]->UUID("id")');

        expect(type).toBe('UUID');
        expect(key).toBe('id');
      });
    });

    describe('TIMESTAMP', () => {
      it('Should return timestamp case', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('TIMESTAMP("created-on")');

        expect(type).toBe('TIMESTAMP');
        expect(key).toBe('created-on');
      });
    });

    describe('HTML_TO_STRING', () => {
      it('Should return html to string case', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('HTML_TO_STRING("description")');

        expect(type).toBe('HTML_TO_STRING');
        expect(key).toBe('description');
      });
    });

    describe("type 'undefined'", () => {
      it('Should return undefined as type and given argument as key if there is no value type', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(key).toBe('remote_id');
      });

      it('Should return undefined as type and given argument as key if input contains only separator', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('board->status');

        expect(type).toBeUndefined();
        expect(key).toBe('board->status');
      });

      it('Should return undefined as type and given argument as key if UUID is lowercase', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('uuid("content")');

        expect(type).toBeUndefined();
        expect(key).toBe('uuid("content")');
      });

      it('Should return undefined as type and given argument as key if STRING is lowercase', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('string("content")');

        expect(type).toBeUndefined();
        expect(key).toBe('string("content")');
      });
    });

    describe('matches', () => {
      it('match is not null', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

        expect(type).toBe('UUID');
        expect(key).toBe('remote_id');
      });
    });

    describe('does not match', () => {
      it('match is null', () => {
        const { type, key } = MerjoonTransformer.parseTypedKey('remote_id');

        expect(type).toBeUndefined();
        expect(key).toBe('remote_id');
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

    describe('TIMESTAMP', () => {
      describe('TIMESTAMP succeeded', () => {
        it('Should return a number given a number timestamp', () => {
          const data = {
            'created-on': 1728608492080,
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1728608492080);
        });

        it('Should return a number given a string representing a number', () => {
          const data = {
            'created-on': '1711309341022',
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1711309341022);
        });

        it('Should return a number given a valid string in ISO format', () => {
          const data = {
            'created-on': '2024-05-08T18:07:33.852Z',
          };
          const path = 'TIMESTAMP("created-on")';
          const value = MerjoonTransformer.parseValue(data, path);

          expect(value).toBe(1715191653852);
        });
      });

      describe('TIMESTAMP failed', () => {
        it('Should throw error given an invalid string', () => {
          const data = {
            'created-on': 'hello',
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow('Timestamp value is NaN');
        });

        it('Should throw error given null', () => {
          const data = {
            'created-on': null,
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow(
            'Cannot parse timestamp from object',
          );
        });

        it('Should throw error given undefined', () => {
          const data = {
            'created-on': undefined,
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow(
            'Cannot parse timestamp from undefined',
          );
        });

        it('Should throw error given object', () => {
          const data = {
            'created-on': {},
          };
          const path = 'TIMESTAMP("created-on")';

          expect(() => MerjoonTransformer.parseValue(data, path)).toThrow(
            'Cannot parse timestamp from object',
          );
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

    it('Should return hashed value given object', () => {
      const value = {};
      const hashedValue = MerjoonTransformer.toUuid(value);

      expect(hashedValue).toBe('1441a7909c087dbbe7ce59881b9df8b9');
    });
  });

  describe('toString', () => {
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

    it('should return string from object', () => {
      const value = {};
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toBe('[object Object]');
    });

    it('should return undefined from null', () => {
      const value = null;
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toBeUndefined();
    });

    it('should return undefined from undefined', () => {
      const value = undefined;
      const strValue = MerjoonTransformer.toString(value);

      expect(strValue).toBeUndefined();
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

      it('Should return undefined given an empty string', () => {
        const value = '';
        const timestampValue = MerjoonTransformer.toTimestamp(value);

        expect(timestampValue).toBeUndefined();
      });
    });

    describe('toTimestamp failed', () => {
      it('Should throw error given an invalid string', () => {
        const value = 'hello';

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow('Timestamp value is NaN');
      });

      it('Should throw error given null', () => {
        const value = null;

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow(
          'Cannot parse timestamp from object',
        );
      });

      it('Should throw error given undefined', () => {
        const value = undefined;

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow(
          'Cannot parse timestamp from undefined',
        );
      });

      it('Should throw error given object', () => {
        const value = {};

        expect(() => MerjoonTransformer.toTimestamp(value)).toThrow(
          'Cannot parse timestamp from object',
        );
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
          'Register\nCreate 2 projects- not needed\nCreate 1 more user\nCreate 5 statuses/columns\nCreate and distribute 10 tasks randomly among the columns\nAssign randomly or leave Unassigned\nProvide credentials';

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

  describe('htmlToString', () => {
    it('Should return plain text given heading tag', () => {
      const data = '<h1><a name="Heading1"></a>Heading1</h1>';

      const expectedValue = 'Heading1';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given bold tag', () => {
      const data = '<p><b>Register(Bold)</b></p>';

      const expectedValue = 'Register(Bold)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given italic tag', () => {
      const data = '<p><em>Create 2 projects- not needed (Italic)</em></p>';

      const expectedValue = 'Create 2 projects- not needed (Italic)';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given underline tag', () => {
      const data = '<p><ins>Create 1 more user (underline)</ins></p>\n';

      const expectedValue = 'Create 1 more user (underline)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given strikethrough tag', () => {
      const data = '<p><del>Create 5 statuses/columns (strikethrough)</del></p>\n';

      const expectedValue = 'Create 5 statuses/columns (strikethrough)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given monospace tag', () => {
      const data =
        '<p><tt>Create and distribute 10 tasks randomly among the columns(code)</tt></p>\n';

      const expectedValue = 'Create and distribute 10 tasks randomly among the columns(code)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given subscript tag', () => {
      const data = '<p>Assign <sub>Assign randomly or leave Unassigned(subscript)</sub></p>\n';

      const expectedValue = 'Assign Assign randomly or leave Unassigned(subscript)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given superscript tag', () => {
      const data = '<p>Provide^Provide credentials(superscript)^</p>\n';

      const expectedValue = 'Provide^Provide credentials(superscript)^\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given font tag', () => {
      const data = '<p><font color="#ff5630">Color</font></p>\n';

      const expectedValue = 'Color\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given unordered list tag', () => {
      const data = '<ul>\n\t<li>ul1</li>\n\t<li>ul2</li>\n</ul>';

      const expectedValue = '\n\tul1\n\tul2\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given ordered list tag', () => {
      const data = '<ol>\n\t<li>ol</li>\n\t<li>ol</li>\n</ol>';

      const expectedValue = '\n\tol\n\tol\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given  link tag', () => {
      const data =
        '<p><a href="https://merjoontest1.atlassian.net/browse/PROJ1-8" class="external-link" rel="nofollow noreferrer">link</a></p>\n';

      const expectedValue = 'link\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should skip images', () => {
      const data =
        '<p><span class="image-wrap" style="\
        "><img src="/rest/api/3/attachment/content/10001" alt=\
        "img" height="500" width="1316" style="border: 0px solid black\
        " /></span></p>';

      const expectedValue = '';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given emoji', () => {
      const data = '<p>:smiling_face_with_3_hearts: :smiling_face_with_3_hearts: </p>\n';

      const expectedValue = ':smiling_face_with_3_hearts: :smiling_face_with_3_hearts: \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given tables', () => {
      const data =
        "<div class='table-wrap'>\n<table class='confluenceTable'><tbody>\n<tr>\n" +
        "<th class='confluenceTh'><b>column1</b></th>\n" +
        "<th class='confluenceTh'><b>column2</b></th>\n</tr>\n<tr>\n" +
        "<td class='confluenceTd'>text</td>\n" +
        "<td class='confluenceTd'>text</td>\n</tr>\n" +
        '</tbody></table>\n</div>\n\n\n';

      const expectedValue = '\n\n\ncolumn1\ncolumn2\n\n\ntext\ntext\n\n\n\n\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given code snippet', () => {
      const data =
        '<div class="preformatted panel" style="border-width: 1px;">' +
        '<div class="preformattedContent panelContent">' +
        '<pre>Code snippet</pre>\n</div></div>\n\n';

      const expectedValue = 'Code snippet\n\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given info panel', () => {
      const data =
        '<div class="panel" style="background-color: #deebff;border-width: 1px;">' +
        '<div class="panelContent" style="background-color: #deebff;">' +
        '<p>info panel</p>\n</div></div>';

      const expectedValue = 'info panel\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given blockquote', () => {
      const data = '<blockquote><p>Quote</p></blockquote>';

      const expectedValue = 'Quote';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given expand section', () => {
      const data = '<p><b>Expand</b></p>\n\n<p>Expand1</p>\n\n';

      const expectedValue = 'Expand\n\nExpand1\n\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given date', () => {
      const data = '<p><tt>2025-01-07</tt> </p>\n';

      const expectedValue = '2025-01-07 \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = '<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n';

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = '<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n';

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return line given hr tag', () => {
      const data =
        '<p>This is a paragraph before the horizontal rule.</p><hr><p>This is a paragraph after the horizontal rule.</p><hr/>';

      const expectedValue =
        'This is a paragraph before the horizontal rule.__________This is a paragraph after the horizontal rule.__________';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text with spaces', () => {
      const data = '<p><a>dsfsdfsd</a> </p>';

      const expectedValue = 'dsfsdfsd ';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return image descrition given image', () => {
      const data =
        '<img src="/rest/api/3/attachment/content/10001" alt="img" height="500" width="1316" />';

      const expectedValue = 'image:img';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should plain text with decoded html', () => {
      const data = '<li>&lt;&gt; decision</li>';

      const expectedValue = '<> decision';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });
  });
});
