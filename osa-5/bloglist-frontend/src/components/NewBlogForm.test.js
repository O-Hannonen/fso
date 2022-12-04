import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  const newBlog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
  };
  const mockCreateBlog = jest.fn();
  const user = {};
  beforeEach(() => {
    render(<NewBlogForm user={user} createBlog={mockCreateBlog} />).container;
  });

  test('onBlogCreated is called with correct parameters when submitted', async () => {
    const user = userEvent.setup();
    const title = screen.getByPlaceholderText('title');
    const author = screen.getByPlaceholderText('author');
    const url = screen.getByPlaceholderText('url');

    await user.type(title, newBlog.title);
    await user.type(author, newBlog.author);
    await user.type(url, newBlog.url);

    const sendButton = screen.getByText('create');
    await user.click(sendButton);

    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      author: newBlog.author,
      title: newBlog.title,
      url: newBlog.url,
    });
  });
});
