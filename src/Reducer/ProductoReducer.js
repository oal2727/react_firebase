export const ProductoReducer=(state,action) =>{
    switch(action.type){
        case 'ADD_PRODUCTO':
            return{
                ...state,
                productos:[
                    ...state.productos,
                    action.payload,
                ],
               
            }
        case 'GET_PRODUCTO':
            return{
                ...state,
                productos:action.payload,
                spinnerloading:false
            }
        case 'DELETE_PRODUCTO':
            const arrayFilter = state.productos.filter(item => {
                return item.id !== action.payload
            })
            return{
                ...state,
                productos:arrayFilter

            }
        case 'EDITAR_PRODUCTO':
            return {
                ...state,
                categoria:action.payload.categoria,
                stateimage:true,
                image:action.payload.imageUrl,
                filenameold:action.payload.filename,
                producto:{nombre:action.payload.nombre,
                    id:action.payload.id,
                    categoria:action.payload.categoria,
                    descripcion:action.payload.descripcion,
                    stock:action.payload.stock,
                precio:action.payload.precio,
                filename:action.payload.filename,
                imageUrl:action.payload.imageUrl}
            }
        case 'CANCELAR':
            return{
                ...state,
                image:null,
                stateimage:false,
                categoria:null,
                producto:{id:null,nombre:'',categoria:null,descripcion:'',precio:'',stock:''}
            }
        case 'UPDATE_PRODUCTO': //mo muestra cambios
            const arrayUpdate = state.productos.map(item => {
                return item.id === action.payload.id ? action.payload : item
            })
            return{
                ...state,productos:arrayUpdate
            }
        case 'STATE_IMAGEN':
            return{
                ...state,stateimage:false
            }
        case 'TOOGLE_IMAGE': //adjuntar una imagen constantemente
            return{
                ...state,image:action.payload
            }
        case 'SET_CATEGORIA':
            return{
                ...state,categoria:action.payload
            }
        default:
            return state
    }

}