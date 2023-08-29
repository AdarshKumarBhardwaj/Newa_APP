import React,{useContext, useEffect} from 'react'
import noteContext from '../context/notes/noteContext'

export default function About() {
  const a= useContext(noteContext)
  //this is used to use function in context
//  useEffect(()=>{
//   a.update();

//  },[])
  return (
    <div>
      This is About  and studies in p
    </div>
  )
}
