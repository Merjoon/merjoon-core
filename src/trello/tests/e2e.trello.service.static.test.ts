import { ITrelloBoard } from '../types';
import { TrelloService } from '../service';

describe('Trello static', () => {
  describe('mapToBoardIdsAndLists', () => {
    it('should return boardIds and lists', () => {
      const boards: ITrelloBoard[] = [
        {
          id: '6632ae6450578aab54b4a3d5',
          name: 'My_Board',
          desc: '',
          lists: [
            {
              id: '6632ae64b5dbba894d5dc019',
              name: 'To do',
            },
            {
              id: '6632ae64b84ce7a8519185e3',
              name: 'In Progress',
            },
          ],
        },
      ];
      const { boardIds, lists } = TrelloService.mapToBoardIdsAndLists(boards);
      expect(Object.fromEntries(lists)).toEqual({
        '6632ae64b5dbba894d5dc019': {
          id: '6632ae64b5dbba894d5dc019',
          name: 'To do',
        },
        '6632ae64b84ce7a8519185e3': {
          id: '6632ae64b84ce7a8519185e3',
          name: 'In Progress',
        },
      });
      expect(boardIds).toEqual(['6632ae6450578aab54b4a3d5']);
    });

    it('should return boardIds and {} if there are no lists in boards', () => {
      const boards: ITrelloBoard[] = [
        {
          id: '6632ae6450578aab54b4a3d5',
          name: 'My_Board',
          desc: '',
        },
        {
          id: '6632ad51fdd83c602abca2ba',
          name: 'My_Board1',
          desc: '',
        },
      ];
      const { boardIds, lists } = TrelloService.mapToBoardIdsAndLists(boards);
      expect(boardIds).toEqual(['6632ae6450578aab54b4a3d5', '6632ad51fdd83c602abca2ba']);
      expect(Object.fromEntries(lists)).toEqual({});
    });
  });
});
