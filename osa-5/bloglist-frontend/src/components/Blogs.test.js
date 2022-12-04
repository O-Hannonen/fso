import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Blog } from './Blogs';

describe('<Blog />', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
  };
  const mockLikeHandler = jest.fn();
  beforeEach(() => {
    render(<Blog blog={blog} likeBlog={mockLikeHandler} />).container;
  });

  test('title and author are rendered when collapsed', async () => {
    screen.getByText(blog.title, { exact: false });
    screen.getByText(blog.author, { exact: false });
  });

  test('url and likes are rendered when expanded', async () => {
    const user = userEvent.setup();
    const url = screen.queryByText(blog.url);
    expect(url).toBeNull();
    const likes = screen.queryByText(blog.likes);
    expect(likes).toBeNull();
    const expandButton = screen.getByText('view', { exact: false });
    await user.click(expandButton);
    screen.getByText(blog.url, { exact: false });
    screen.getByText(blog.likes.toString(), { exact: false });
  });

  test('when like is pressed twice, like handler function is called twice', async () => {
    const user = userEvent.setup();

    const expandButton = screen.getByText('view', { exact: false });
    await user.click(expandButton);

    const likeButton = screen.getByText('like', { exact: false });
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});
