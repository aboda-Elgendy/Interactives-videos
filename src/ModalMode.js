import React, {useState} from 'react'

export default function ModeModal({onSelect}) {


  return (
        <div class="modal"  tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel"> This is a video. How should it play? </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
               
              </div>
              <div class="modal-footer">
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
            </div>
          </div>
        </div>
   
  )
}
