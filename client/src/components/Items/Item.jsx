import React, {useState} from "react";

const Item = ({ item, deleteItem, updateItem, uploadImage }) => {

  // Update Item States
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState("")

  // Upload Image States
  const [imageTitle, setImageTitle] = useState("")
  const [imageFile, setImageFile] = useState("")

  return (
    <div>
  
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <button onClick={() => deleteItem(item._id)}>Delete</button>

      <form onSubmit={() => updateItem(name, description, item.lender, item.borrower, item._id)}>
        <input onChange={(event) => setName(event.target.value)} value={name} type="text" name="name" required/>
        <input onChange={(event) => setDescription(event.target.value)} value={description} type="text" name="description" required/>
        <button>Update Item</button>
      </form>

      <form onSubmit={(event) => uploadImage(event, imageTitle, imageFile, item._id)} encType="multipart/form-data">
        <input type="text" name="title" value={imageTitle} placeholder="Image Title" onChange={e => setImageTitle(e.target.value)} required/>
        <input type="file" name="image" onChange={e => setImageFile(e.target.files[0])} multiple/>
        <input type="file" id="imageFile" capture="user" accept="image/*"/>
        <button type="submit">Submit</button>
      </form>

    </div>
  )
 
}

export default Item