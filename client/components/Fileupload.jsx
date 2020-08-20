import React, { useRef, useState, Fragment } from 'react';
import axios from 'axios';
const reader = new FileReader();

function FileUpload(props) {
  const [file, setFile] = useState(''); // storing the uploaded file    // storing the recived file from backend
  const [filename, setFilename] = useState('Choose File'); // traversy
  const [uploadedFiles, setUploadedFile] = useState([]); // traversey
  const [data, getFile] = useState({ name: "", path: "" });
  const [progress, setProgess] = useState(0); // progess bar
  const el = useRef(); // accesing input element

  console.log('FileUpload.jsx props: ', props)

  const handleChange = (e) => { // consistent with traversey
    e.preventDefault();
    setProgess(0); // medium
    // console.log('fileupload.jsx handlechange typeof target.files[0]: ', typeof e.target.files[0])
    // console.log('fileupload.jsx handlechange target.files[0]: ', e.target.files[0])
    // console.log('fileupload.jsx handlechange typeof target.files[0].name: ', typeof e.target.files[0].name)
    // console.log('fileupload.jsx handlechange target.files[0].name: ', e.target.files[0].name)
    // const convertedFile = reader.readAsDataURL(e.target.files);
    // const convertedName = reader.readAsDataURL(e.target.files[0]);
    // console.log('fileupload.jsx converted: ', converted)
    setFile(e.target.files[0]); // storing file
    setFilename(e.target.files[0].name);
    // these don't print anything, async
    console.log('Fileupload.jsx file: ', file);
    console.log('Fileupload.jsx filename: ', filename);
  }

  const uploadFile = (e) => { // TRAVERSY NEEDS ASYNC
    e.preventDefault();
    const formData = new FormData();
    // const imageFile = document.querySelector('.formInput');
    // formData.append('file', imageFile.files[0]); // appending file
    console.log('typeof file in uploadFile: ', typeof file)
    console.log('file in uploadFile: ', file)
    console.log('filename in uploadFile: ', filename)
    console.log('typeof filename in uploadFile: ', typeof filename)
    formData.append('file', file, filename); // appending file
    // formData.append('filename', filename); // codeburst.io

    // ================== FETCH ==================
    // fetch("/api/upload", {
    //   mode: 'no-cors',
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     "Accept": "application/json",
    //     "type": "formData"
    //   },
    //   body: formData
    // }).then(function (res) {
    //   console.log(res);
    // })
    //   .catch(err => console.log(err));

    // ================== AXIOS ==================
    axios.post('/api/upload', formData, {
      // headers: formData.getHeaders(),
      headers: {
        "Content-Type": "multipart/form-data",
      },
      content: formData,
      onUploadProgress: (ProgressEvent) => {
        let progress = Math.round(
          ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
        setProgess(progress);
        console.log('=======> progress updated in state')
      }
    })
      .then(res => {
        console.log(res);
        // console.log('Fileupload.jsx res.data.path: ', res.data.path)
        // console.log('Fileupload.jsx localhost + res.data.path: ', 'http://localhost:8080' + res.data.path)
        // setUploadedFile({ name, path })
        getFile({
          name: res.data.name,
          // path: 'http://localhost:8080' + res.data.path
          path: '/' + res.data.path
        });
        const updatedFiles = uploadedFiles.push({ name: res.data.name, path: '/' + res.data.path })
        setUploadedFile(updatedFiles);
      })
      .catch(err => {
        console.log('Fileupload.jsx error: ', err);
        // TRAVERSEY
        // try {
        //   const res = await axios.post('/upload', formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data"
        //     }
        //   });
        //   const { fileName, filePath } = res.data;
        //   setUploadedFile({ fileName, filePath });
        // } catch (err) {
        //   if (err.response.status === 500) {
        //     console.log('There was a problem with the server')
        //   } else {
        //     console.log(err.response.data.msg)
        //   }
        // }
      })
  }

  let photoList = [];
  console.log('uploadedFiles :', uploadedFiles)
  if (uploadedFiles && uploadedFiles.length) {
    photoList = uploadedFiles.map((photo, index) => {
      return (
        <div className="photoObj" key={`photoObj${index}`}>
          <img id="currentPhoto" src={photo.path} alt={photo.name} />
        </div>
      )
    })
  }

  return (
    <div className="fileloadContainer">
      <div className="file-upload">
        <button onClick={(e) => { uploadFile(e) }} className="upbutton">Upload</button>
        <div className="progessBar" style={{ width: progress }}>
          {progress}
        </div>
        <input className="formInput" type="file" ref={el} onChange={(e) => { handleChange(e) }} />
      </div>
      <div className="mediaContent">
        {data.path && <img id="currentPhoto" src={data.path} alt={data.name} />}
        {/* {photoList} */}
      </div>
      <div className="mediaTitleContainer">
        <h4 className="mediaTitle">View Photos and Videos</h4>
      </div>
    </div>
    // TRAVERSY
    // <Fragment>
    //   <form onSubmit={uploadFile}>
    //     <div className="file-upload">
    //       <input type="file" className="fileInput" id="fileButton" onChange={handleChange} />
    //       <label className="custom-file-label" htmlFor="customFile">
    //         Choose File
    //       </label>
    //       <input type="submit" value="Upload" className="upbutton" />
    //     </div>
    //   </form>
    // </Fragment>
  );
}
export default FileUpload;