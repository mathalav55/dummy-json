import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import { Button, FormControl, FormLabel, Modal } from 'react-bootstrap'
import './App.css'
import axios from 'axios'
import { useForm } from "react-hook-form"
import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {



  const [count, setCount] = useState(0)
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const toggle = () => {
    setOpen(!open);
  }
  const baseUrl = `https://dummyjson.com`
  useEffect(() => {
    axios.get(`${baseUrl}/products`).then(resp => resp.data).then(data => {
      setProducts(data.products)
    }).catch(err => {
      console.log({ err })
    })
  }, [])

  const searchProducts = (text) => {
    axios.get(`${baseUrl}/products/search?q=${text}`).then(resp => resp.data).then(data => {
      setProducts(data.products)
    }).catch(err => {
      console.log({ err })
    })
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm()


  const onSubmit = (data) => {
    console.log({ data })
    setLoading(true)
    if (data.id) {
      let _payload = {
        title : data.title,
        description: data.description
      }
      axios.put(`${baseUrl}/products/${data.id}`, _payload).then((e) => {
        console.log(e.data)
        setLoading(false)
        reset()
        toggle()
        toast.success(`Updated ${e.data.title} successfully!`)
      }).catch(e => {
        console.log(e)
        setLoading(false)
        toast.error('Unable to update product!')
      })
      return
    }
    axios.post(`${baseUrl}/products/add`, data).then((e) => {
      console.log(e.data)
      setLoading(false)
      reset()
      toggle()
      toast.success('Added product successfully!')
    }).catch(e => {
      console.log(e)
      setLoading(false)
      toast.error('Unable to add product!')
    })
  }

  const deleteProduct = (id)=>{
    axios.delete(`${baseUrl}/products/${id}`).then((e) => {
      console.log(e.data)
      setLoading(false)
      toast.success(`Deleted ${e.data.title} successfully!`)
    }).catch(e => {
      console.log(e)
      setLoading(false)
      toast.error('Unable to delete product!')
    })
  }

  const handleEdit = (e)=>{
    setValue('id',e.id)
    setValue('description',e.description)
    setValue('title',e.title)
    toggle()
  }

  return (
    <>
      <div>
        <div className='d-flex jsutify-content-between align-items-center justify-content-between my-3'>
          <h1 className='mb-3'>Products</h1>
          <div className='d-flex gap-3'>
            <input type="text" className='form-control' placeholder='search...' onChange={(e) => {
              searchProducts(e.target.value)
            }} />
            <Button onClick={() => { setOpen(true) }}>+Add</Button>
          </div>
        </div>
        {
          products.length ?
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map(e => {
                    return <tr><td>{e.id}</td><td>{e.title}</td><td>{e.description}</td><td><img src={e.thumbnail} height={50} alt="" /></td><td><Button variant='success' onClick={()=>{handleEdit(e)}} >Edit</Button></td><td><Button variant='danger'  onClick={()=>{deleteProduct(e.id)}}>Delete</Button></td></tr>
                  })
                }
              </tbody>
            </Table> : <p>No products available</p>
        }
      </div>

      <Modal
        show={open}
        onHide={toggle}
        size='lg'
      >
        <Modal.Header closeButton><Modal.Title>Add product</Modal.Title></Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <input type="text" {...register("id")} hidden />
            <div>
              <FormLabel>Title*</FormLabel>
              <input className='form-control' {...register("title", { required: true })} />
              <span className='error'>{errors.title && <span>Name is required</span>}</span>
            </div>

            <div>
              <FormLabel>Description*</FormLabel>
              <textarea rows={5} className='form-control' {...register("description", { required: true })} />
              <span className='error'>{errors.description && <span>Description is required</span>}</span>
            </div>

            {
              loading ? <Button disabled>loading...</Button> : <input type="submit" className='btn btn-primary mt-3' />
            }
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default App
