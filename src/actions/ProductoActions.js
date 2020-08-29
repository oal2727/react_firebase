import {collectionProducto,storageRef} from '../config/ApiKey'



export const  AddDataAction =  (data)=> {
    var uploadTask = storageRef.child(`productos/${data.filename}`).put(data.file);
     uploadTask.on('state_changed',async function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        if(progress == 100){
            console.log("finalizado")
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
            return downloadURL
        //   return await uploadTask.snapshot.ref.getDownloadURL().then(url =>{
        //       const imageUrl = url
        //       return imageUrl
        //   })
        }
    
     })
}

// }Hay una manera fácil de hacer esto, cada QuerySnapshot tiene un documento de propiedad que 
//devuelve una matriz de QueryDocumentSnapshots. Consulte la documentación de QuerySnapsho
export const getListado= async ()=>{
    const data = await collectionProducto.get()
    const arrayData = data.docs.map(item => ({id:item.id,...item.data()}))
    return arrayData
}




// const uploadfile =(file)=>{

// }