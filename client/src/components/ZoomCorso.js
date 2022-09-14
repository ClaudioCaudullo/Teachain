import React,{useContext,useEffect,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { MainContext } from '../context/MainContext';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import { ethers } from "ethers";
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import styles from "../styles/ZoomCorso.module.css"
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import MiniUtente from './MiniUtente';
import "../styles/Colors.css"

const ZoomCorso = () => {
    let {currentAccount,contractCorsi,loadCorsi,immagineProfilo}=useContext(MainContext);
    const [titolo,setTitolo]=useState();
    const [prezzo,setPrezzo]=useState();
    const [durata,setDurata]=useState();
    const [descrizione,setDescrizione]=useState();
    const [creatore,setCreatore]=useState();
    const [username,setUsername]=useState();
    const [banner,setBanner]=useState();
    const [file,setFile]=useState();
    const [idCorso,setIdCorso]=useState();
    const [caricamento,setCaricamento]=useState("false");
    const [alert,setAlert]=useState("false");
    const [severity,setSeverity]=useState();
    const [alertText,setAlertText]=useState("");
    const [materia,setMateria]=useState("");
    const [secondaria,setSecondaria]=useState("");
    const [tagPrimaria,setTagPrimaria]=useState("");
    const [tagSecondaria,setTagSecondaria]=useState("");
    const [acquistato,setAcquistato]=useState(false);
    const [linkAcquisto,setLinkAcquisto]=useState("");
    const [modifica,setModifica]=useState(false);
    const [acquirenti,setAcquirenti]=useState();
    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    let params=useParams();
    const inputFileRef = React.useRef();
    let navigate=useNavigate();
    const onFileChangeCapture = ( e ) =>{
        /*Selected files data can be collected here.*/
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
          alert("Image mime type is not valid");
          return;
        }
        setFile(file);
      };
      useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
          fileReader = new FileReader();
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result && !isCancel) {
              setBanner(result)
            }
          }
          fileReader.readAsDataURL(file);
        }
        return () => {
          isCancel = true;
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
        }
    
      }, [file]);

      function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('apri/chiudi'),
      );
        return (
          <button
            type="button"
            className={styles.bottoniSecondari}
            onClick={decoratedOnClick}
            >
            {children}
          </button>
        );
      }
    const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6';   // <---------- your Infura Project ID
    const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  // <---------- your Infura Secret
    // (for security concerns, consider saving these values in .env files)
    
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  
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
    
    const client = ipfsHttpClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });

    useEffect( ()=>{
        if(currentAccount) {
          const fetchData=async()=>{
            setCaricamento("true")
            let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${params.id}`)
           let risposta = await response.json();
          if(risposta){
          setBanner(risposta.corso.img)
          setTitolo(risposta.corso.titolo)
          setDurata(risposta.corso.durata)
          setPrezzo(risposta.corso.prezzo)
          setDescrizione(risposta.corso.descrizione)
          setCreatore(risposta.corso.creatore)
          setUsername(risposta.corso.username)
          setMateria(risposta.corso.materia)
          setSecondaria(risposta.corso.secondaria)
          let id=await(contractCorsi.getCorsoByHash(params.id))
          setIdCorso(id)
    }else{
            setTitolo("")
            setDurata("")
            setPrezzo("")
            setDescrizione("")
            setBanner("")
            setCreatore("")
            setUsername("")
          }
          setCaricamento("false")
        }
    
          fetchData()
          .catch((error)=>{
            setAlertText("error on course loading: ",error.message)
            setOpen(true)
            setSeverity("error")
            setCaricamento("false")
          })
        }
      },[currentAccount,params])

      useEffect(()=>{

        const fetchData=async()=>{
        if(idCorso) {
          let result2=await contractCorsi.getAcquirenti(idCorso)
          setAcquirenti(result2)
          result2.map((acquirente)=>{
            if(acquirente.localeCompare(currentAccount)) 
            {
              setAcquistato(true)
            }
          })
        }
      }
      fetchData()
      },[idCorso])

      useEffect(()=>{
        const fetchData=async()=>{
          if(acquistato) {
            let link=await contractCorsi.getAcquisto(idCorso)
            setLinkAcquisto(link)
          }
        }
        fetchData()

      })

    async function modificaCorso()
    {
      if(!creatore||!titolo||!prezzo||!durata||!descrizione||!banner||!materia){
        setAlertText("Inserisci tutti i campi!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
        return;
      }
      setCaricamento("true")
    let corso={creatore:creatore,titolo:titolo,prezzo:prezzo,durata:durata,descrizione:descrizione,img:banner,materia:materia,secondaria:secondaria,immagineProfilo:immagineProfilo,username:username};
    let hash
    try {
        let options={
            warpWithDirectory:true,
        }
        const result = await client.add(JSON.stringify({ corso }),options)
        hash = result.path
    } catch (error) {
      setAlertText("ipfs change error: ",error)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")
    }
    // upload post to blockchain
    await (await contractCorsi.modificaCorso(params.id,hash).catch((err)=>{
      setAlertText(err.code)
      setOpen(true)
      setSeverity("error")
      setCaricamento("false")})).wait()
      await loadCorsi()
      setAlertText("Corso modificato con successo!")
      setOpen(true)
      setSeverity("success")
      setCaricamento("false")
    }

    async function attesaMetamask(provider,hash)
    {
      setCaricamento("true")
      await provider.waitForTransaction(hash.hash)      .catch((error)=>{
        setAlertText(error.message)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")
      })
      .then(async ()=>{
      await(await(contractCorsi.addAcquisto(idCorso,currentAccount,""+hash.hash)      .catch((error)=>{
        setAlertText(error.message)
        setOpen(true)
        setSeverity("error")
        setCaricamento("false")
      }))).wait()

        await loadCorsi()
        let link=await contractCorsi.getAcquisto(idCorso);
        setLinkAcquisto(link)
        let result=await contractCorsi.getNumeroAcquisti(idCorso)
        let result2=await contractCorsi.getAcquirenti(idCorso)
        setAcquistato(true)
        setAlertText("Corso acquistato con successo!")
        setOpen(true)
        setSeverity("success")
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
      to:creatore,
      value: ethers.utils.parseEther(""+(prezzo/body.price).toFixed(5))
    }).then((hash)=>attesaMetamask(provider,hash));
  
  
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
  let x=await contractCorsi.getCorsoByHash(params.id)
  if(x=="-1") {
    setAlertText("Non esiste un corso con questo hash")
    setOpen(true)
    setSeverity("error")
    setCaricamento("false")
    return;
  }
  await (await contractCorsi.eliminaCorso(x).catch((err)=>{
    setAlertText(err.code)
    setOpen(true)
    setSeverity("error")
    setCaricamento("false")})).wait()
    await loadCorsi();
    setAlertText("Corso eliminato con successo!")
    setOpen(true)
    setSeverity("success")
    setTimeout(()=>{
      navigate("/home")
    },3000)
    setCaricamento("false")

}

useEffect(()=>{
  let tag;

  tag=materia.toLowerCase()
  tag=tag.replace(/ /g,"")
  tag=tag.replace("(","")
  tag=tag.replace(")","")
  tag=tag.replace(".","")
  setTagPrimaria(tag)
},[materia])


useEffect(()=>{
  let tag;
  tag=secondaria.toLowerCase()
  tag=tag.replace(/ /g,"")
  tag=tag.replace("(","")
  tag=tag.replace(")","")
  tag=tag.replace(".","")
  setTagSecondaria(tag)
},[secondaria])

useEffect(()=>{
  console.log("tagprimaria",tagPrimaria)
},[tagPrimaria])


  return (
    <div>
                {
            caricamento=="true"?(
            <Loader chiamante="corso" />              
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
          {modifica==true?(<div className={styles.container}>   

 
<div className={styles.main}>
<input type="file" className="d-none" ref={inputFileRef} onChangeCapture={onFileChangeCapture}></input>
<img  className={styles.banner} src={banner} alt="Banner corso" onClick={()=>inputFileRef.current.click()}/>
 <input className='form-control mb-4' type="text" placeholder="titolo" value={titolo} onChange={(event) => setTitolo(event.currentTarget.value)}/>
  <div className={styles.riga}>
  <p>€</p>
  <input className='form-control mb-4' type="number" placeholder="10€" step=".5" value={prezzo} onChange={(event) => setPrezzo(event.currentTarget.value)}/>
  </div>
  <input className='form-control mb-4' type="text" placeholder="durata" size="50" value={durata} onChange={(event) => setDurata(event.currentTarget.value)}/>
  <textarea class="form-control" spellcheck="false" id="exampleFormControlTextarea1" name="descrizioneCorso" placeholder="Il corso tratterà..."  value={descrizione} rows="3" onChange={(event) => setDescrizione(event.currentTarget.value)}/>
  <select value={materia} name="materia" id="materia" onChange={(event) => setMateria(event.currentTarget.value)}>
    <option value="English">english</option>
    <option value="math">math</option>
    <option value="art">art</option>
    <option value="science">science</option>
    <option value="history">history</option>
    <option value="music">music</option>
    <option value="geography">geography</option>
    <option value="P.E (Physical Education)">P.E (Physical Education)</option>
    <option value="drama">drama</option>
    <option value="biology">biology</option>
    <option value="chemistry">chemistry</option>
    <option value="physics">physics</option>
    <option value="I.T (Information Technology)">I.T (Information Technology)</option>
    <option value="foreign languages">foreign languages</option>
    <option value="social studies">social studies</option>
    <option value="technology">technology</option>
    <option value="philosophy">philosophy</option>
    <option value="graphic design">graphic design</option>
    <option value="literature">literature</option>
    <option value="algebra">algebra</option>
    <option value="geometry">geometry</option>
  </select>
    <select value={secondaria} name="secondaria" id="secondaria" onChange={(event) => setSecondaria(event.currentTarget.value)}>
    <option value="">nessuna</option>
    <option value="English">english</option>
    <option value="math">math</option>
    <option value="art">art</option>
    <option value="science">science</option>
    <option value="history">history</option>
    <option value="music">music</option>
    <option value="geography">geography</option>
    <option value="P.E (Physical Education)">P.E (Physical Education)</option>
    <option value="drama">drama</option>
    <option value="biology">biology</option>
    <option value="chemistry">chemistry</option>
    <option value="physics">physics</option>
    <option value="I.T (Information Technology)">I.T (Information Technology)</option>
    <option value="foreign languages">foreign languages</option>
    <option value="social studies">social studies</option>
    <option value="technology">technology</option>
    <option value="philosophy">philosophy</option>
    <option value="graphic design">graphic design</option>
    <option value="literature">literature</option>
    <option value="algebra">algebra</option>
    <option value="geometry">geometry</option>
  </select> 
  <div className={styles.bottoni}> 
  <button className={styles.btnSpettatore}onClick={()=>setModifica(false)}>Torna alla modalità spettatore</button>
  <div className={styles.noStyle}>

<button  data-bs-toggle="modal" data-bs-target="#modalModifica" className={styles.btnModifica}>Applica modifiche</button>
  <div className="modal fade" id="modalModifica" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Modica corso</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Applicare definitivamente le modifiche?</p>
      </div>
      <div class="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
        <button type="button" className={`btn ${styles.btnConfermaModifica}`} data-bs-dismiss="modal" onClick={()=>modificaCorso()}>Conferma</button>
      </div>
    </div>
  </div>
</div>
<button  data-bs-toggle="modal" data-bs-target="#modalElimina" className={styles.btnElimina}>Elimina</button>
<div className="modal fade" id="modalElimina" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="staticBackdropLabel">Elimina corso</h5>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p>Sei sicuro di voler eliminare il corso?</p>
    </div>
    <div class="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
      <button type="button" className={`btn ${styles.btnConfermaElimina}`} data-bs-dismiss="modal" onClick={()=>eliminaCorso()}>Elimina</button>
    </div>
  </div>
</div>
</div>
</div>

</div>
</div>
</div>):(<>

  <div className={styles.container}>
            <img className={styles.banner} src={banner} alt="Banner corso"/>
            <div className={styles.main}>
              
            <span className={styles.titolo}>{titolo}</span>
            <div class="row justify-content-around align-items-center" >
            <div class="col-sm-5 offset-md-1">

            <div className={`card border-dark mb-3 `} style={{ maxWidth: "18rem"}}>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" onClick={()=>{navigate(`/profilo/${creatore}`)}}>Un corso di: {username}</li>
              <li class="list-group-item">Durata: {durata}</li>
              <li class="list-group-item">Prezzo: €{prezzo}</li>
            </ul>
            </div>

              </div>

              <div class="col-sm-5 offset-md-1">
                <div class="col-sm-8 mb-2">
                  <div className={`card mb-2 ${styles.rounded}`}>
                    <div className={`card-body text-center ${tagPrimaria} ${styles.rounded}`}>
                      <span style={{color:"white"}}>Materia: {materia}</span>
                    </div>
                </div>
                </div>

              

                {secondaria?(
                 <div class="col-sm-8 ">
                  <div className={`card ${styles.rounded}`}>
                  <div className={`card-body text-center ${tagSecondaria} ${styles.rounded}`}>
                  <span style={{color:"white"}}>Secondaria: {secondaria}</span>
                  </div>
                </div>
                </div>
                
                ):(<></>)}
                                </div>

                              </div>


              <p className={styles.descrizione}>{descrizione}</p>
              {
                currentAccount==creatore?(<>
                    <Accordion defaultActiveKey="0">
                    <Card>
                      <Card.Header>
                        <CustomToggle eventKey="0">Utenti che hanno acquistato il corso</CustomToggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className={styles.containerAcquirenti}>
                              {
                                acquirenti?(
                                  acquirenti.map((acquirente)=>{
                                  if(acquirente)return <MiniUtente indirizzo= {acquirente}/>
                                }
                                )):(<p>Nessun acquirente</p>)
                              }
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                <button className={styles.buttonCompra} onClick={()=>setModifica(true)}>Modifica corso</button>
                </>
                ):(              
                    acquistato==false?(
                    <button className={styles.buttonCompra} onClick={()=>buyCorso()}>Acquista corso</button>)
                    :(<a href={(`https://goerli.etherscan.io/tx/${linkAcquisto}`)} target="_blank">Dettagli acquisto✅</a>)
                  )
              }
            </div>
        </div>  
</>)}
    </div>
  )
}

export default ZoomCorso