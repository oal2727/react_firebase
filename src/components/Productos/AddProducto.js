import React,{useContext} from 'react'
import {Card,Col,Image,Form,Button,Row} from 'react-bootstrap'
import {useForm} from 'react-hook-form'
import {collectionProducto,storageRef} from '../../config/ApiKey'
import { v4 as uuidv4 } from 'uuid';
import {ProductoContext} from '../../context/ProductoContext'
import InputForm from '../../hooks/InputForm'


const AddProducto = ()=>{

    const {producto,dispatch} = useContext(ProductoContext)
    const {handleSubmit,register,errors} = useForm()

    //categoria
    const categoria = [
        {id:null,value:null,nombre:'Seleccione Categoria'},
        {id:1,value:'Lubricantes',nombre:'Lubricantes'},
        {id:2,value:'Herramienta de Mano',nombre:'Herramienta de Mano'}
    ]


    const onValueChangeCategoria =(e)=>{
        dispatch({type:'SET_CATEGORIA',payload:e.target.value})
    }
    const refContainer = React.useRef(); //reference for image

   //filename para verificar del producto 
    //filename separado para eliminar archivo
    const [fileimage,setFileImage] = React.useState(null) //file object
    // const [image,setImage] = React.useState(null) //image base64
    const [filename,setFileName] = React.useState(null)


    //1 primer testeo defiir async y await en la funcion => bad
    //2 definir async y await al inicio de la funcion
    const onSubmit = (values)=>{
        Object.assign(values,{file:fileimage,filename:filename}) //adjuntar variables
        if(producto.stateimage){
            values.filename=producto.producto.filename
            values.file=producto.producto.imageUrl
        }
        // console.log(values)
        if(producto.producto.id !== null){
            //funcional actualziacion solo
            storageRef.child(`productos/${values.filename}`).getDownloadURL().then(onResolve, onReject);
            async function onResolve(){
                // console.log(values)
                delete values.file
                  Object.assign(values,{imageUrl:producto.producto.imageUrl,id:producto.producto.id})
                  console.log('final',values)
                  const {categoria,descripcion,filename,imageUrl,nombre,precio,stock} = values
                   await collectionProducto.doc(producto.producto.id).update({categoria,descripcion,filename,imageUrl,nombre,precio,stock}).then(()=>{
                    dispatch({type:"UPDATE_PRODUCTO",payload:values})
                    dispatch({type:'CANCELAR'})
                })
            }
            function onReject(){ 
                // console.log(values)
                //no funcional
                console.log("no existe imagen actualizando")
                console.log('updated',values)
                var desertRef = storageRef.child(`productos/${producto.filenameold}`)
                desertRef.delete().then(()=>{
                    //delete complete
                    var uploadTask = storageRef.child(`productos/${values.filename}`).put(values.file);
                    uploadTask.on('state_changed',function(snapshot){
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if(progress == 100){
                        console.log("finalizado")
                        uploadTask.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
                            delete values.file
                          await Object.assign(values,{imageUrl:downloadURL,id:producto.producto.id}) //add id,imageUrl,filename
                            const {categoria,descripcion,filename,imageUrl,nombre,precio,stock} = values
                            console.log('data update',values)
                            await collectionProducto.doc(producto.producto.id).update({categoria,descripcion,filename,imageUrl,nombre,precio,stock}).then(()=>{
                                dispatch({type:"UPDATE_PRODUCTO",payload:values})
                                dispatch({type:'CANCELAR'})
                            })
                        });
                    }
                    })
                })  
            }
                
        }else{
            console.log("agregando ...")
            console.log(values)
                var uploadTask = storageRef.child(`productos/${values.filename}`).put(values.file);
            uploadTask.on('state_changed',async function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            if(progress == 100){
                console.log("finalizado")
                uploadTask.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
                    delete values.file
                    Object.assign(values,{imageUrl:downloadURL})
                   await collectionProducto.add(values).then(()=>{
                        dispatch({type:'ADD_PRODUCTO',payload:values})
                        dispatch({type:'CANCELAR'}) //no limpia el formulario
                    })
                });
            }
        
            })
        }
    }
    const fileUploadAction  =()=> {
       // console.log(refContainer.current) //get reference html 
        refContainer.current.click()
    }
    const fileUploadInputChange =(e)=>{
        const file = e.target.files[0]
        console.log(file)
        dispatch({type:'STATE_IMAGEN'})
        setFileImage(file)
        createFileName(file) //create filename
        const filereader = new FileReader()
        filereader.onload = (e)=>{
            dispatch({type:"TOOGLE_IMAGE",payload:e.target.result}) //set base64 encode image
        }
        filereader.readAsDataURL(file)
    }
    const createFileName =(file)=>{
        const extension = file.name.split(".")[1].toLowerCase()
        const filename = `${uuidv4()}.${extension}`
        setFileName(filename)
        console.log(filename)
    }
    const Cancelar = ()=>{
        // reset()
        dispatch({type:'CANCELAR'})
    }
    //definir categoria de producto
   
    //defaultValue => input text
    //
//problema de imagen al editar y crear


//label,register,required,name
 return(
     <Col lg={4} md={6} style={{margin:'auto'}}>
     <Card>
            {
                   producto.image === null ?
                  <Image src="https://placekitten.com/300/300" style={{height:200,width:null}}/>
                  :
                    <Image src={producto.image} style={{height:200,width:null}}/>
                 
              }
        <i className="fas fa-camera" onClick={fileUploadAction} style={{cursor:'pointer',position:'relative',top:-190,color:'white',opacity:1,fontSize:25,marginLeft:10}}></i>
        <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
                {/*  reutilizando componentes */}
                <InputForm label="Nombre Product" register={register} value={producto.producto.nombre}  name="nombre" required/>
                  {/* <Form.Control type="text" name="nombre" placeholder="Nombre Producto" defaultValue={producto.producto.nombre} ref={register}></Form.Control> */}
                  {/* {errors.nombre && errors.nombre.type === "required" & ( <p>nombre is required</p>)} */}
            <p style={{color:'red'}}>{errors.nombre && "nombre is required"}</p>
            </Form.Group>
            <Form.Group>
            <Form.Control as="select" name="categoria" 
              value={producto.categoria} onChange={onValueChangeCategoria} 
               ref={register} > 
                {
                    categoria.map((item)=> (
                    <option key={item.id} value={item.value}>{item.nombre}</option>
                    ))
                }
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control as="textarea" rows="3" name="descripcion" 
               placeholder="Input Description" 
               defaultValue={producto.producto.descripcion}
                ref={register}/>
            </Form.Group>

            <Row>
                <Col>
                <InputForm label="Precio" register={register} value={producto.producto.precio} name="precio" required/>
                 <p style={{color:'red'}}>{errors.precio && "precio  is required"}</p>
                </Col>
                <Col>
                <InputForm label="Stock" register={register} value={producto.producto.stock} name="stock" required/>
                 <p style={{color:'red'}}>{errors.stock && "stock  is required"}</p>
                </Col>
            </Row>
            <Form.Control type="file" ref={refContainer}  onChange={fileUploadInputChange}  id="imagen" style={{display:'none'}}/>
            <div style={{marginTop:15}}>
            {
                producto.producto.id === null ?
                <Button type="submit" variant="primary">Agregar</Button>
                :
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Button type="submit" variant="warning">Update</Button>
                    <Button type="button" onClick={()=>Cancelar()} variant="danger">Cancelar</Button>
                </div>
            }
            </div>
            </Form>
        </Card.Body>

     </Card>
     </Col>
 )
}
export default AddProducto
//Notes

