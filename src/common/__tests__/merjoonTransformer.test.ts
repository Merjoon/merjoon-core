import { MerjoonTransformer } from '../MerjoonTransformer';

describe('Merjoon Transformer | parseTypedValue', () => {
  it('Should return string case', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('STRING("content")');

    expect(type).toBe('STRING');
    expect(key).toBe('content');
  });

  it('Should return uuid case', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('UUID("remote_id")');

    expect(type).toBe('UUID');
    expect(key).toBe('remote_id');
  });

  it('Should return uuid case', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('[assignees]->UUID("id")');

    expect(type).toBe('UUID');
    expect(key).toBe('id');
  });

  it('Should return null as type and given argument as key if there is no value type', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('remote_id');

    expect(type).toBeNull();
    expect(key).toBe('remote_id');
  });

  it('Should return null as type and given argument as key if input contains only separator', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('board->status');

    expect(type).toBeNull();
    expect(key).toBe('board->status');
  });

  it('Should return null as type and given argument as key if UUID is lowercase', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('uuid("content")');

    expect(type).toBeNull();
    expect(key).toBe('uuid("content")');
  });

  it('Should return null as type and given argument as key if STRING is lowercase', () => {
    const { type, key} = MerjoonTransformer.parseTypedKey('string("content")');

    expect(type).toBeNull();
    expect(key).toBe('string("content")');
  });
});
