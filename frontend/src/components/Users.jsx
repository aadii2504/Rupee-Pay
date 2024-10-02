import React, { useEffect, useState } from 'react'

const Users = () => {

    const [users , setUsers] = useState([]);
    const [filter , setFilter] = useState("");

    useEffect(() => {
        axios.get("" + filter )
        .then(response => {
            setUsers(response.data.user)
        })
    }, [filter])


  return ( 
    <>
    <div className='font-bold mt-6 text-lg'>
        Users
    </div> 
    <div>
        
    </div>
    </>
    
  )
}

export default Users