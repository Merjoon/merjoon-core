import { ITrelloBoard, ITrelloMember } from '../types';
import { TrelloService } from '../service';

describe('Trello static', () => {
  describe('getUniqueMembers', () => {
    it('should remove duplicate members', () => {
      const membersWithDuplicates: ITrelloMember[] = [
        {
          id: '6632ae5d9f5e38362435b5b5',
          fullName: 'Merjoon Test2',
        },
        {
          id: '6632ad49b47364d0b42df3d2',
          fullName: 'Merjoon test1',
        },
        {
          id: '6632ae5d9f5e38362435b5b5',
          fullName: 'Merjoon Test2',
        },
      ];

      const members = TrelloService.getUniqueMembers(membersWithDuplicates);
      expect(members).toEqual([
        {
          id: '6632ae5d9f5e38362435b5b5',
          fullName: 'Merjoon Test2',
        },
        {
          id: '6632ad49b47364d0b42df3d2',
          fullName: 'Merjoon test1',
        },
      ]);
    });

    it('should return the same if there are no duplicate members', () => {
      const membersWithDuplicates: ITrelloMember[] = [
        {
          id: '6632ae5d9f5e38362435b5b5',
          fullName: 'Merjoon Test2',
        },
        {
          id: '6632ad49b47364d0b42df3d2',
          fullName: 'Merjoon test1',
        },
      ];

      const members = TrelloService.getUniqueMembers(membersWithDuplicates);
      expect(members).toEqual([
        {
          id: '6632ae5d9f5e38362435b5b5',
          fullName: 'Merjoon Test2',
        },
        {
          id: '6632ad49b47364d0b42df3d2',
          fullName: 'Merjoon test1',
        },
      ]);
    });
  });

  describe('mapBoardIdsAndLists', () => {
    it('should return lists and boardIds', () => {
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
      const { boardIds, lists } = TrelloService.mapBoardIdsAndLists(boards);
      expect(lists).toEqual({
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
      const { boardIds, lists } = TrelloService.mapBoardIdsAndLists(boards);
      expect(boardIds).toEqual(['6632ae6450578aab54b4a3d5', '6632ad51fdd83c602abca2ba']);
      expect(lists).toEqual({});
    });
  });
});
