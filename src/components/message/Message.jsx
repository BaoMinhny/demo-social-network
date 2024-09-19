import React from 'react'

const Message = () => {
  return (
    <div className='chat chat-end'>
      <div className='chat-image avatar'>
        <div className='w-10 round-full'>

        </div>
      </div>
      <div className={`chat-bubble text-white bg-blue-500`}>hi what 's up</div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>2:38</div>

    </div>
  )
}

export default Message
