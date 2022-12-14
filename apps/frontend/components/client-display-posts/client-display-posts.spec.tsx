import { render } from '@testing-library/react';

import ClientDisplayPosts from './client-display-posts';

describe('ClientDisplayPosts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientDisplayPosts />);
    expect(baseElement).toBeTruthy();
  });
});
