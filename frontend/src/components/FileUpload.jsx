import React, { useState } from "react";
import BootstrapModal from "./BootstrapModal";

function FileUpload(props) {
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("");
  const [imgURLs, setImgURLs] = useState([]);
  const [indexOfPrimaryImg, setIndexOfPrimaryImg] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleModal = () => {
    setShow(!show);
  };

  async function onFileLoad(e) {
    let files = e.target.files;
    let tempArray = []
    let filesSize = 0;

    for (let file of files) {
      filesSize += file.size;
      tempArray.push(file)
    }
    setSelectedFiles(tempArray);

    if (files.length > 3) {
      setModalText("Max 3 images please");
      toggleModal();
      e.target.value = null;
    } else if (filesSize > 1040000) {
      setModalText("Files too large");
      toggleModal();
      e.target.value = null;
    } else {
      createFormDataAndURLs(files);
      e.target.value = null;
    }
  }

  function createFormDataAndURLs(files) {
    let tempImgURLArray = [];
    let formData = new FormData();

    for (let file of files) {
      let fileUrl = URL.createObjectURL(file);
      tempImgURLArray.push(fileUrl);
      formData.append("files", file, file.name);
    }
    setImgURLs(tempImgURLArray);
    props.func(formData, indexOfPrimaryImg);
  }

  function deleteImage(index) { 
    selectedFiles.splice(index, 1);
    let newArray2 = [];
    for (let file of selectedFiles) {
      newArray2.push(file);
    }
    createFormDataAndURLs(newArray2);
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFileLoad} />
      <div className="renderedImgs" style={styles.renderedImgs}>
        {imgURLs && imgURLs.length > 0
          ? imgURLs.map((img, i) => (
              <div>
                <div>
                  <i
                    className="bi bi-x-square"
                    style={styles.deleteImg}
                    onClick={() => {
                      deleteImage(i);
                    }}
                  ></i>
                </div>
                <img
                  src={img}
                  key={img}
                  alt=""
                  onClick={() => {
                    setIndexOfPrimaryImg(i);
                  }}
                  style={
                    indexOfPrimaryImg === imgURLs.indexOf(img)
                      ? styles.primaryImg
                      : styles.img
                  }
                />
              </div>
            ))
          : null}
      </div>
      <div>
        <BootstrapModal toggle={toggleModal} modal={show} text={modalText} />
      </div>
    </div>
  );
}

export default FileUpload;

const styles = {
  img: {
    cursor: "pointer",
    width: "12rem",
    height: "10rem",
    borderRadius: "10px",
    objectFit: "cover",
  },
  renderedImgs: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: "1vw",
    paddingTop: "2vh",
    width: "max-content",
    marginRight: "3rem",
  },
  primaryImg: {
    boxShadow: "0px 0px 8px 2px",
    width: "12rem",
    height: "10rem",
    transform: "scale(1.05)",
    transition: "all .1s ease-in-out",
    borderRadius: "5px",
    objectFit: "cover",
  },
  deleteImg: {
    cursor: "pointer",
    margin: "0.5rem",
    zIndex: "10",
    position: "absolute",
  },
};
