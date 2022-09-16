import React, { useEffect } from 'react'
import axios from 'axios';
import { useContext,useState } from 'react'
import { MainContext } from '../context/MainContext'
import { ethers } from "ethers";
import {useNavigate} from "react-router-dom";
import {Buffer} from 'buffer';
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import styles from "../styles/Card2.module.css"
import "../styles/Colors.css"
import { _fetchData } from 'ethers/lib/utils';
const Card2 = ({item}) => {
  let {getPhotoUtente}=useContext(MainContext)
  let navigate=useNavigate();
 let tagPrimaria,tagSecondaria;

 tagPrimaria=item.materia.toLowerCase()
 tagPrimaria=tagPrimaria.replace(/ /g,"")
 tagPrimaria=tagPrimaria.replace("(","")
 tagPrimaria=tagPrimaria.replace(")","")
 tagPrimaria=tagPrimaria.replace(".","")

 tagSecondaria=item.secondaria.toLowerCase()
 tagSecondaria=tagSecondaria.replace(/ /g,"")
 tagSecondaria=tagSecondaria.replace("(","")
 tagSecondaria=tagSecondaria.replace(")","")
 tagSecondaria=tagSecondaria.replace(".","")

 const[immagineProfilo,setImmagineProfilo]=useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(()=>{
    const fetchData= async()=>{ 
    let img=await getPhotoUtente(item.creatore)
    setImmagineProfilo(img)
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
      <span className={`${styles.tag} ${tagPrimaria}`}>{item.materia}</span>
      {item.secondaria?(<span className={`${styles.tag} ${tagSecondaria}`}>{item.secondaria}</span>):(<></>)}
      </div>
      <h4>
        {item.titolo.length>20?(item.titolo.slice(0,37)+('...')):(item.titolo)}
      </h4>
      <p>
      {item.descrizione.length>100?(item.descrizione.slice(0,105)+('...')):(item.descrizione)}
      </p>
      <div className={styles.user} onClick={()=>{navigate(`/profilo/${item.creatore}`)}}>
        <img src={immagineProfilo}  alt="user" />
        <div className={styles.userInfo}>
          <h5>{item.username}</h5>
          <small>{item.prezzo}€</small>
        </div>
      </div>
    </div>
  </div>
  
</>
  );
}

export default Card2