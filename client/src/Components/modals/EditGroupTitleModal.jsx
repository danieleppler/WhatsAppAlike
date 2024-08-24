import React, { useState } from 'react'

const EditGroupTitleModal = (props) => {

    const [CurrentTitle,SetCurrentTitle] = useState(props.title)

  return (
    <div class="modal fade"
    id="EditGroupTitleModal"
    tabIndex="-1"
    role="dialogasd"
    aria-hidden="true" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
                </div>
                <div className='modal-body'>
                <input onChange = {(e)=>SetCurrentTitle(e.target.value)} placeholder={CurrentTitle}></input>
                <button onClick={()=>{props.EditGroupTitleCallBack(CurrentTitle)}}>Save</button>
                </div> 
                </div>
                </div>
                </div>
  )
}

export default EditGroupTitleModal
