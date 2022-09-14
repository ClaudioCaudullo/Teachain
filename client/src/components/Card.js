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

const Card = ({item}) => {


  let {currentAccount,contractCorsi,loadCorsi}= useContext(MainContext)
  let navigate=useNavigate();
  const [caricamento,setCaricamento]=useState("false");
  const [severity,setSeverity]=useState();
  const [alertText,setAlertText]=useState("");
  const [incluso,setIncluso]=useState(false)
 
 
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
    <div className="card" style={{width: 18+'rem'}}>
    <img src={item.img} onClick={()=>{navigate(`/zoomCorso/${item.hash}`)}} className="card-img-top" style={{ 'objectFit': 'cover',overflow: 'hidden'}} alt="Banner corso"/>
    <div className="card-body">
      <h5 className="card-title">{item.titolo}</h5>
      <p className="card-text">{item.descrizione}</p>
    </div>
    <ul className="list-group list-group-flush">
      <li className="list-group-item" onClick={()=>{navigate(`/profilo/${item.creatore}`)}}>{item.creatore}</li>
      <li className="list-group-item">{item.durata}</li>
      <li className="list-group-item">{item.prezzo} €</li>
      <li className="list-group-item">{item.materia}</li>
      {item.secondaria?(<li className="list-group-item">{item.secondaria}</li>):(<></>)}
      <li className="list-group-item">ID: {parseInt(item.id,16)}</li>
      <li className="list-group-item">Numero acquisti: {parseInt(item.nAcquisti,16)}</li>
      {item.comprato==true?( <li className="list-group-item">Comprato</li>):(<></>)}
    </ul>
    <div className="card-body">
     { currentAccount!=item.creatore ?(
      <>
        <a onClick={()=>buyCorso()} className="card-link">Buy</a>
        <a href="#" className="card-link">Contact</a>
      </>):(<>
      <a onClick={()=>{navigate(`/zoomCorso/${item.hash}`)}} className="card-link">Modifica</a>
        <a   data-bs-toggle="modal" data-bs-target="#modalElimina" className="card-link">Elimina</a>
        <div className="modal fade" id="modalElimina" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Elimina corso</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p>Sei sicuro di voler eliminare il corso {item.titolo} ?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>eliminaCorso()}>Elimina</button>
                </div>
              </div>
            </div>
          </div>
      </>
      )
      }
    </div>
  </div>
  </>

  )
  
}

export default Card