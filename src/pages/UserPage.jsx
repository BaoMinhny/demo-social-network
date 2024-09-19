import React, { useEffect, useState } from 'react'
import UserHeader from "../components/UserHeader"
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowtoast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postAtom';

const UserPage = () => {
    const {user, loading} = useGetUserProfile()
    const showToast = useShowToast();
    const {username}= useParams();
    const [posts, setPosts] =  useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
      const getPost = async () => {
        if (!user) return;
        setFetchingPosts(true);
        try {
          const res= await fetch(`api/posts/user/${username}`)
          const data = await res.json();
          console.log(data)
          setPosts(data);
        } catch (error) {
          showToast("Error", error.message, "error");
          setPosts([]);
        }finally {
          setFetchingPosts(false);
        }  
      }
      getPost();
    }, [username, showToast, setPosts, user])

    console.log("post in here in recoil value", posts)

    if (!user && loading) {
      return (
        
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      );
    } // if not user return empty page

    if (!user && !loading) return <h1>User not found</h1>;
    
  return (
    <>
      <UserHeader user={user}/>
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"}/>
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  )
}

export default UserPage
