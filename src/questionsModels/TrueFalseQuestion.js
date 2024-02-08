import React from 'react'

export default function TrueFalseQuestion() {
  const style = { 
    display: "block"
  };
  return (
      
        <div  style = {style} class="modal" id="exampleModal" tabIndex="-2" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
