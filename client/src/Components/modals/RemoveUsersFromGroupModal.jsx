import React from 'react'

const RemoveUsersFromGroupModal = (props) => {
  return (
    <div
    class="modal fade"
    id="RemoveUsersFromGroupModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="RemoveUsersFromGroupModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="RemoveUsersFromGroupModalLabel">
            Chose User to Remove:
          </h5>
        </div>
        <div class="modal-body">
          {props.UserContacts?.map((x,index) => {
            return (
              <div key={index}
                onClick={props.handleContactClicked}
                data-dismiss="modal"
                className="ContactInChoseContactMenu"
              >
                {x.DisplayName}
              </div>
            );
          })}
        </div>
        <div class="modal-footer">
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

export default RemoveUsersFromGroupModal
