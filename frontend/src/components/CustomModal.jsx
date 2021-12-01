import { Link } from 'react-router-dom'


const CustomModal = (prop) => {
  let styleType = () => {
    if (prop.prop.show) {
      if (prop.prop.colour === "green") {
        return styles.showGreen;
      }
      if (prop.prop.colour === "red") {
        return styles.showRed;
      }
      return styles.show;
    } else if (!prop.prop.show) {
      return styles.hide;
    }
  };

  function close() {
    if (prop.prop.auctionItem) {
      prop.func(prop.prop.auctionItem);
    } else if (prop.prop.text === "Your item has been published!") {
      prop.func("/my-listings");
    } else {
      prop.func(false);
    }
  }

  return (
    <div style={styleType()} className="customModal">
      <div className="closeModal" style={styles.closeModal}>
        <p>
          <i className="bi bi-x-square" color="white" onClick={close}></i>
        </p>
      </div>
      <div className="header" style={styles.header}>
        <p>{prop.prop.header}</p>
      </div>
      <div className="mainInfo" style={styles.mainInfo}>
        <p>{prop.prop.text}</p>
        {prop.prop.auctionItem && (
          <div className="auctionItemLink" style={styles.auctionItemLink}>
            <Link
              style={styles.auctionItemLink}
              to={`/details/${prop.prop.auctionItem.id}`}
              onClick={close}
            >
              {prop.prop.auctionItem.title + " " }
              <i class="bi bi-link"></i>
            </Link>
          </div>
        )}
      </div>
      <div className="modalFooter" style={styles.modalFooter}>
        <p>{prop.prop.footerText}</p>
      </div>
    </div>
  );
};

export default CustomModal;

const styles = {
  hide: {
    display: "none",
  },
  show: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "fixed",
    width: "30vw",
    height: "30vh",
    backgroundColor: "black",
    right: "35vw",
    top: "40vh",
    borderRadius: "20px",
    opacity: "0.8",
    gridTemplateRows: "20% 50% 30%",
    padding: "1vw",
    color: "white",
    zIndex: "100",
  },
  showGreen: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "fixed",
    width: "30vw",
    height: "30vh",
    backgroundColor: "green",
    right: "35vw",
    top: "40vh",
    borderRadius: "20px",
    opacity: "0.8",
    gridTemplateRows: "20% 50% 30%",
    padding: "1vw",
    color: "white",
    zIndex: "100",
  },
  showRed: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "fixed",
    width: "30vw",
    height: "30vh",
    backgroundColor: "red",
    right: "35vw",
    top: "40vh",
    borderRadius: "20px",
    opacity: "0.8",
    gridTemplateRows: "20% 50% 30%",
    padding: "1vw",
    color: "white",
    zIndex: "100"
  },
  closeModal: {
    textAlign: "right",
    cursor: "pointer",
    paddingRight: "1rem",
    zIndex: "100"
    
  },
  modalFooter: {
    borderTop: "1px solid white",
  },
  mainInfo: {
    paddingTop: "2rem",
    fontSize: "1.3em",
    fontWeight: "bold",
  },
  header: {
    paddingTop: "2rem",
    fontSize: "2em",
    fontWeight: "bold",
  },
  auctionItemLink: {
    margin: "1rem",
    color: "white",
  },
};
