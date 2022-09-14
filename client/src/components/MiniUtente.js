import React, { useEffect,useContext,useState } from 'react'
import { MainContext } from '../context/MainContext';
import styles from '../styles/MiniUtente.module.css';
import {useNavigate} from "react-router-dom";
const MiniUtente = ({indirizzo}) => {

    let {caricaDatiUtenteEsterno }=useContext(MainContext);
    const[hash,setHash]=useState();
    const[immagineProfilo,setImmagineProfilo]=useState("");
    const[username,setUsername]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{

        const fetchData=async()=>{
            if(!indirizzo) return
        let x=await caricaDatiUtenteEsterno(indirizzo);
            setHash(x)
        }
        fetchData()
    },[])
    useEffect(()=>{
        const fetchData=async()=>{
            let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${hash}`)
            let risposta = await response.json();
            setImmagineProfilo(risposta.userDetails.img);
            setUsername(risposta.userDetails.username);
    }
    fetchData()
},[hash])
  return (
    <div className={styles.miniContainerUtente}>
        <img src={immagineProfilo} onClick={()=>{navigate(`/profilo/${indirizzo}`)}} />
        <p onClick={()=>{navigate(`/profilo/${indirizzo}`)}}>{username}</p>
    </div>
  )
}

export default MiniUtente