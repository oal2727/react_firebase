import React,{Suspense} from 'react';
import './App.css';

import {Button,Container} from 'react-bootstrap'
//integran antes del react.lazy
// import ProductoComponentContext from './context/ProductoContext'
const ProductoComponentContext = React.lazy(()=>import("./context/ProductoContext"))
const AddProducto = React.lazy(()=>import("./components/Productos/AddProducto"))
const ListaProducto = React.lazy(()=>import("./components/Productos/ListProducto"))
// import ProductoComponentContext from "./context/ProductoContext"
// import AddProducto from "./components/Productos/AddProducto"
// import ListProducto from "./components/Productos/ListProducto"

// El prop fallback acepta cualquier elemento de React que quieras renderizar mientras esperas que AddProducto cargue

//indicando tiempo de carga en el renderizado principal
function App() {
  return (
    <Suspense fallback={<div>loading ...</div>}>
       <ProductoComponentContext>
        <Container style={{marginTop:10}}>
      <AddProducto/>
      <ListaProducto/>
      </Container>
      </ProductoComponentContext>
      </Suspense>
  
  );
}

export default App;
