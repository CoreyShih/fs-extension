import { Card, CardActions, CardContent, Link, Button, Typography } from '@mui/material'

const Blog = ({ blog, user, onLike, onRemove }) => {
  // avoid errors when rendering before blogs have been fetched from backend
  if (!blog) {
    return null
  }

  // must be logged in to like blog
  const showLikeButton = { display: user ? '' : 'none' }
  // must be the user who added the blog to remove blog
  const showRemoveButton = { display: user && user.username === blog.user.username ? '' : 'none' }

  // return (
  //   <div>
  //     <h2>{`${blog.author}: ${blog.title}`}</h2>
  //     <a href={blog.url}>{blog.url}</a>
  //     <div>
  //       {`likes ${blog.likes} `}
  //       <button style={showLikeButton} onClick={onLike}>like</button>
  //     </div>
  //     <div>{`Added by ${blog.user.name}`}</div>
  //     <div style={showRemoveButton}>
  //       <button onClick={onRemove}>remove</button>
  //     </div>
  //   </div>
  // )

  return (
    <Card sx={{ minWidth: 400 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{blog.title}</Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{`by ${blog.author}`}</Typography>
        <Link href={blog.url}>{blog.url}</Link>
        <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1.5 }}>
          {`Added by ${blog.user.name}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography>{`${blog.likes} likes`}</Typography>
        <Button variant='outlined' size='small' onClick={onLike} style={showLikeButton}>like</Button>
        <Button variant='outlined' size='small' color='error' onClick={onRemove} style={showRemoveButton}>remove</Button>
      </CardActions>
    </Card>
  )
}

export default Blog