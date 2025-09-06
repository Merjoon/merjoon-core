import { getUniqueItems } from '../utils';

describe('getUniqueItems', () => {
  it('returns unique items with one comparingValue', () => {
    const allItems = [
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ];
    const items = getUniqueItems(allItems, ['id']);
    expect(items).toEqual([
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ]);
  });

  it('returns unique items more than one comparingValue', () => {
    const allItems = [
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 1,
        name: 'Merjoon11',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ];
    const items = getUniqueItems(allItems, ['id', 'name']);
    expect(items).toEqual([
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 1,
        name: 'Merjoon11',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ]);
  });

  it('returns the same if there are no duplicate items', () => {
    const allItems = [
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ];
    const items = getUniqueItems(allItems, ['id']);
    expect(items).toEqual([
      {
        id: 1,
        name: 'Merjoon1',
      },
      {
        id: 2,
        name: 'Merjoon2',
      },
    ]);
  });
});
