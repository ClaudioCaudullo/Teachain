import React,{useContext,useState} from 'react'
import styles from "../styles/Recensione.module.css"
import { MainContext } from '../context/MainContext'
import { useNavigate } from 'react-router-dom'


const Recensione = ({item}) => {
    let {contractUserDetails}= useContext(MainContext);
    const [imgProfilo,setImgProfilo]=useState("");
    const [nomeUtente,setNomeUtente]=useState("");
    let navigate=useNavigate();


    async function caricaDati(){
    let result=await contractUserDetails.getUtente(item.creatore);
    let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${result}`);
    response=await response.json();
    setImgProfilo(response.userDetails.img);
    setNomeUtente(response.userDetails.username);
    }
    
    caricaDati();

    return (
    <div className={styles.container}>
        <div className={styles.containerInfoUtente}>
            <img onClick={()=>{navigate(`/profilo/${item.creatore}`)}} src={imgProfilo}/>
            <p onClick={()=>{navigate(`/profilo/${item.creatore}`)}}>{nomeUtente}</p>
        </div>
        <div className={styles.containerRecensione}>
            <h1>{item.titolo}</h1>
            <h2>Voto: {item.voto}⭐</h2>
            <p>{item.testo}</p>
        </div>
    </div>
    )
}

export default Recensione