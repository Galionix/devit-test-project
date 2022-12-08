import { parsedMockData } from '@devit-test-project/library';
import { render } from '@testing-library/react';

import { ArticlePreview } from './article';
// import {mockData} from ''

describe('Article', () => {
  it('should render successfully', () => {
	  const { baseElement } = render(<ArticlePreview {...parsedMockData[0]} />);
    expect(baseElement).toBeTruthy();
  });
});
