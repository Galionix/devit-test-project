import { stripUsername } from './library';

describe('library', () => {
  it('should work', () => {

	  expect(
		  stripUsername('/u/galionix')
		  )
		  .toEqual(
			  'galionix'
		  )
  });


});
