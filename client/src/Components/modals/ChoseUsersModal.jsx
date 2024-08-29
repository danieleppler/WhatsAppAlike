import React, { useState } from 'react'

//expected props
//Users List - UsersList (Id,DisplayName)
//Header = ModalTitle 
//CallBackFunction - callBack
//multipleOption - multipleOption

const ChoseUsersModal = (props) => {

  const [selectedUsers, SetselectedUsers] = useState([])

  return (
    <div class="modal fade" id="ChoseUsersModal" tabIndex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {props.ModalTitle}
            </h5>
          </div>
          <div class="modal-body">

            {props.multipleOption ? props.UsersList?.map((x, index) => {
              return (
                <div>
                  <input value={x.DisplayName} type="checkbox" key={index} onChange={(e) => {
                    if (e.target.checked) {
                      let temp = selectedUsers.find((z) => x.DisplayName === z)
                      if (!temp) {
                        SetselectedUsers([...selectedUsers, x])
                      }

                    }
                    else {
                      let temp = selectedUsers.filter((z) => z !== x.DisplayName)
                      SetselectedUsers(temp)
                    }
                  }} class="UserInChoseUserMenu">
                  </input>
                  <label>
                    {x.DisplayName}
                  </label>
                </div>
              );
            }) :
              props.UsersList?.map((x, index) => {
                return (
                  <div>
                    <input id={x.DisplayName} name="user" type="radio" key={index} onChange={(e) => {
                      SetselectedUsers([e.target.id])
                    }} ></input>
                    <label for={x.DisplayName}>{x.DisplayName}</label>
                  </div>
                )
              })
            }
          </div>
          <div class="modal-footer">
            <button type="button" onClick={() => { props.callBack(selectedUsers) }} class="btn btn-secondary" data-dismiss="modal">
              Select
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChoseUsersModal
