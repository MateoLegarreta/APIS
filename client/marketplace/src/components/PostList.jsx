import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'

function PostList() {
    const [posts, setPosts] = useState([])

    
    const URL = 'https://jsonplaceholder.typicode.com/' //localhost:8080

    useEffect(()=>{
        fetch(`${URL}/posts`)
        .then((response)=> response.json())
        .then((data)=>{
            setPosts(data)
        })
        .catch((error)=>{
            console.error('Error al cargar', error)
        })
    }, [])

  return (
    <div>
      <h1>Publicaciones</h1>
      {
        posts.map((post)=>(
            <PostCard 
            id={post.id}
            title={post.title}
            body={post.body}
            key={post.id}/>
        ))
      }
    </div>
  )
}

export default PostList
