import React from 'react'

//Users List
//Header
//CallBackFunction

const ContactModal = (props) => {
  return (
    <div
        class="modal fade"
        id="ChoseUsersModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ContactsModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ContactsModalLabel">
                Chose contact:
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

export default ContactModal
