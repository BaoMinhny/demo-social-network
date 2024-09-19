import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowtoast';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, Spinner,Text } from '@chakra-ui/react';
import { useRecoilState, useRecoilStateLoadable } from 'recoil';
import Post from '../components/Post';
import postsAtom from '../atoms/postAtom';
import SuggestUsers from '../components/SuggestUsers';

const Homepage = () => {

  const [ posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast(); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed")
        const data = await res.json();
        console.log(data)
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error");
      }
      finally{
        setLoading(false)
      }
    }
    getFeedPost();
  }, [showToast, setPosts] )

  return ( 
    <Flex gap='10' alignItems={"flex-start"}>
        <Box flex={70} >
        {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
        {loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}
        {posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy}  />
				))}   
        </Box>       
             <Box flex={30} //border={"1px solid red"}
             display={{
					base: "none",
					md: "block",
				}}>
          <SuggestUsers/>
        </Box> 
    </Flex>
    
  )
} 

export default Homepage
