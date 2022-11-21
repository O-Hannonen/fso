const {
  totalLikes,
  favoriteBlog,
  dummy,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

describe('dummy', () => {
  test('returns one', () => {
    expect(dummy([])).toBe(1);
  });
});

describe('total likes', () => {
  test('empty list returns 0', () => {
    expect(totalLikes([])).toBe(0);
  });
  test('list with a single item returns the items likes', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5);
  });
  test('list with multiple items returns sum of the likes', () => {
    expect(totalLikes(blogs)).toBe(43);
  });
});

describe('blog with likes', () => {
  test('empty list returns null', () => {
    expect(favoriteBlog([])).toBeNull();
  });
  test('list with a single item returns the item', () => {
    expect(favoriteBlog(listWithOneBlog)).toBe(listWithOneBlog[0]);
  });
  test('list with multiple items returns (one of) the one(s) with most likes', () => {
    const id = favoriteBlog(blogs)._id;

    expect(
      ['5a422aa71b54a676234d17f8', '5a422b3a1b54a676234d17f9'].includes(id)
    ).toBeTruthy();
  });
});

describe('author with most blogs', () => {
  //   test('empty list returns null', () => {
  //     expect(mostBlogs([])).toBeNull();
  //   });
  //   test('list with a single item returns the item', () => {
  //     const most = mostBlogs(listWithOneBlog);
  //     const only = listWithOneBlog[0];
  //     expect(most.author).toBe(only.author);
  //     expect(most.blogs).toBe(only.blogs);
  //   });
  test('list with multiple items returns (one of) the author(s) with most blogs', () => {
    const most = mostBlogs(blogs);

    expect(most.author).toBe('Robert C. Martin');
    expect(most.blogs).toBe(3);
  });
});

describe('author with most blogs', () => {
  test('empty list returns null', () => {
    expect(mostLikes([])).toBeNull();
  });
  test('list with a single item returns the item', () => {
    const most = mostLikes(listWithOneBlog);
    const only = listWithOneBlog[0];
    expect(most.author).toBe(only.author);
    expect(most.likes).toBe(only.likes);
  });
  test('list with multiple items returns (one of) the author(s) with most blogs', () => {
    const most = mostLikes(blogs);

    expect(most.author).toBe('Edsger W. Dijkstra');
    expect(most.likes).toBe(24);
  });
});
