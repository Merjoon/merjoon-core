import { MerjoonTransformer } from "../MerjoonTransformer";

describe("Merjoon Transformer | parseTypedValue", () => {
  it("Should return string case", () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('STRING("content")');

    expect(type).toBe("STRING");
    expect(key).toBe("content");
  })

  it("Should return uuid case", () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

    expect(type).toBe("UUID");
    expect(key).toBe("remote_id");
  })

  it("Should return uuid case", () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('[assignees]->UUID("id")');

    expect(type).toBe("UUID");
    expect(key).toBe("id");
  })

  it("Should return timestamp case", () => {
    const {type, key} = MerjoonTransformer.parseTypedKey('TIMESTAMP("created-on")');

    expect(type).toBe("TIMESTAMP");
    expect(key).toBe("created-on");
  })

  it('Should return undefined as type and given argument as key if there is no value type', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('remote_id');

    expect(type).toBeUndefined();
    expect(key).toBe("remote_id");
  });

  it('Should return undefined as type and given argument as key if input contains only separator', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('board->status');

    expect(type).toBeUndefined();
    expect(key).toBe("board->status");
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

  it('Should return a number as value given a valid string in ISO format', () => {
    const data = {
      "created-on": "2024-05-08T18:07:33.852Z"
    };
    const path = 'TIMESTAMP("created-on")';
    const value = MerjoonTransformer.parseValue(data, path);

    expect(value).toBe(1715191653852);
  });

  it('Should return a number as value given a string representing a number', () => {
    const data = {
      "created-on": "1711309341022"
    };
    const path = 'TIMESTAMP("created-on")';
    const value = MerjoonTransformer.parseValue(data, path);

    expect(value).toBe(1711309341022);
  });

  it('Should return a number as value given a number timestamp', () => {
    const data = {
      "created-on": 1728608492080
    };
    const path = 'TIMESTAMP("created-on")';
    const value = MerjoonTransformer.parseValue(data, path);

    expect(value).toBe(1728608492080);
  });

  it('Should return NaN if given an invalid string', () => {
    const data = {
      "created-on": 'hello'
    };
    const path = 'TIMESTAMP("created-on")';
    const value = MerjoonTransformer.parseValue(data, path);

    expect(value).toBeNaN();
  });
})
