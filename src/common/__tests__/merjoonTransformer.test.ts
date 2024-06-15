import { MerjoonTransformer } from "../MerjoonTransformer";

describe("Merjoon Transformer | parseTypedValue", () => {
  it("Should return string case", () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('STRING("content")');

    expect(type).toBe("STRING")
    expect(key).toBe("content")
  })

  it("Should return uuid case", () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

    expect(type).toBe("UUID")
    expect(key).toBe("remote_id")
  })

  it('Should return empty strings if there is no value type', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('remote_id');

    expect(type).toBe("")
    expect(key).toBe("")
  });

  it('Should return empty strings if input contains only separator', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('board->status');

    expect(type).toBe("")
    expect(key).toBe("")
  });

  it('Should return empty string if UUID is lowercase', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('uuid("content")');

    expect(type).toBe("")
    expect(key).toBe("")
  });

  it('Should return empty string if STRING is lowercase', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('uuid("content")');

    expect(type).toBe("")
    expect(key).toBe("")
  });

  it('Should return empty string if type is not uuid or string', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('NUMBER("id")');

    expect(type).toBe("")
    expect(key).toBe("")
  });
})
