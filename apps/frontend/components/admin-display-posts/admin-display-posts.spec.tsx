import { render } from '@testing-library/react';

import AdminDisplayPosts from './admin-display-posts';

describe('AdminDisplayPosts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdminDisplayPosts />);
    expect(baseElement).toBeTruthy();
  });
});
