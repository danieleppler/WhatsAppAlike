import React, { useEffect, useState } from 'react'
import ContactModal from './ChoseUsersModal'
import EditGroupTitleModal from './EditGroupTitleModal'
import ChoseUsersModal from './ChoseUsersModal'

const ManageGroupModal = (props) => {

  const [UsersMenuToRender, SetUsersMenuToRender] = useState('')
  const [GroupUserList, SetGroupUserList] = useState()

  const getUserList = async () => {
    let Res = []
    await props.GroupInfo.Users.forEach((element) => {
      let temp = props.UserContacts.map((x) => x.id)
      if (temp.includes(element)) {
        const user = props.UserContacts.find((x) => x.id === element)
        Res.push(user)
      }
    })
    return Res
  }

  useEffect(() => {
    const fetchData = async () => {
      const temp = await getUserList()
      SetGroupUserList(temp)
    }
    fetchData()
  }, [])

  const renderSwitch = () => {
    switch (UsersMenuToRender) {
      case 'Add':
        return <ChoseUsersModal multipleOption={true} ModalTitle={"Please chose users to add to the group"} callBack={props.AddContactCallBack} UsersList={props.UserContacts} />

      case 'Remove':
        return <ChoseUsersModal multipleOption={true} UsersList={GroupUserList} ModalTitle={"Please chose users to remove from the group"} callBack={props.RemoveGroupUserCallBack} />
    }
  }

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
            <button className="btn btn-primary" onClick={props.DeleteGroupCallBack}>Delete group</button>
            <button className="btn btn-primary"
              onClick={() => {
                SetUsersMenuToRender('Add')
              }}
              data-toggle="modal"
              data-target="#ChoseUsersModal">Add contacts to group</button>
            <button className="btn btn-primary"
              data-toggle="modal"
              data-target="#EditGroupTitleModal"
            >Edit Group Title</button>
            <EditGroupTitleModal EditGroupTitleCallBack={props.EditGroupTitleCallBack} title={props.GroupInfo?.GroupTitle} />
            <button onClick={() => {
              SetUsersMenuToRender('Remove')
            }}
              className='btn btn-primary' data-toggle="modal" data-target="#ChoseUsersModal">Remove Users From Group</button>
            {renderSwitch()}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ManageGroupModal
