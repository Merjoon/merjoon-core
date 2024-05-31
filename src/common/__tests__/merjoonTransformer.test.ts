import { MerjoonTransformer } from "../MerjoonTransformer";

describe("Merjoon Transformer | parseTypedValue", () => {
  it("Should return string case", () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('STRING("content")');

    expect(matchedCase).toBe("STRING")
    expect(matchedValue).toBe("content")
  })

  it("Should return uuid case", () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('UUID("remote_id")');

    expect(matchedCase).toBe("UUID")
    expect(matchedValue).toBe("remote_id")
  })

  it('Should return empty strings if there is no value type', () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('remote_id');

    expect(matchedCase).toBe("")
    expect(matchedValue).toBe("")
  });

  it('Should return empty strings if input contains only separator', () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('board->status');

    expect(matchedCase).toBe("")
    expect(matchedValue).toBe("")
  });

  it('Should return empty string if UUID is lowercase', () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('uuid("content")');

    expect(matchedCase).toBe("")
    expect(matchedValue).toBe("")
  });

  it('Should return empty string if STRING is lowercase', () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('uuid("content")');

    expect(matchedCase).toBe("")
    expect(matchedValue).toBe("")
  });

  it('Should return empty string if type is not uuid or string', () => {
    const { matchedCase, matchedValue} = MerjoonTransformer.parseTypedValue('NUMBER("id")');

    expect(matchedCase).toBe("")
    expect(matchedValue).toBe("")
  });
})