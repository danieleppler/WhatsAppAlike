import React from 'react'
import ContactModal from './ChoseUsersModal'
import EditGroupTitleModal from './EditGroupTitleModal'

const ManageGroupModal = (props) => {
  return (
    <div class="modal fade"
    id="ManageGroupModal"
    tabIndex="-1"
    role="dialogasd"
    aria-hidden="true" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ContactsModalLabel">
                Manage group
              </h5>
            </div>
            <div class="modal-body">
            <ContactModal handleContactClicked ={props.AddContactCallBack} UserContacts = {props.UserContacts}/>
            <button className="btn btn-primary" onClick={props.DeleteGroupCallBack}>Delete group</button>
            <button  className="btn btn-primary"
          data-toggle="modal"
          data-target="#ContactsModal">Add contacts to group</button>
          <button className="btn btn-primary"
           data-toggle="modal"
          data-target="#EditGroupTitleModal"
          >Edit Group Title</button>
          <EditGroupTitleModal EditGroupTitleCallBack ={props.EditGroupTitleCallBack} title = {props.GroupInfo?.GroupTitle} />
          <button className='btn btn-primary' data-toggle="modal" data-target="#RemoveUsersFromGroupModal">Remove Users From Group</button>
          <ManageGroupModal GroupUsers = {props.GroupInfo.Users} />
            </div>
    
            </div>
            </div>
    </div>
  )
}

export default ManageGroupModal
