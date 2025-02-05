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

  describe('htmlToString', () => {
    it('Should return plain text given heading tag', () => {
      const data = '<h1><a name="Heading1"></a>Heading1</h1>\n\n';

      const expectedValue = 'Heading1\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given bold tag', () => {
      const data = '<p><b>Register(Bold)</b></p>\n\n';

      const expectedValue = 'Register(Bold)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given italic tag', () => {
      const data = '<p><em>Create 2 projects- not needed (Italic)</em></p>\n\n';

      const expectedValue = 'Create 2 projects- not needed (Italic)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given underline tag', () => {
      const data = '<p><ins>Create 1 more user (underline)</ins></p>\n\n';

      const expectedValue = 'Create 1 more user (underline)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given strikethrough tag', () => {
      const data = '<p><del>Create 5 statuses/columns (strikethrough)</del></p>\n\n';

      const expectedValue = 'Create 5 statuses/columns (strikethrough)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given monospace tag', () => {
      const data = '<p><tt>Create and distribute 10 tasks randomly among the columns(code)</tt></p>\n\n';

      const expectedValue = 'Create and distribute 10 tasks randomly among the columns(code)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given subscript tag', () => {
      const data = '<p>Assign <sub>Assign randomly or leave Unassigned(subscript)</sub></p>\n\n';

      const expectedValue = 'Assign Assign randomly or leave Unassigned(subscript)\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given superscript tag', () => {
      const data = '<p>Provide^Provide credentials(superscript)^</p>\n\n';

      const expectedValue = 'Provide^Provide credentials(superscript)^\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given font tag', () => {
      const data = '<p><font color="#ff5630">Color</font></p>\n\n';

      const expectedValue = 'Color\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given unordered list tag', () => {
      const data = '<ul>\n\t<li>ul1</li>\n\t<li>ul2</li>\n</ul>\n\n\n\n\n';

      const expectedValue = '\n\tul1\n\tul2\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given ordered list tag', () => {
      const data = '<ol>\n\t<li>ol</li>\n\t<li>ol</li>\n</ol>\n\n\n\n\n';

      const expectedValue = '\n\tol\n\tol\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given  link tag', () => {
      const data = '<p><a href="https://merjoontest1.atlassian.net/browse/PROJ1-8" class="external-link" rel="nofollow noreferrer">link</a></p>\n\n';

      const expectedValue = 'link\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should skip images', () => {
      const data = '<p><span class="image-wrap" style="\
        "><img src="/rest/api/3/attachment/content/10001" alt=\
        "img" height="500" width="1316" style="border: 0px solid black\
        " /></span></p>';

      const expectedValue = '';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given emoji', () => {
      const data = '<p>:smiling_face_with_3_hearts: :smiling_face_with_3_hearts: </p>\n\n';

      const expectedValue = ':smiling_face_with_3_hearts: :smiling_face_with_3_hearts: \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given tables', () => {
      const data = "<div class='table-wrap'>\n<table class='confluenceTable'><tbody>\n<tr>\n" +
        "<th class='confluenceTh'><b>column1</b></th>\n" +
        "<th class='confluenceTh'><b>column2</b></th>\n</tr>\n<tr>\n" +
        "<td class='confluenceTd'>text</td>\n" +
        "<td class='confluenceTd'>text</td>\n</tr>\n" +
        '</tbody></table>\n</div>\n\n\n';

      const expectedValue = '\ncolumn1\ncolumn2\ntext\ntext\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given code snippet', () => {
      const data = '<div class="preformatted panel" style="border-width: 1px;">' +
        '<div class="preformattedContent panelContent">' +
        '<pre>Code snippet</pre>\n</div></div>\n\n';

      const expectedValue = 'Code snippet\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given info panel', () => {
      const data = '<div class="panel" style="background-color: #deebff;border-width: 1px;">' +
        '<div class="panelContent" style="background-color: #deebff;">' +
        '<p>info panel</p>\n</div></div>\n\n';

      const expectedValue = 'info panel\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given blockquote', () => {
      const data = '<blockquote><p>Quote</p></blockquote>\n\n';

      const expectedValue = 'Quote\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given decision item', () => {
      const data = '<ul>\n\t<li>&lt;&gt; decision</li>\n</ul>\n\n\n';

      const expectedValue = '\n\t&lt;&gt; decision\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given expand section', () => {
      const data = '<p><b>Expand</b></p>\n\n<p>Expand1</p>\n\n';

      const expectedValue = 'Expand\nExpand1\n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given date', () => {
      const data = '<p><tt>2025-01-07</tt> </p>\n\n';

      const expectedValue = '2025-01-07 \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = '<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n\n';

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });

    it('Should return plain text given status', () => {
      const data = '<p> <font color="#00B8D9"><b>[ IN PROGRESS ]</b></font> </p>\n\n';

      const expectedValue = ' [ IN PROGRESS ] \n';

      const result = MerjoonTransformer.htmlToString(data);
      expect(result).toEqual(expectedValue);
    });
  });
});
