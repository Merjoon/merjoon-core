import { MerjoonTransformer } from '../MerjoonTransformer';

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

    expect(field).toEqual(['0cc175b9c0f1b6a831c399e269772661', '92eb5ffee6ae2fec3ad71c777531578f']);
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

    expect(field).toEqual(['4a8a08f09d37b73795649038408b5f33', '8277e0910d750195b448797616e091ad']);
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
