import { useEffect } from 'react'
import { useContext,useState } from 'react'
import { MainContext } from '../context/MainContext'
import {useNavigate} from "react-router-dom";
import styles from "../styles/Card.module.css"
import "../styles/Colors.css"
import { _fetchData } from 'ethers/lib/utils';
const Card = ({item}) => {
  let {getUserImage}=useContext(MainContext)
  let navigate=useNavigate();
 let tagPrimary,tagSecondary;

 tagPrimary=item.subject.toLowerCase()
 tagPrimary=tagPrimary.replace(/ /g,"")
 tagPrimary=tagPrimary.replace("(","")
 tagPrimary=tagPrimary.replace(")","")
 tagPrimary=tagPrimary.replace(".","")

 tagSecondary=item.secondary.toLowerCase()
 tagSecondary=tagSecondary.replace(/ /g,"")
 tagSecondary=tagSecondary.replace("(","")
 tagSecondary=tagSecondary.replace(")","")
 tagSecondary=tagSecondary.replace(".","")

 const[profileImage,setProfileImage]=useState("");

  useEffect(()=>{
    const fetchData= async()=>{ 
    let img=await getUserImage(item.creator)
    setProfileImage(img)
    }
    fetchData()
  },[])


  return (
    <>
  <div className={styles.card} >
    <div className={styles.cardHeader}>
      <img src={item.img} onClick={()=>{navigate(`/zoomCorso/${item.hash}`)}} alt="immagine corso" />
    </div>
    <div className={styles.cardBody}>
      <div className={styles.cardTags}>
      <span className={`${styles.tag} ${tagPrimary}`}>{item.subject}</span>
      {item.secondaria?(<span className={`${styles.tag} ${tagSecondary}`}>{item.secondary}</span>):(<></>)}
      </div>
      <h4>
        {item.title.length>20?(item.title.slice(0,37)+('...')):(item.title)}
      </h4>
      <p>
      {item.description.length>100?(item.description.slice(0,105)+('...')):(item.description)}
      </p>
      <div className={styles.user} onClick={()=>{navigate(`/profilo/${item.creator}`)}}>
        <img src={profileImage}  alt="user" />
        <div className={styles.userInfo}>
          <h5>{item.username}</h5>
          <small>{item.price}€</small>
        </div>
      </div>
    </div>
  </div>
  
</>
  );
}

export default Card