import React from 'react'
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
const Card2 = ({item}) => {


    let {currentAccount,contractCorsi,loadCorsi}= useContext(MainContext)
  let navigate=useNavigate();
  const [caricamento,setCaricamento]=useState("false");
  const [severity,setSeverity]=useState();
  const [alertText,setAlertText]=useState("");
  const [incluso,setIncluso]=useState(false)
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



  async function attesaMetamask(provider,error,transactionHash)
  {
    setCaricamento("true")
    await provider.waitForTransaction(error.hash)
    .then(async ()=>{
    await(await(contractCorsi.addAcquisto(item.id,currentAccount))    
    .catch((error)=>{
      setAlertText(error.message)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
    })).wait()
      await loadCorsi()
      let result=await contractCorsi.getNumeroAcquisti(item.id)
      let result2=await contractCorsi.getAcquirenti(item.id)
      setAlertText("Corso acquistato con successo!")
      setOpen(true)
      setSeverity("success")
      setCaricamento("false")
    

  })
    .catch((error)=>{
      setAlertText(error.message)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
    })
  }


  async function buyCorso()
  {
    setCaricamento("true")
try{
  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const response=await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=ETHEUR')
  const body = response.data;
  
  const tx=await signer.sendTransaction({
    to:item.creatore,
    value: ethers.utils.parseEther(""+(item.prezzo/body.price).toFixed(5))
  }).then((error,hash)=>attesaMetamask(provider,error,hash));


}catch(error)
{
  if(error.code=="NUMERIC_FAULT")
  {
    setAlertText("Price calculation has failed, retry!")
    setOpen(true)
    setSeverity("warning")
    setCaricamento("false")
  }else
{  setAlertText(error.code)
  setOpen(true)
  setSeverity("error")
  setCaricamento("false")}

}
  
}

async function eliminaCorso()
{
  setCaricamento("true")
  await (await contractCorsi.eliminaCorso(item.id).catch((err)=>{
    setAlertText(err.code)
    setOpen(true)
    setSeverity("error")
    setCaricamento("false")})).wait()
    await loadCorsi();
    setAlertText("Corso eliminato con successo!")
    setOpen(true)
    setSeverity("success")
    setCaricamento("false")

}

// tag-teal

  return (
    <>
    {
        caricamento=="true"?(
        <Loader chiamante="card"/>              
          ):(<></>)
      }
        {
        open==true&&severity?(<>
        
        <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {alertText}
        </Alert>
        </Snackbar>
    </Stack>
        
        </>):(<></>)
    }
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
        <img src={item.immagineProfilo}  alt="user" />
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