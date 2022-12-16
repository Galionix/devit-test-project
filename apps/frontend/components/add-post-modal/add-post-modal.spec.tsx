import { render } from '@testing-library/react';

import AddPostModal from './add-post-modal';

describe('AddPostModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddPostModal />);
    expect(baseElement).toBeTruthy();
  });
});
