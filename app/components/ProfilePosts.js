import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Post from "./Post"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          signal: controller.signal
        })
        setPosts(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPosts()
    return () => {
      controller.abort()
    }
  }, [username])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map(post => {
        ;<Post noAuthor={true} post={post} id={post._id} />
      })}
    </div>
  )
}

export default ProfilePosts
