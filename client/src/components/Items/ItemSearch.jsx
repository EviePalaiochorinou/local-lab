import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Item from './Item';
import HomeBanner from '../Home/HomeBanner';
import '../Home/Home.css';
import express from "../../apis/express";
import './ItemList.css'
import './ItemSearch.css'

// clean unecesary functions from here when time allows

const ItemList = ({session, refreshItems, setRefreshItems, searchItems, setSearchItems, setAlert}) => {

  let history = useHistory();

  const [itemList, setItemList] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [searchItem, setSearchItem] = useState("")

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    if(refreshItems) {
      getItems()
      setRefreshItems(false)
    }
  }, [refreshItems, setRefreshItems])

  const getItems = async () => {
    const { data } = await express.get('/items')
    setItemList(data)
  }

  const addItem = async (event) => {
    event.preventDefault()
    if(session) {
      const { id: userId } = session.user
      const { data } = await express.post('/items', {
        item: {
          name: name,
          description: description,
          lender: userId
        }
      })
    }
    
    getItems()
  }

  const deleteItem = async (id) => {

    const { data } = await express.delete(`/items/${id}`)
    getItems()
  }

  const borrowItem = async (id) => {
    if(session) {
      const { id: userId } = session.user
      const { data } = await express.put(`/items/${id}/borrow/${userId}`)
    }
    getItems()
  }

  const updateItem = async (event, name, description, lender, borrower, id) => {
    event.preventDefault()
    await express.put(`/items/${id}`, {
      item: {
        name: name,
        description: description,
      }
    })
   
    getItems()
  }

  const uploadImage = async (event, imageTitle, imageFile, id) => {
    
    event.preventDefault()
    let formData = new FormData()
    formData.append('title', imageTitle)
    formData.append('itemImage', imageFile)

    try {
      const { data } = await express.post(`/items/${id}/images`, formData)
      console.log(data)
    } catch(err) {
      console.log(err)
    }
    getItems()
  }

  const submitSearch = async (event) => {
    event.preventDefault()

    if(!searchItem) {
      const emptySearchError = document.getElementById('item-search-empty-search-error')
      emptySearchError.style.display = 'block'
      return
    }

    const { data } = await express.get(`/items/search/${searchItem}`)

    if(!data.length) {
      const noSearchResultsMsg = document.getElementById('item-search-no-search-results')
      noSearchResultsMsg.style.display = 'block'
      return
    }

    setSearchItems(data)
    history.push(`/items/search/${searchItem}`);
  }

  const removeWarnings = async (event) => {
    const emptySearchError = document.getElementById('item-search-empty-search-error')
    emptySearchError.style.display = 'none'

    const noSearchResultsMsg = document.getElementById('item-search-no-search-results')
    noSearchResultsMsg.style.display = 'none'
  }

  const renderedList = searchItems.map(item => {
    return (
      <Item 
        key={item._id} 
        item={item}
        deleteItem={deleteItem}
        updateItem={updateItem}
        uploadImage={uploadImage}
        borrowItem={borrowItem}
        session={session}
        setAlert={setAlert}
      />
    )
  })

  return (
    <div>
      <HomeBanner />
      <div className="main-content">
      {/* SEARCH FORM */}
      <form onClick={removeWarnings} onSubmit={submitSearch}>
        <div className="ui slow blue loading double fluid search">
          <div className="ui icon fluid focus input">
            <input className="prompt" onChange={(event) => {
              setSearchItem(event.target.value)
              removeWarnings()
              }} type="text" placeholder="Search for items..." />
            <i className="search icon"></i>
          </div>
        </div>  
      </form>

      <br/>

      <p id="item-search-empty-search-error"><span className="ui error text">Search cannot be empty!</span></p>
      <p id="item-search-no-search-results"><span className="ui large grey text">Sorry, no results found.</span></p>

      <div className="ui one stackable cards main-item-list">
        {renderedList}
      </div>

      </div>
  
     
    </div>
  )

}

export default ItemList