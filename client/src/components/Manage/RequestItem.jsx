import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from 'semantic-ui-react'
import '../images/image.png'
import express from '../../apis/express'
import './RequestItem.css'

 const RequestItem = ({requestItem, getRequests, setAlert}) => {
   
  const { _id: itemId, name, description, images, borrower, requests } = requestItem
 
    // SET RATING
    let r = Math.floor(Math.random() * 5) + 1;
    const RatingStar = () => (
      <Rating icon='star' defaultRating={r} maxRating={5} disabled/>
    )
    
    const approveRequest = async (requesterId, requestId, requester) => {
      const { data } = await express.put(`/items/${itemId}/borrow/${requesterId}`, {
        requestId, 
      })
      getRequests()
      setAlert({type: 'success', header: "Request Approved!", event: 'APPROVE_REQUEST', itemName: name, requester: requester});
    }

    const declineRequest = async (requestId, requester) => {
      const { data } = await express.delete(`items/${itemId}/requests/${requestId}`)
      getRequests()
      setAlert({type: 'warning', header: "Request Declined!", event: 'DECLINE_REQUEST', itemName: name, requester: requester});
    }

    const confirmReturn = async (requestId) => {
      const { data } = await express.delete(`items/${itemId}/returns/${requestId}`)
      getRequests()
      setAlert({type: 'success', header: "Return Confirmation!", event: 'CONFIRM_RETURN', itemName: name, borrower: borrower.username});
    }
    

    const reqs = requests.map(request => request)
    const singleReq = reqs.map(singleReq => {
      return (
        <div className='ui cards request-cards'>
          
          <div className="ui card request-card">   
            <div className="content">
              {borrower && borrower._id && borrower._id === singleReq.requester._id && singleReq.return_request ? <p className="ui floated right green label">Return Requested</p> 
              : borrower && borrower._id && borrower._id === singleReq.requester._id ? <p className="ui floated right green label">Current Borrower</p> 
              : ""}
              <img className="right floated mini ui image" src="https://react.semantic-ui.com//images/avatar/large/elliot.jpg" alt=''/>
            <div className="header">
              {singleReq.requester.name}
            </div>
            <div className="meta">
              <p>{singleReq.requester.location}</p>
              {singleReq.requester.email}
            </div>
            <div className='light-separator'></div>
            <div className="description">
              {borrower && borrower._id && borrower._id === singleReq.requester._id && singleReq.return_request ? <p><b>{singleReq.requester.name}</b> would like to return this item. Please confirm that you have received your <b>{name}</b> in a reasonable condition.</p> 
              : borrower && borrower._id === singleReq.requester._id ? <p><b>{singleReq.requester.name}</b>is currently <span className={`ui text ${new Date(Date.now()) > new Date(singleReq.return) ? 'red' : 'blue' }`}><b>borrowing</b></span>your <b>{name}</b>and {new Date(Date.now()) > new Date(singleReq.return) ? 'was' : 'is'} due to return it by <span className={`ui text ${new Date(Date.now()) > new Date(singleReq.return) ? 'red' : 'blue' }`}><b>{new Date(singleReq.return).toLocaleString('en-En', {day: "numeric", month: "long"})}.</b></span></p> 
              : <p><b>{singleReq.requester.name}</b>would like to <span className={`ui text ${new Date(Date.now()) > new Date(singleReq.return) ? 'red' : 'blue' }`}><b>borrow</b></span>your <b>{name}</b>and return it by <span className={`ui text ${new Date(Date.now()) > new Date(singleReq.return) ? 'red' : 'blue' }`}><b>{new Date(singleReq.return).toLocaleString('en-En', {day: "numeric", month: "long"})}.</b></span></p>}
            </div>
              {borrower && singleReq.requester._id === borrower._id && new Date(Date.now()) > new Date(singleReq.return) ? <p><span className="ui error text">Return Overdue!</span> Contact customer support if the borrower has become unresponsive.</p> : ""}
              {borrower && singleReq.requester._id !== borrower._id && new Date(Date.now()) > new Date(singleReq.return) ? <p><span className="ui error text">Old request.</span> Decline to clear from your dashboard.</p> : ""}
            {
              borrower && borrower._id && borrower._id === singleReq.requester._id && singleReq.return_request ? ""
              : <div className='ui segment blue'>{singleReq.message !== "" ? `"${singleReq.message}"` : "No message." }</div>
            }
            </div>
            
            <div className="extra content">
              <div className="ui two buttons">
                {borrower && borrower._id && borrower._id === singleReq.requester._id && singleReq.return_request ? <button onClick={() => confirmReturn(singleReq._id)} className='ui basic green button'>Confirm Return</button> 
                : ""}
                {borrower && borrower._id && borrower._id === singleReq.requester._id ? "" : <div onClick={() => approveRequest(singleReq.requester._id, singleReq._id, singleReq.requester.username)} className={`ui basic green button ${borrower && borrower._id ? 'disabled' : ""}`}>{borrower && borrower._id === singleReq.requester._id ? "Approved" : "Approve"}</div>}
                {borrower && borrower._id && borrower._id === singleReq.requester._id ? "" : <div onClick={() => declineRequest(singleReq._id, singleReq.requester.username)} className="ui basic red button">Decline</div> }
              </div>
            </div>
          </div>
        </div>
      )
    })
   

  return (

    <div className='ui card'>
      
      <div className='content'>
        <Link to={`/items/${itemId}`}>
          <h3 className="header">{name}</h3>
        </Link>
        {description}
      </div>
      
    
        <div className="content">
          <div className="ui column centered right floated">
          
              <div className="ui segment">
                <div className="ui slide masked reveal image">
                  <img className="visible content" src={images[0] ? images[0].path : "https://react.semantic-ui.com/images/wireframe/image.png"} alt=""/>
                  <img src={images[1] ? images[1].path : "https://react.semantic-ui.com//images/avatar/large/elliot.jpg"} className="hidden content" alt=""/>
                </div>
              </div>
              
          </div>
          
          <div className="meta">    
            {singleReq}
          </div>
        </div>
      
        <div className="extra">
          <div>
            Rating: <RatingStar />
          </div>
        </div>

    </div>
    
  )
}

export default RequestItem