import React, { useState } from "react";
import BootstrapModal from "./BootstrapModal";

function FileUpload(props) {
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState("");
  const [imgPaths, setImgPaths] = useState([]);
  const [indexOfPrimaryImg, setIndexOfPrimaryImg] = useState(0);

  const toggleModal = () => {
    setShow(!show);
  };

  async function onFileLoad(e) {
    let tempImgURLArray = [];
    let files = e.target.files;
    let filesSize = 0;

    if (files.length > 3) {
      setModalText("Max 3 images please");
      toggleModal();
      e.target.value = null;
    } else {
      let formData = new FormData();

      for (let file of files) {
        let fileUrl = URL.createObjectURL(file);
        tempImgURLArray.push(fileUrl);
        filesSize += file.size;
        formData.append("files", file, file.name);
      }
      if (filesSize > 1040000) {
        setModalText("Files too large");
        setImgPaths([]);
        toggleModal();
        e.target.value = null;
      } else {
        setImgPaths(tempImgURLArray);
        props.func(formData, indexOfPrimaryImg);
      }
      e.target.value = null;
    }
  }

  function deleteImage() {
    console.log("Deleting image")

    // ******* WORK FROM HERE
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={onFileLoad} />
      <div className="renderedImgs" style={styles.renderedImgs}>
        {imgPaths && imgPaths.length > 0
          ? imgPaths.map((img, i) => (
              <div>
                <div>
                  <i
                    className="bi bi-x-square"
                    style={styles.deleteImg}
                    onClick={deleteImage}
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
                    indexOfPrimaryImg === imgPaths.indexOf(img)
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
    marginRight: "3rem"
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
    position: "absolute"
  },
};
