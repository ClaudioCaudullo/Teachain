import React,{useState,useEffect,useRef,useContext} from "react";
import styles from "../styles/CreaCorso.module.css"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import { MainContext } from "../context/MainContext";
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../styles/Colors.css"

const CreaCorso= () =>{
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const inputFileRef = React.useRef();
    const [titolo,setTitolo]=useState();
    const [prezzo,setPrezzo]=useState();
    const [durata,setDurata]=useState();
    const [descrizione,setDescrizione]=useState();
    const [corso,setCorso]=useState();
    const [caricamento,setCaricamento]=useState("false");
    const [alert,setAlert]=useState("false");
    const [severity,setSeverity]=useState();
    const inputFile=useRef(null);
    const [alertText,setAlertText]=useState("");
    const [materia,setMateria]=useState("english");
    const [secondaria,setSecondaria]=useState("");
    const [tagPrimaria,setTagPrimaria]=useState("english");
    const [tagSecondaria,setTagSecondaria]=useState("");

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

    let {currentAccount,contractCorsi,setIsLoading,isConnected,loadCorsi,immagineProfilo,username }=useContext(MainContext);
    let navigate=useNavigate();
    const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6';   // <---------- your Infura Project ID
    
    const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  // <---------- your Infura Secret
    // (for security concerns, consider saving these values in .env files)
    
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    
    const client = ipfsHttpClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });

    useEffect(()=>{
      let tag=materia.toLowerCase()
      tag=tag.replace(/ /g,"")
      tag=tag.replace("(","")
      tag=tag.replace(")","")
      tag=tag.replace(".","")
      setTagPrimaria(tag)
    },[materia])

    useEffect(()=>{
  
      let tag=secondaria.toLowerCase()
      tag=tag.replace(/ /g,"")
      tag=tag.replace("(","")
      tag=tag.replace(")","")
      tag=tag.replace(".","")
      setTagSecondaria(tag)
    },[secondaria])

      const [index, setIndex] = useState(0);
    
      const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
      }

      const uploadCorso = async () => {
        if (!corso) return
        setCaricamento("true")
        let hash
        // Upload post to IPFS
        try {
            let options={
              warpWithDirectory:true,
            }
            const result = await client.add(JSON.stringify({ corso }),options)
            setIsLoading(true)
            hash = result.path
        } catch (error) {
            setAlertText("ipfs corso upload error: ",error)
            setOpen(true)
            setSeverity("error")
            setCaricamento("false")
            setIsLoading(false)
        }
            
        // upload post to blockchain
        await (await contractCorsi.addCorso(hash)
        .catch((err)=>{
          setAlertText(err.code)
          setOpen(true)
          setSeverity("error")
          setCaricamento("false")
          setIsLoading(false)})).wait()
        await loadCorsi()
        setAlertText("Corso aggiunto con successo!")
        setOpen(true)
        setIsLoading(false)
        setSeverity("success")
        setTimeout(()=>{
          navigate("/home")
        },1500)
        setCaricamento("false")
      }
    
      const changeHandler = (e) => {
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
          alert("Image mime type is not valid");
          return;
        }
        setFile(file);
      }
      useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
          fileReader = new FileReader();
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result && !isCancel) {
              setFileDataURL(result)
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

      useEffect(()=>{
        if(corso)uploadCorso()

      },[corso])

    async function salvaDati(){
      if(!currentAccount || !titolo || !prezzo || !durata || !descrizione || !fileDataURL || !materia)
      {
        setAlertText("Inserisci tutti i campi!")
        setOpen(true)
        setSeverity("warning")
        setCaricamento("false")
      }else{
        const newCorso={creatore:currentAccount,titolo:titolo,prezzo:parseFloat(prezzo),durata:durata,descrizione:descrizione,img:fileDataURL,materia:materia,secondaria:secondaria,username:username};
        setCorso(newCorso)
      }
    }


    const steps = ['Titolo del corso', 'Prezzo', 'Durata stimata','Descrizione','Materia primaria','Materia secondaria','Banner'];

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 5;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function renderSwitch(stepAttuale) {
    switch(stepAttuale) {
      case 'Titolo del corso':
        return (<input  className='form-control mb-4' type="text" placeholder="titolo" value={titolo} onChange={(event) => setTitolo(event.currentTarget.value)}/>);
      case 'Prezzo':
        return(<input className='form-control mb-4' type="number" placeholder="€" step=".5" value={prezzo} onChange={(event) => setPrezzo(event.currentTarget.value)}/>)
      case 'Durata stimata':
        return(<input className='form-control mb-4' type="text" placeholder="durata"  value={durata} onChange={(event) => setDurata(event.currentTarget.value)}/>) 
      case 'Descrizione':
        return(<textarea class="form-control" name="descrizioneCorso" placeholder="Il corso tratterà..." type="text" value={descrizione} onChange={(event) => setDescrizione(event.currentTarget.value)}/>)  
      case 'Materia primaria':
        return(<select class="form-select"  name="materia" id="materia" onChange={(event) => setMateria(event.currentTarget.value)}>
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
      </select>)  
      case 'Materia secondaria':
        return(<select class="form-select"  name="secondaria" id="secondaria" onChange={(event) => setSecondaria(event.currentTarget.value)}>
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
      </select>)
      case 'Banner':
        return (<input type="file" name="file"ref={inputFile} onChange={changeHandler}/>)
        default:
        return (<></>);
    }
  }


    return(
        <>
        {isConnected?(
          <>
          {
            caricamento=="true"?(
            <Loader chiamante="corso" />              
              ):(<></>)
          }
          {
            open==true&&severity?(<>
            
            <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {alertText}
              </Alert>
            </Snackbar>
          </Stack>
            
            </>):(<></>)
          }
<div className={styles.container}>
<div className={styles.mainContainer}>
<div className={styles.container}>
<Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Button variant="primary" onClick={()=>salvaDati()}>Crea Corso</Button>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {renderSwitch(steps[activeStep])}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>

</div>
</div>

 
<div className={styles.previewContainer}>
<div className={styles.card} >
    <div className={styles.cardHeader}>
      <img src={fileDataURL} alt="immagine corso" />
    </div>
    <div className={styles.cardBody}>
      <div className={styles.cardTags}>
      <span className={`${styles.tag} ${tagPrimaria}`}>{materia}</span>
      {secondaria?(<span className={`${styles.tag} ${tagSecondaria}`}>{secondaria}</span>):(<></>)}
      </div>
      <h4>
        {titolo}
      </h4>
      <p className="testo">
        {descrizione}
      </p>
      <div className={styles.user}>
        <img src={immagineProfilo}  alt="user" />
        <div className={styles.userInfo}>
          <h5>{username}</h5>
          <small>{prezzo}€</small>
        </div>
      </div>
    </div>
  </div>
</div>
        </div></>):(<><p className="testo">Devi loggarti per visualizzare questa pagina!</p></>)}
    </>
    );
}

export default CreaCorso;