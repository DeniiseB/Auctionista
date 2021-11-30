import React, { useState } from "react";
import BootstrapModal from "./BootstrapModal";

function FileUpload(props) {
  const [imgPaths, setImgPaths] = useState([]);
  const [primaryImgIndex, setPrimaryImgIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("");
  props.func(imgPaths, primaryImgIndex);

  const toggleModal = () => {
    setShow(!show);
  };

  async function onFileLoad(e) {
    setPrimaryImgIndex(0);
    let files = e.target.files;
    let filesSize = 0;
    if (files.length > 3) {
      setModalText("Upload no more than 3 images");
      toggleModal();
      e.target.value = null;
    } else {
      let formData = new FormData();
      for (let file of files) {
        filesSize += file.size;
        formData.append("files", file, file.name);
      }
      if (filesSize > 1040000) {
        setModalText("Files too large");
        toggleModal();
      } else {
        let res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.status === 200) {
          let filePaths = await res.json();
          setImgPaths(filePaths);
        } else {
          setModalText("Something went wrong");
          toggleModal();
        }
      }
      e.target.value = null;
    }
  }

  function setPrimaryImg(e) {
    e.stopPropagation();
    let choosenImg = e.target.src.split("3000")[1];
    let indexOfChoosenImg = imgPaths.indexOf(choosenImg);
    setPrimaryImgIndex(indexOfChoosenImg);
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFileLoad} />
      <div className="renderedImgs" style={styles.renderedImgs}>
        {imgPaths.length > 0
          ? imgPaths.map((img) => (
              <img
              src={img}
              key={img}
                alt=""
                onClick={setPrimaryImg}
                style={
                  primaryImgIndex === imgPaths.indexOf(img)
                    ? styles.primaryImg
                    : styles.img
                }
              />
            ))
          : null}
        <BootstrapModal toggle={toggleModal} modal={show} text={modalText} />
      </div>
    </div>
  );
}

export default FileUpload;

const styles = {
  img: {
    maxWidth: "240px",
    height: "20vh",
    borderRadius: "10px",
  },

  renderedImgs: {
    display: "flex",
    flexDirection: "row",
    gap: "1vw",
    paddingTop: "2vh",
  },

  primaryImg: {
    boxShadow: "0px 0px 8px 2px RGB(104,0,255)",
    maxWidth: "250px",
    height: "20vh",
    transform: "scale(1.1)",
    transition: "all .2s ease-in-out",
    borderRadius: "5px",
  },
};
