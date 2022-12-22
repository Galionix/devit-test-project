import { render } from '@testing-library/react';

import UpadtePostModal from './upadte-post-modal';

describe('UpadtePostModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UpadtePostModal />);
    expect(baseElement).toBeTruthy();
  });
});
