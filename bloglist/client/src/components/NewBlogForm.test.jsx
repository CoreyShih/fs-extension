import { render, screen } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'

describe('<NewBlogForm />', () => {
  const user = {
    id: '5a43e6b6c37f3d065eaaa581',
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  }

  const blog = {
    id: '5a43fde2cbd20b12a2c34e91',
    title: 'The Joel Test: 12 Steps to Better Code',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
    likes: 0,
    user
  }

  const createBlog = vi.fn()

  beforeEach(() => {
    createBlog.mockClear()

    render(
      <NewBlogForm createBlog={createBlog} />
    )
  })

  test('event handler is called with correct arguments on submit', async () => {
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitButton = screen.getByText('create')

    const user = userEvent.setup()
    await user.type(titleInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
      title: blog.title,
      author: blog.author,
      url: blog.url
    })
  })
})