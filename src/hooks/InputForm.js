import React from 'react'
import {Form} from 'react-bootstrap'
const InputForm = ({label,register,value,name})=>{
    return(
        <Form.Control type="text" name={name}  defaultValue={value} placeholder={label} ref={register({required:true})}></Form.Control>
    )

}
export default InputForm