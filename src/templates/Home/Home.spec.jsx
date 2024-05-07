import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { fireEvent, queryByRole, queryByText, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '.';
import userEvent from '@testing-library/user-event';

const handlers = [
  rest.get('*jsonplaceholder.typicode.com*', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'title1',
          body: 'body1',
          url: 'img1.jpg',
        },
        {
          userId: 2,
          id: 2,
          title: 'title2',
          body: 'body2',
          url: 'img1.jpg',
        },
        {
          userId: 3,
          id: 3,
          title: 'title3',
          body: 'body3',
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];

const server = setupServer(...handlers);

describe('<Home />', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
  });

  it('should render search, posts and load more', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    expect.assertions(3)

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/type your search/i)
    const images = screen.getAllByRole('img', {name: /title/i})
    const button = screen.getByRole('button', {name: /load more/i})

    expect(search).toBeInTheDocument()
    expect(images).toHaveLength(2)
    expect(button).toBeInTheDocument()


  });

  it('should search for posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    expect.assertions(11)

    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText(/type your search/i)

    expect(screen.getByRole('heading', {name: /title1/i})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: /title2/i})).toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: /title3/i})).not.toBeInTheDocument()

    userEvent.type(search, 'title3 3')

    expect(screen.queryByRole('heading', {name: /title1/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: /title2/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: /title3/i})).toBeInTheDocument()

    expect(screen.queryByRole('heading', {name: /Search value: title3 3/i})).toBeInTheDocument()

    userEvent.clear(search)

    expect(screen.queryByRole('heading', {name: /title1/i})).toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: /title2/i})).toBeInTheDocument()
    expect(screen.queryByRole('heading', {name: /title3/i})).not.toBeInTheDocument()


    userEvent.type(search, 'value')

    expect(screen.queryByText(/Não existem posts/i)).toBeInTheDocument()

  });

  it('should render more posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    expect.assertions(3)

    await waitForElementToBeRemoved(noMorePosts);

    const button = screen.queryByRole('button', {name: /Load more posts/i})

    expect(button).toBeInTheDocument()

    userEvent.click(button)

    const posts = screen.queryAllByRole('heading', {name: /title/i})

    expect(posts).toHaveLength(3)
    expect(button).toBeDisabled()
  });
});
