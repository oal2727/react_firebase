import React,{createContext,useReducer} from 'react'
import {ProductoReducer} from '../Reducer/ProductoReducer'
import {collectionProducto} from '../config/ApiKey'
export const ProductoContext = createContext()

 
//itembox trabaja con variable "nombre | texto"
const ProductoContextProvider =(props) =>{
    const initialValues = {
        title:'context here',
        producto:{id:null,nombre:'',categoria:null,descripcion:'',precio:'',stock:'',imageUrl:null,filename:''},
        productos:[],
        spinnerloading:true,
        stateimage:false,
        filenameold:'',
        categoria:null,
        image:null, //uso del imageUrl o del base64
    }
    const [producto,dispatch] = useReducer(ProductoReducer,initialValues)

    React.useEffect(()=>{
         const getListado=async ()=>{
            const data = await collectionProducto.get()
            const arrayData = data.docs.map(item => ({id:item.id,...item.data()}))
            dispatch({type:"GET_PRODUCTO",payload:arrayData})
        }
         getListado()
        // dispatch({type:"GET_PRODUCTO",payload:arrayData})
    },[])


    return (
        <ProductoContext.Provider value={{producto,dispatch}}>
            {props.children}
        </ProductoContext.Provider>
    )
}
export default ProductoContextProvider



//implementar acciones en modulos
//optimizar codigo en firebase