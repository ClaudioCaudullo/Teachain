import React,{useState,useEffect,useRef,useContext} from "react";
import styles from "../styles/CreateCourse.module.css"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import { MainContext } from "../context/MainContext";
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "../styles/Colors.css"

const CreateCourse= () =>{
    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [title,setTitle]=useState();
    const [price,setPrice]=useState();
    const [duration,setDuration]=useState();
    const [description,setDescription]=useState();
    const [course,setCourse]=useState();
    const [loading,setLoading]=useState("false");
    const [alert,setAlert]=useState("false");
    const [severity,setSeverity]=useState();
    const inputFile=useRef(null);
    const [alertText,setAlertText]=useState("");
    const [subject,setSubject]=useState("english");
    const [secondary,setSecondary]=useState("");
    const [tagPrimary,setTagPrimary]=useState("english");
    const [tagSecondary,setTagSecondary]=useState("");

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

    let {currentAccount,contractCourses,setIsLoading,isConnected,loadCourses,profileImage,username }=useContext(MainContext);
    let navigate=useNavigate();
    const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6';   
    
    const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  
    
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
      let tag=subject.toLowerCase()
      tag=tag.replace(/ /g,"")
      tag=tag.replace("(","")
      tag=tag.replace(")","")
      tag=tag.replace(".","")
      setTagPrimary(tag)
    },[subject])

    useEffect(()=>{
  
      let tag=secondary.toLowerCase()
      tag=tag.replace(/ /g,"")
      tag=tag.replace("(","")
      tag=tag.replace(")","")
      tag=tag.replace(".","")
      setTagSecondary(tag)
    },[secondary])

      const uploadCourse = async () => {
        if (!course) return
        setLoading("true")
        let hash
        try {
            let options={
              warpWithDirectory:true,
            }
            const result = await client.add(JSON.stringify({ course }),options)
            setIsLoading(true)
            hash = result.path
        } catch (error) {
            setAlertText("ipfs caricamento corso errore: ",error)
            setOpen(true)
            setSeverity("error")
            setLoading("false")
            setIsLoading(false)
        }
        await (await contractCourses.addCourse(hash)
        .catch((err)=>{
          setAlertText(err.code)
          setOpen(true)
          setSeverity("error")
          setLoading("false")
          setIsLoading(false)})).wait()
        await loadCourses()
        setAlertText("Corso aggiunto con successo!")
        setOpen(true)
        setIsLoading(false)
        setSeverity("success")
        setTimeout(()=>{
          navigate("/home")
        },1500)
        setLoading("false")
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
        if(course) uploadCourse()

      },[course])

    async function saveData(){
      if(!currentAccount || !title || !price || !duration || !description || !fileDataURL || !subject)
      {
        setAlertText("Inserisci tutti i campi!")
        setOpen(true)
        setSeverity("warning")
        setLoading("false")
      }else{
        const newCourse={creator:currentAccount,title:title,price:parseFloat(price),duration:duration,description:description,img:fileDataURL,subject:subject,secondary:secondary,username:username};
        setCourse(newCourse)
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
        return (<input  className='form-control mb-4' type="text" placeholder="titolo" value={title} onChange={(event) => setTitle(event.currentTarget.value)}/>);
      case 'Prezzo':
        return(<input className='form-control mb-4' type="number" placeholder="€" step=".5" value={price} onChange={(event) => setPrice(event.currentTarget.value)}/>)
      case 'Durata stimata':
        return(<input className='form-control mb-4' type="text" placeholder="durata"  value={duration} onChange={(event) => setDuration(event.currentTarget.value)}/>) 
      case 'Descrizione':
        return(<textarea class="form-control" name="descrizioneCorso" placeholder="Il corso tratterà..." type="text" value={description} onChange={(event) => setDescription(event.currentTarget.value)}/>)  
      case 'Materia primaria':
        return(<select class="form-select"  name="materia" id="subject" onChange={(event) => setSubject(event.currentTarget.value)}>
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
        return(<select class="form-select"  name="secondaria" id="secondary" onChange={(event) => setSecondary(event.currentTarget.value)}>
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
            loading=="true"?(
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
          <Button variant="primary" onClick={()=>saveData()}>Crea Corso</Button>
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
      <span className={`${styles.tag} ${tagPrimary}`}>{subject}</span>
      {secondary?(<span className={`${styles.tag} ${tagSecondary}`}>{secondary}</span>):(<></>)}
      </div>
      <h4>
        {title}
      </h4>
      <p className="testo">
        {description}
      </p>
      <div className={styles.user}>
        <img src={profileImage}  alt="user" />
        <div className={styles.userInfo}>
          <h5>{username}</h5>
          <small>{price}€</small>
        </div>
      </div>
    </div>
  </div>
</div>
        </div></>):(<><p className="testo">Devi loggarti per visualizzare questa pagina!</p></>)}
    </>
    );
}

export default CreateCourse;