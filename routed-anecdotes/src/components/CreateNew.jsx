import { useNavigate } from 'react-router'
import { useField } from '../hooks'

const CreateNew = ({ addAnecdote }) => {
  const [content, resetContent] = useField('text')
  const [author, resetAuthor] = useField('text')
  const [info, resetInfo] = useField('url')
  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate("/")
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input
            name="content"
            {...content}
          />
        </div>
        <div>
          author
          <input
            name="author"
            {...author}
          />
        </div>
        <div>
          url for more info
          <input
            name="info"
            {...info}
          />
        </div>
        <button type="submit">create</button>
        <button type="reset">reset</button>
      </form>
    </div>
  )
}

export default CreateNew
