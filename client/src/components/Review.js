import { useContext, useState } from "react";
import styles from "../styles/Reviews.module.css";
import { MainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";

const Review = ({ item }) => {
  let { contractUserDetails } = useContext(MainContext);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  let navigate = useNavigate();

  async function caricaDati() {
    let result = await contractUserDetails.getUser(item.creator);
    let response = await fetch(
      `https://learningdata.infura-ipfs.io/ipfs/${result}`
    );
    response = await response.json();
    setProfilePic(response.userDetails.img);
    setUsername(response.userDetails.username);
  }

  caricaDati();

  return (
    <div className={styles.container}>
      <div className={styles.containerInfoUser}>
        <img
          onClick={() => {
            navigate(`/profilo/${item.creator}`);
          }}
          src={profilePic}
        />
        <p
          onClick={() => {
            navigate(`/profilo/${item.creator}`);
          }}
        >
          {username}
        </p>
      </div>
      <div className={styles.containerReview}>
        <h1>{item.title}</h1>
        <h2>Voto: {item.vote}⭐</h2>
        <p>{item.text}</p>
      </div>
    </div>
  );
};

export default Review;
