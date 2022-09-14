import "../styles/Profilo2.css"
import React,{useContext,useEffect,useState,useCallback} from 'react'
import { MainContext } from '../context/MainContext';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { Pagination } from '@mui/material';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import Recensione from './Recensione';
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CardMini from './CardMini';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
  console.log('apri/chiudi'),
);
  return (
    <button
      type="button"
      className="bottoniSecondari"
      onClick={decoratedOnClick}
      >
      {children}
    </button>
  );
}
  


const Profilo2 = () => {

  let {isConnected,caricaDatiUtenteEsterno,currentAccount,corsiUtente,loadCorsiUtente,loadRecensioniUtente,contractRecensioni,recensioni,contractUserDetails,setImmagineProfilo }=useContext(MainContext);

  const [voto, setVoto] = useState(2);
  const [value, setValue] = useState(0);
  const [titolo,setTitolo] = useState("");
  const [recensione,setRecensione] = useState("");
  const [testo,setTesto]=useState("");
  let b=false;
  const [immagineProfiloLocale,setimmagineProfiloLocale]=useState("");
  const [immagineSfondo,setImmagineSfondo]=useState("");
  const [fileImage, setFileImage] = useState("");
  const [fileSfondo, setFileSfondo] = useState("");
  const [fileImageURL, setFileImageURL] = useState("");
  const [fileSfondoURL, setFileSfondoURL] = useState("");
  const [userDetails,setUserDetails]=useState("");
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [hash,setHash]=useState("");
  const [newUsername,setNewUsername]=useState("")
  const [newEmail,setNewEmail]=useState("")
  const [newDescrizione,setNewDescrizione]=useState("")
  const [disponibilita,setDisponibilita]=useState([])
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [caricamento,setCaricamento]=useState("false");
  const [alert,setAlert]=useState("false");
  const [severity,setSeverity]=useState("");
  const [alertText,setAlertText]=useState("");
  const [recensionePresente,setRecensionePresente]=useState(false);
  const [idRecensione,setIdRecensione]=useState("");
  const [hashRecensione,setHashRecensione]=useState("");
  const [votoMedio,setVotoMedio]=useState(0);
  const [numRecensioni,setNumRecensioni]=useState(0);
  const [descrizione,setDescrizione]=useState("");
  const [flipSfondo,setFlipSfondo]=useState("");
  const [flipImage,setFlipImage]=useState("");
  const [startDate, setStartDate] = useState(new Date()); 
  const [endDate, setEndDate] = useState(new Date()); 
  const minDate = new Date(new Date().getFullYear(), new Date().getMonth(),new Date().getDate());
  const maxDate = new Date(new Date().getFullYear(),  new Date().getMonth() + 1 ,new Date().getDate());
  const [semaforo,setSemaforo]=useState(0)
  const [nuoveDate,setNuoveDate]=useState([]);
  let date=[];
  const [counter,setCounter]=useState(0)
  const [allEvents, setAllEvents] = useState([{}]);
  const [evento,setEvento]=useState("");

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
  const id=useParams();
  let navigate=useNavigate();
  const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6';   // <---------- your Infura Project ID
    
  const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  // <---------- your Infura Secret
  // (for security concerns, consider saving these values in .env files)
  
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
  
  const client = ipfsHttpClient({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      },
  });

  useEffect(()=>{
    setEndDate(startDate)
  },[startDate])

  const uploadRecensione = async () => {
    if (!recensione) return
    setCaricamento("true")

    let hash
    // Upload post to IPFS
    try {
        let options={
          warpWithDirectory:true,
        }
        const result = await client.add(JSON.stringify({ recensione }),options)
        hash = result.path
    } catch (error) {
      setAlertText("ipfs image upload error: ",error)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
    }
    // upload post to blockchain
    await (await contractRecensioni.addRecensione(hash,id.userid).catch((err)=>{
      setAlertText(err.code)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")})).wait()
      await loadRecensioniUtente(id.userid)
      setAlertText("Recensione aggiunta con successo!")
      setOpen(true)
      setSeverity("success")
      setCaricamento("false")

  }

  const uploadCambimentiProfilo = async () => {
     

    if (!userDetails) return
    setCaricamento("true")

    let hash2
    // Upload post to IPFS
    try {
        let options={
          warpWithDirectory:true,
        }
        const result = await client.add(JSON.stringify({ userDetails }),options)
        hash2 = result.path
        if(hash2==hash) return
    } catch (error) {
      setAlertText("ipfs image upload error: ",error)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
    }
    // upload post to blockchain
    await(await contractUserDetails.changeDetails(hash,hash2,newUsername,newEmail).catch((err)=>{
      setAlertText(err.code)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
      return})).wait()
      setAlertText("Modifiche avvenute con successo!")
      setOpen(true)
      setSeverity("success")
      setCaricamento("false")
    let dettagli= await contractUserDetails.getUtente(currentAccount)
    setUsername(newUsername)
    setNewUsername(newUsername)
    setEmail(newEmail)
    setNewEmail(newEmail)
    setDescrizione(newDescrizione)
    setNewDescrizione(newDescrizione)
    setHash(hash2)
    if(flipSfondo && fileSfondo)setImmagineSfondo(fileSfondoURL)
    if(flipImage && fileImage){
      setimmagineProfiloLocale(fileImageURL)
      setImmagineProfilo(fileImageURL)
    }
  }

  useEffect(()=>{
    const fetchData=async()=>{
      if(recensione)     await uploadRecensione()

    }

    fetchData()
  },[recensione])

  async function salvaDati(){
    if(!currentAccount || !titolo || !testo || !voto || !id.userid)
    {
      setAlertText("Inserisci tutti i campi!")
      setOpen(true)
      setSeverity("warning")
      setCaricamento("false")
    }else{
    const newRecensione={creatore:currentAccount,titolo:titolo,testo:testo,voto:voto,recensito:id.userid};
    setRecensione(newRecensione)
    }
}

useEffect(()=>{
if(immagineProfiloLocale && immagineSfondo && username && email ) 
{ 
  setCaricamento("false")
}
else setCaricamento("true")
},[immagineProfiloLocale,immagineSfondo,username,email,hash])

useEffect(()=>{

  const fetchData=async()=>{
    let numRecensioni=0,votoTotale=0;
  recensioni.map((recensione)=>{
    if(recensione) {
    if(recensione.content.creatore==currentAccount && recensione.content.recensito==id.userid) {
      setTitolo(recensione.content.titolo)
      setVoto(recensione.content.voto)
      setTesto(recensione.content.testo)
      setIdRecensione(recensione.id)
      setHashRecensione(recensione.content.hash)
      setRecensionePresente(true)
    }
      numRecensioni++;
      votoTotale+=recensione.content.voto;
    }

  })
  setNumRecensioni(numRecensioni)
  votoTotale/=numRecensioni
  setVotoMedio(votoTotale)
  setCaricamento("false")
}

  fetchData()
  .catch((error)=>{
  setCaricamento("false")
})
},[recensioni])


  useEffect( ()=>{
    if(currentAccount) {
      const fetchData=async()=>{
        setCaricamento("true")
 
      let hashUtenteEsterno=await caricaDatiUtenteEsterno(id.userid);
      await loadCorsiUtente(id.userid);
      await loadRecensioniUtente(id.userid);
      if(hashUtenteEsterno){
      let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${hashUtenteEsterno}`)
      let risposta = await response.json();
      let appoggio=[];
      let max=0;
      setimmagineProfiloLocale(risposta.userDetails.img)
      setImmagineSfondo(risposta.userDetails.sfondo)
      setUsername(risposta.userDetails.username)
      setNewUsername(risposta.userDetails.username)
      setEmail(risposta.userDetails.email)
      setNewEmail(risposta.userDetails.email)
      setHash(hashUtenteEsterno)
      if(risposta.userDetails.disponibilita){
        risposta.userDetails.disponibilita.map((bo)=>{
            if(max<bo.id) max=bo.id
            appoggio.push(bo)

        })
        setCounter(max+1)
        setAllEvents(appoggio)

}
      setDescrizione(risposta.userDetails.descrizione)
      setNewDescrizione(risposta.userDetails.descrizione)
    }else{
        setimmagineProfiloLocale("n")
        setImmagineSfondo("n")
        setUsername("Nessun utente con questo id")
        setNewUsername(username)
        setEmail("Nessun utente con questo id")
        setNewEmail(email)
        setHash("Nessun utente con questo hash")
        setCaricamento("false")
        setDescrizione("Nessun utente con questo id")
        setNewDescrizione("Nessun utente con questo id")
      }
    
    }

      fetchData()
      .catch((error)=>{
        setimmagineProfiloLocale("")
        setImmagineSfondo("")
        setUsername("Nessun utente con questo id")
        setNewUsername(username)
        setEmail("Nessun utente con questo id")
        setNewEmail(email)
        setDescrizione("Nessun utente con questo id")
        setNewDescrizione("Nessun utente con questo id")
        setHash("Nessun utente con questo hash")
        setAlertText("ipfs image upload error: ",error)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")
      })
    }
  },[currentAccount,id])

  const inputSfondoRef = React.useRef();
  const inputImageRef = React.useRef();
  const clickPrenota=React.useRef()
  const clickRimuovi=React.useRef()
  const clickRimuoviDisponibilita=React.useRef();

  const onFileImageChangeCapture = ( e ) =>{
    /*Selected files data can be collected here.*/
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      console.log("Image mime type is not valid");
      return;
    }
    setFileImage(file);
  };

  const onFileSfondoChangeCapture = ( e ) =>{
    /*Selected files data can be collected here.*/
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFileSfondo(file);
  };

  useEffect(() => {
    let fileReader, isCancel = false;
    if (fileImage) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileImageURL(result)
        }
      }
      fileReader.readAsDataURL(fileImage);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [fileImage]);

  useEffect(() => {
    let fileReader, isCancel = false;
    if (fileSfondo) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileSfondoURL(result)
        }
      }
      fileReader.readAsDataURL(fileSfondo);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [fileSfondo]);



    const handleChangeTabs = (event, newValue) => {
      setValue(newValue);
    };

    const [windowSize, setWindowSize] = useState(getWindowSize());


    function getWindowSize() {
      const {innerWidth, innerHeight} = window;
      return {innerWidth, innerHeight};
    }

    async function confermaModificaFotoSfondo(){      
      if(!currentAccount || !username || !email || !immagineProfiloLocale || !fileSfondoURL)
      {
        setAlertText("Inserisci l'immagine di sfondo!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      setFlipSfondo(true)
      let newProfile={id:currentAccount,username:username,email:email,img:immagineProfiloLocale,sfondo:fileSfondoURL,descrizione:descrizione,disponibilita:allEvents}
      setUserDetails(newProfile)
    }

    async function confermaModificaFotoProfilo(){   
      if(!currentAccount || !username || !email || !fileImageURL || !immagineSfondo)
      {
        setAlertText("Inserisci l'immagine di profilo!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }   
      setFlipImage(true)
      let newProfile={id:currentAccount,username:username,email:email,img:fileImageURL,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:allEvents}
      setUserDetails(newProfile)
    }

    async function confermaModificaUsername(){
      if(!currentAccount || !newUsername || !email || !immagineProfiloLocale || !immagineSfondo)
      {
        setAlertText("Inserisci l'username!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      let newProfile={id:currentAccount,username:newUsername,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:allEvents}
      setUserDetails(newProfile)
    }

    async function confermaModificaEmail(){
      if(!currentAccount || !username || !email || !newEmail || !immagineSfondo || !newDescrizione)
      {
        setAlertText("Inserisci l'email!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      let newProfile={id:currentAccount,username:username,email:newEmail,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:allEvents}
      setUserDetails(newProfile)
    }

    async function confermaModificaDescrizione(){
      if(!currentAccount || !username || !email || !newEmail || !immagineSfondo || !newDescrizione)
      {
        setAlertText("Inserisci l'email!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      let newProfile={id:currentAccount,username:username,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:newDescrizione,disponibilita:allEvents}
      setUserDetails(newProfile)
    }

    async function modificaRecensione()
    {
      if(!titolo || !voto || !testo)
      {
        setAlertText("Inserisci tutti i campi!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      setCaricamento("true")
      const recensione={creatore:currentAccount,titolo:titolo,testo:testo,voto:voto,recensito:id.userid};
      let hash
      try {
          let options={
              warpWithDirectory:true,
          }
          const result = await client.add(JSON.stringify({ recensione }),options)
          hash = result.path
      } catch (error) {
        setAlertText("ipfs change error: ",error)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")
      }
      await (await contractRecensioni.modificaRecensione(hashRecensione,hash).catch((err)=>{
        setAlertText(err.code)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")
        })).wait()
        await loadRecensioniUtente(id.userid)
        setAlertText("Recensione modificata con successo!")
        setOpen(true)
        setSeverity("success")
        setCaricamento("false")
        setHashRecensione(hash)
      
    }

    async function eliminaRecensione()
    {
      setCaricamento("true")
      await (await contractRecensioni.eliminaRecensione(idRecensione).catch((err)=>{
        setAlertText(err.code)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")})).wait()
        await loadRecensioniUtente(id.userid);
        setRecensionePresente(false)
        setAlertText("Recensione eliminata con successo!")
        setOpen(true)
        setSeverity("success")
        setCaricamento("false")
    }

    const renderDayContents = (day, date) => {
      if(date < minDate || date > maxDate){
        return <span></span>;
      }
      return <span>{date.getDate()}</span>;
    };

    const filterPassedTime = (time) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

    const filterPassedTimeFromStart = (time) => {
      const currentDate = startDate;
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

    function inserisciData()
    {
       
      let data={id:counter+1,start:startDate,end:endDate,title:"Disponibile"};
      if(!data || !data.start || !data.end) return; 
      if(nuoveDate) 
      {       
        var x=nuoveDate.map((nuovaData)=>{if(nuovaData.start==data.start || nuovaData.end==data.end) {return 0}})
        if(x.includes(0)) return;
      }
       if(!nuoveDate || nuoveDate=={}) setNuoveDate(data) 
       else setNuoveDate( arr => [...arr, data]);
      setCounter(counter+1)
    }

    function inserisciDate()
    {
       

        if(!nuoveDate || nuoveDate=={}) return;
        if(!disponibilita || disponibilita=={}) setDisponibilita(nuoveDate)
        else {
          let appoggio=[]
          nuoveDate.map((data)=>{
            if(data) appoggio.push(data)
          })
          allEvents.map((data)=>{
            if(data) appoggio.push(data)
          })
          setDisponibilita( appoggio)
        }
    }



    function rimuoviData(id)
    {
       

      setNuoveDate(nuoveDate.filter(item => item.id !== id));
    }

    function confermaPrenotazione()
    {
       
      let appoggio=allEvents;
      appoggio.map((disponibilita)=>{
        if(disponibilita.id==evento.id)
        {
          disponibilita.title="Lezione all'user "+currentAccount
          disponibilita.prenotante=currentAccount
        }
      })
      let newProfile={id:id.userid,username:username,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:appoggio}
      setUserDetails(newProfile)
    }
    function rimuoviPrenotazione()
    {
       
      let appoggio=allEvents;
      appoggio.map((disponibilita)=>{

        if(disponibilita.id==evento.id)
        {
          disponibilita.title="Disponibile"
          disponibilita.prenotante=""
        }
      })
      let newProfile={id:id.userid,username:username,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:appoggio}
      setUserDetails(newProfile)
      setAllEvents(appoggio)
    }

    function rimuoviDisponibilita()
    {
      let  nuovaDisponibilita=allEvents;
      nuovaDisponibilita=nuovaDisponibilita.filter(e=>e.id!=evento.id)

      let newProfile={id:currentAccount,username:username,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:descrizione,disponibilita:nuovaDisponibilita}
      setUserDetails(newProfile)
      setAllEvents(nuovaDisponibilita)
    }

    useEffect(()=>{
       

      if(!disponibilita || disponibilita=={} || Object.keys(disponibilita).length === 0) {}else
{  
      
          let newProfile={id:currentAccount,username:username,email:email,img:immagineProfiloLocale,sfondo:immagineSfondo,descrizione:newDescrizione,disponibilita:disponibilita}
          setAllEvents(disponibilita);

          setUserDetails(newProfile)
          setNuoveDate([])
          setDisponibilita([])}
    },[disponibilita])



    const handleSelectEvent = useCallback(
      (event) => {
        if(currentAccount!=id.userid ) 
      {        
        if(event.title=="Disponibile")
        {          
          setEvento(event)       
          return clickPrenota.current.click()
        }
        else if(event.prenotante==currentAccount)
        {
          setEvento(event)       
          return clickRimuovi.current.click()
        }
      }else{
        setEvento(event)       
        return clickRimuoviDisponibilita.current.click()
      }
      },
      []
    )
    

    useEffect(()=>{
      const fetchData=async()=>{
         

        await uploadCambimentiProfilo();

      }
      if(userDetails) fetchData();
    },[userDetails])
  return (
    <>
    {isConnected ?(
    <>
          {
            caricamento=="true"?(
            <Loader chiamante="profilo"/>              
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
    <div className="container">
    {currentAccount!=id.userid?(

  <header  style={{backgroundImage:`url(${immagineSfondo})`}}  className="noHover">
  </header>
    ):(  
    
 <header data-bs-toggle="modal" data-bs-target="#immagineSfondo" style={{ backgroundImage: `url(${immagineSfondo})` }}>
                </header>)}
                <div className="modal fade" id="immagineSfondo" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
 <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Cambio foto sfondo</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bodyModale">
                          <img src={fileSfondoURL} className="photoModale" alt="nessuna immagine scelta"></img>
                        </div>
                        <div class="modal-footer">
                          <button type="button" className="btnAnnulla" onClick={()=>setFileSfondoURL("")}>Reset</button>
                          {!fileSfondoURL ? (<button type="button" className="btnRecensione"  onClick={() => inputSfondoRef.current.click()}>Scegli foto...</button>) :
                            (<button type="button" data-bs-dismiss="modal" className="btnRecensione" onClick={() => confermaModificaFotoSfondo()}>Conferma</button>)}
                          <input type="file" className="d-none" ref={inputSfondoRef} onChangeCapture={onFileSfondoChangeCapture}></input>
                        </div>
                      </div>
                    </div>
                  </div>

  <main>
    <div className="row">
      <div className="left">
      {
                  currentAccount==id.userid?(
          <img className="photo" src={immagineProfiloLocale} data-bs-toggle="modal" data-bs-target="#staticBackdrop" />):
          (<img className="photo noHover" src={immagineProfiloLocale} />)
      }
          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Cambio foto profilo</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body bodyModale">
                <img src={fileImageURL} className="photoModale" alt="nessuna immagine scelta" ></img>
              </div>
              <div class="modal-footer">
                <button type="button" className="btnAnnulla"  onClick={()=>setFileImageURL("")}>Reset</button>
                {!fileImageURL?(<button type="button" className="btnRecensione" onClick={()=>inputImageRef.current.click()}>Scegli foto...</button>):
                (<button type="button" className="btnRecensione " data-bs-dismiss="modal" onClick={()=>confermaModificaFotoProfilo()}>Conferma</button>)}
                <input type="file" className="d-none"  ref={inputImageRef} onChangeCapture={onFileImageChangeCapture}></input>
              </div>
            </div>
          </div>
        </div>

            {currentAccount==id.userid?(<>
            <p data-bs-toggle="modal" data-bs-target="#modalUsername" className="activeMouseHover">Username: {username} ✏ </p>
            <div className="modal fade" id="modalUsername" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Cambio username</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bodyModale">
                  <input type="text"  value={newUsername} onChange={(event) => setNewUsername(event.currentTarget.value)} ></input>
                </div>
                <div class="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                  <button type="button" className="btnRecensione" data-bs-dismiss="modal" onClick={()=>confermaModificaUsername()}>Conferma</button>
                </div>
              </div>
            </div>
          </div>

          <p data-bs-toggle="modal" data-bs-target="#modalEmail" className="activeMouseHover">Email: {email} ✏ </p>
            <div className="modal fade" id="modalEmail" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Cambio email</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bodyModale">
                  <input type="text"  value={newEmail} onChange={(event) => setNewEmail(event.currentTarget.value)} ></input>
                </div>
                <div class="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                  <button type="button" className="btnRecensione" data-bs-dismiss="modal" onClick={()=>confermaModificaEmail()}>Conferma</button>
                </div>
              </div>
            </div>
          </div>
            </>):(<> <h4 className="name">{username}</h4> <p className="info">{email}</p></>)}




        <div className="stats row">
          <div className="stats" >
            <p className="desc"> Number of reviewer: {numRecensioni}</p>
            {!votoMedio?(<p className="desc">Average rating: 0⭐</p>):(<p className="desc">Average rating: {votoMedio}⭐</p>)}

          </div>
        </div>
            {currentAccount==id.userid?(<>
            
          <p data-bs-toggle="modal" data-bs-target="#modalDescrizione" className="desc activeMouseHover"> {descrizione} ✏ </p>
            <div className="modal fade" id="modalDescrizione" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Cambio descrizione</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bodyModale">
                  <textarea maxlenght="70" value={newDescrizione} onChange={(event) => setNewDescrizione(event.currentTarget.value)} />
                </div>
                <div class="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                  <button type="button" className="btnRecensione" data-bs-dismiss="modal" onClick={()=>confermaModificaDescrizione()}>Conferma</button>
                </div>
              </div>
            </div>
          </div>
            
            </>):(<p className="desc">{descrizione}</p>)}

      </div>
      <div className="right col-lg-12">
        <ul className="nav">
          <Tabs value={value} onChange={handleChangeTabs} textColor="primary"
                          indicatorColor="primary" aria-label="primary tabs example" centered={windowSize.innerWidth<500?(false):(true)} className="tabs">
                          <Tab label="Corsi creati📖" {...a11yProps(0)} />
                          <Tab label="Recensioni🗣" {...a11yProps(1)} />
                          <Tab label="Calendarario📅" {...a11yProps(2)} />
                      </Tabs>
        </ul>
        <TabPanel value={value} index={0}>
                  <div className="row gallery">
                          {corsiUtente.map((corso) => {
                    return (      
                        <CardMini item={corso.content}/>
                    )
                  })}

                  </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
                    {
                      currentAccount==id.userid?(<></>):(
                      recensionePresente==true?(<>
                      <button data-bs-toggle="modal" className="btnRecensione" data-bs-target="#modalRecensione">Modifica recensione</button>
                      <button data-bs-toggle="modal" data-bs-target="#modalEliminaRecensione" className="btnEliminaRecensione">Elimina recensione</button>
                      </>):
                      (<button className="btnRecensione" data-bs-toggle="modal" data-bs-target="#modalRecensione">Lascia una recensione...</button>)
                      )         
                    }
                      <div className="modal fade" id="modalRecensione" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="staticBackdropLabel">Recensione</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <input type="text" size={30} placeholder="Titolo recensione..." maxLength={30} value={titolo} onChange={(event) => setTitolo(event.currentTarget.value)} />
                              <textarea className="recensione "type="text" placeholder="Uno splendido insegnante, durante il corso..." value={testo} onChange={(event) => setTesto(event.currentTarget.value)} />
                              <Rating
                                      name="simple-controlled"
                                      value={voto}
                                      onChange={(event, newValue) => {
                                          setVoto(newValue);
                                      } } />
                            </div>
                            <div class="modal-footer">
                              <button type="button" className="btnAnnulla" data-bs-dismiss="modal">Annulla</button>
                              {recensionePresente==true?
                              (<button type="button" className="btnRecensione" data-bs-dismiss="modal" onClick={()=>modificaRecensione()}>Modifica recensione</button>)
                              :(<button type="button" className="btnRecensione" data-bs-dismiss="modal" onClick={()=>salvaDati()}>Invia recensione</button>)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="modal fade" id="modalEliminaRecensione" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="staticBackdropLabel">Recensione</h5>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <p>Confermi di voler eliminare la tua recensione?</p>
                            </div>
                            <div class="modal-footer">
                              <button type="button" className="btnAnnulla" data-bs-dismiss="modal">Annulla</button>
                              <button type="button" className="btnEliminaRecensione" data-bs-dismiss="modal" onClick={()=>eliminaRecensione()}>Elimina recensione</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      { recensioni.map((recensione) => {
                            if(recensione)  return <Recensione key={recensione.content.id} item={recensione.content}/>
                            
                      })}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                  <button ref={clickPrenota} data-bs-toggle="modal" data-bs-target="#prenotazione" className="invisibile"></button>
                  <div className="modal fade" id="prenotazione" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                          <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Prenota lezione</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bodyModale">
                          <p>Sei sicuro di voler prenotare questo slot  {`${evento.start}`} to {`${evento.end}`} ?</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" className="btnAnnulla" data-bs-dismiss="modal">Annulla</button>
                            <button type="button" data-bs-dismiss="modal" className="btnRecensione" onClick={() => confermaPrenotazione()}>Conferma</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button ref={clickRimuovi} data-bs-toggle="modal" data-bs-target="#rimuoviPrenotazione" className="invisibile"></button>
                  <div className="modal fade" id="rimuoviPrenotazione" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                          <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Rimozione prenotazione</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bodyModale">
                          <p>Sei sicuro di voler rimuove la prenotazione allo slot  {`${evento.start}`} to {`${evento.end}`} ?</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" className="btnAnnulla" data-bs-dismiss="modal">Annulla</button>
                            <button type="button" data-bs-dismiss="modal" className="btnRecensione" onClick={() => rimuoviPrenotazione()}>Conferma</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button ref={clickRimuoviDisponibilita} data-bs-toggle="modal" data-bs-target="#rimuoviDisponibilita" className="invisibile"></button>
                  <div className="modal fade" id="rimuoviDisponibilita" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                          <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">Rimozione prenotazione</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body bodyModale">
                          <p>Sei sicuro di voler rimuove la disponibilità allo slot  {`${evento.start}`} to {`${evento.end}`} ?</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" className="btnAnnulla" data-bs-dismiss="modal">Annulla</button>
                            <button type="button" data-bs-dismiss="modal" className="btnRecensione" onClick={() => rimuoviDisponibilita()}>Conferma</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {currentAccount==id.userid?(<Accordion defaultActiveKey="0">
                    <Card>
                      <Card.Header>
                        <CustomToggle eventKey="0">Inserisci nuove disponibilità</CustomToggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="containerDate">
                            <DatePicker
                            wrapperClassName="datePickerCustom"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            minDate = {minDate}
                            maxDate = {maxDate}
                            renderCustomHeader = {() => <div></div>}
                            renderDayContents = {renderDayContents}
                            timeIntervals={15}
                            filterTime={filterPassedTime}
                            excludeDates={nuoveDate}
                            timeCaption="time"
                            dateFormat="dd, yyyy h:mm aa"/>
                            <p>to</p>
                            <DatePicker
                            selected={endDate}
                            wrapperClassName="datePickerCustom"
                            onChange={(date) => setEndDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            minDate = {startDate}
                            maxDate = {maxDate}
                            renderCustomHeader = {() => <div></div>}
                            renderDayContents = {renderDayContents}
                            filterTime={filterPassedTimeFromStart}
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="dd, yyyy h:mm aa"/>
                            <button onClick={()=>inserisciData()}><p>+</p></button>
                          </div>

                        </Card.Body>

                      </Accordion.Collapse>
                    </Card>
                    <Card>
                    {
                          Object.keys(nuoveDate).length !== 0?(
                            <Card.Body>
                                        <table>

                                {
                                    nuoveDate.map((data)=>{
                                      if(!data || !data.start) return
                                        //return <div className="miniData"> <p>From: {`${data.start}`}</p><p>To: {`${data.start}`}</p><button onClick={()=>rimuoviData(data.id)}><p>X</p></button></div>        
                                        return <><tr><td><p>From: {`${data.start}`}</p></td><td rowSpan={2}><button onClick={() => rimuoviData(data.id)}><p>X</p></button></td></tr><tr><td><p>To: {`${data.start}`}</p></td></tr></>       

                                      })
                                }
                                 </table> 
                                <button className="btnInserisciDate" onClick={()=>inserisciDate()}>Inserisci date</button>

                          </Card.Body>):(<></>)
                        }
                    </Card>
                  </Accordion>

                  ):(<></>)}
                  
                  <Calendar localizer={localizer} events={allEvents}  onSelectEvent={handleSelectEvent} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />

  
                  </TabPanel>
      </div>
      </div>
  </main>
</div>
</>
):(<><p>Devi loggarti per visualizzare questa pagina!</p></>)}
</>
);
}

export default Profilo2