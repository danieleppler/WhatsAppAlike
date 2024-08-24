import React, { useState } from 'react'


const NewGroupModal = (props) => {

    const [GroupData,SetGroupData] = useState({
        GroupTitle:"",
        GroupDescription:"",
        Users:[props.CurrentLoggedUser.userId]
    })


    
  return (

    <div
    class="modal fade"
    id="AddGroupModal"
    tabIndex="-1"
    role="dialogasd"
    aria-hidden="true" 
  >

        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ContactsModalLabel">
                Add new group
              </h5>
            </div>
            <div class="modal-body">
               <form>
                Group Name : <input onChange={(e)=>{SetGroupData({...GroupData,GroupTitle:e.target.value})}}></input> <br />
                Group description : <input onChange={(e)=>{SetGroupData({...GroupData,GroupDescription:e.target.value})}}></input> <br />
                Chose Contacts to add to group:
                <div class="form-check AddContactsToGroupDiv" onChange={(e)=>{
                    SetGroupData({...GroupData,Users:[...GroupData.Users,e.target.value]})
                }}>
                    {
                        props.UserContacts?.map((x)=>{
                            return <div>
                                <input type="checkbox" name={x.DisplayName} value = {x.id}></input>
                                {x.DisplayName}
                                </div>
                        })
                    }
                
                </div>
                </form>
            </div>
            <div class="modal-footer">
            <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onClick={()=>{props.handleAddGroupClicked(GroupData)}}
              >
                Add
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>

            </div>
    </div>
    </div>
  )
}

export default NewGroupModal
