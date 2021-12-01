import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { useAuctionItem } from "../contexts/AuctionItemContext";
import TooltipHelp from "../components/TooltipHelp";
import { UserContext } from "../contexts/UserContext";
import CustomModal from "../components/CustomModal";

function CreateNewListing() {
  const history = useHistory();
  const { postNewAuctionItem } = useAuctionItem();
  const { currentUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reservationPrice, setReservationPrice] = useState(0);
  const [startPrice, setStartPrice] = useState(0);
  const [indexOfPrimaryImg, setIndexOfPrimaryImg] = useState(0);
  const [myProp, setMyProp] = useState({});
  const [formData, setFormData] = useState();

  function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    result.setHours(result.getHours());
    return result;
  }

  const pull_data = (data) => {
    setMyProp({
      show: false,
    });
    if (data === "/my-listings") {
      history.push("/my-listings");
    }
  };

  const getChildData = (formDataFromChild, primaryIndex) => {
    setIndexOfPrimaryImg(primaryIndex);
    setFormData(formDataFromChild);
  };

  async function postImages(formDataFromChild) {
    let res = await fetch("/api/upload", {
      method: "POST",
      body: formDataFromChild,
    });
    if (res.status === 200) {
      let filePaths = await res.json();
      let arrayOfImgStrings = [];
      for (let path of filePaths) {
        let pathToSave = path;
        arrayOfImgStrings.push(pathToSave);
      }
      return arrayOfImgStrings.toString();
    } else {
      console.log("Image upload failed");
      return null;
    }
  }

  async function postNewItem() {
    if (
      !isNumber(reservationPrice) ||
      !isNumber(startPrice) ||
      title === "" ||
      description === "" ||
      !reservationPrice > 0 ||
      reservationPrice < 0 ||
      startPrice < 0
    ) {
      setMyProp({ show: true, text: "Please enter correct information" });
    } else {
      let imageString = await postImages(formData);
      if (imageString !== null) {
        const itemToPost = {
          title: title,
          description: description,
          reservationPrice: reservationPrice,
          startPrice: startPrice,
          deadline: addDays(new Date(), 3),
          images: imageString,
          primaryImgIndex: indexOfPrimaryImg,
          notificationSeen: false,
          sold: false,
          minimumBid: Math.round((110 / 100) * startPrice),
          owner: {
            id: currentUser.id,
            fullName: currentUser.fullName,
            username: currentUser.username,
            email: currentUser.email,
          },
        };

        let res = await postNewAuctionItem(itemToPost);

        if (res.status === 200) {
          setMyProp({
            show: true,
            colour: "green",
            text: "Your item has been published!",
          });
        } else {
          setMyProp({
            show: true,
            text: "Something went wrong, try again later",
          });
        }
      } else {
        setMyProp({
          show: true,
          text: "Something went wrong, try again later",
        });
      }
    }
  }

  return (
    <div className="newListingWrapper" style={styles.wrapper}>
      <div className="form" style={styles.form}>
        <div className="tooltipWrapper" style={styles.tooltipWrapper}>
          <TooltipHelp />
        </div>
        <div className="inputs" style={styles.inputs}>
          <div style={styles.inputInside} className="inputInside">
            <label htmlFor="">Title</label>
            <input
              type="text"
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength="60"
            />
          </div>

          <div style={styles.inputInside} className="inputInside">
            <label htmlFor="">Reservation price</label>
            <input
              type="number"
              style={styles.input}
              value={reservationPrice}
              onChange={(e) => setReservationPrice(e.target.value)}
            />
          </div>

          <div style={styles.inputInside} className="inputInside">
            <label htmlFor="">Start price</label>
            <input
              type="number"
              style={styles.input}
              value={startPrice}
              onChange={(e) => setStartPrice(e.target.value)}
            />
          </div>

          <div style={styles.inputInside} className="inputInside">
            <label htmlFor="">Upload images and choose thumbnail</label>
            <FileUpload func={getChildData} />
          </div>
          <div style={styles.inputInside} className="inputInside">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              id=""
              cols="30"
              rows="5"
              style={styles.textArea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength="500"
            ></textarea>
          </div>
        </div>
        <div className="submitBtn">
          <button
            className="postNewListing"
            style={styles.btn}
            onClick={postNewItem}
          >
            Post
          </button>
        </div>
      </div>
      <div className="coolImg">
        <img
          src="https://images.pexels.com/photos/10105932/pexels-photo-10105932.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
          style={styles.coolImg}
        />
        <div className="textIngImg" style={styles.textInImg}>
          <p> Moo may represent an idea, but only the cow knows</p>
          <p>
            <span>- Mason Cooley </span>
          </p>
        </div>
      </div>
      <CustomModal prop={myProp} func={pull_data} />
    </div>
  );
}

export default CreateNewListing;

const styles = {
  wrapper: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "80% 20%",
  },
  coolImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textInImg: {
    textAlign: "left",
    position: "absolute",
    top: "1vh",
    padding: "5vh 5vh 0 1vh",
    color: "white",
    fontFamily: "Georgia, serif",
  },
  form: {
    width: "100%",
    backgroundColor: "rgb(226, 89, 55)",
    display: "flex",
    flexDirection: "column",
    padding: "2vh 5vw 2vh 5vw",
    gap: "5vh",
  },
  inputs: {
    backgroundColor: "rgb(226, 89, 55)",
    borderRaidus: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "8vh",
    color: "white",
  },

  input: {
    borderWidth: "0 0 1px 0",
    borderStyle: "none none solid none",
    borderColor: "#f00 #0f0 white #ff0",
    backgroundColor: "rgb(226, 89, 55)",
    color: "white",
    width: "100%",
  },

  inputInside: {
    display: "grid",
    gridTemplateColumns: "15vw 35vw",
    gap: "2vh",
    justifyContent: "center",
    width: "100%",
    textAlign: "left",
    fontSize: "1.1em",
  },

  textArea: {
    borderRaidus: "20%",
    border: "none",
  },
  btn: {
    border: "none",
    borderRadius: "10px",
    padding: "0.5vw",
    fontSize: "1.2em",
    backgroundColor: "black",
    color: "white",
    width: "10vw",
  },
  tooltipWrapper: {
    height: "2vh",
    display: "flex",
    alignItems: "left",
  },
};
