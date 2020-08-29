import React,{useContext} from 'react'
import {Table,Image,Button,Spinner} from 'react-bootstrap'
import {collectionProducto,storageRef} from '../../config/ApiKey'
import {ProductoContext} from '../../context/ProductoContext'

const ListProducto = ()=>{
    const {producto,dispatch} = useContext(ProductoContext)
    //React.Consumer and React.useContext()
    const Delete =(item)=>{
        console.log(item.id)
        var desertRef = storageRef.child(`productos/${item.filename}`)
        desertRef.delete().then(async()=>{
            await collectionProducto.doc(item.id).delete().then(()=>{
                dispatch({type:'DELETE_PRODUCTO',payload:item.id})
            })
        })  
    }
    const Editar = (item)=>{
        // console.log(item)
        dispatch({type:"EDITAR_PRODUCTO",payload:item})
    }


    return(
        <div style={{marginTop:15}}>
            {
                producto.spinnerloading ? <div style={{textAlign:'center',margin:'auto'}}> <Spinner animation="border" variant="primary" />Loading Data ...</div>
                :
                <Table striped bordered hover>
         <thead>
            <tr>
            <th>N°</th>
            <th>Producto</th>
            <th>Categoria</th>
            <th>precio</th>
            <th>stock</th>
            <th>descripcion</th>
            <th>imagen</th>
            <th></th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            {
                producto.productos.map((item,index)=>(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.nombre}</td>
                        <td>{item.categoria}</td>
                        <td>{item.precio}</td>
                         <td>{item.stock}</td>
                         <td>{item.descripcion}</td>
                         <td><Image src={item.imageUrl} style={{width:150,height:150}} alt={item.filename}/></td>
                         <td><Button variant="warning" onClick={()=>Editar(item)}>Editar</Button></td>
                         <td><Button variant="danger" onClick={()=>Delete(item)}>Delete</Button></td>
                    </tr>
                ))

            }
           
        </tbody>
        </Table>
            }
        </div>
    )
}
export default ListProducto