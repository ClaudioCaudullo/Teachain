import React from "react";
import { createContext, useState, useEffect } from "react";
import { flushSync } from 'react-dom';

import {CorsiAbi,CorsiAddress} from '../utils/constants';
import {UserDetailsAbi,UserDetailsAddress} from '../utils/constants2';
import {RecensioniAbi,RecensioniAddress} from '../utils/constants3';
import { ethers } from "ethers";
import image from '../defaultimage.js';
import sfondo from '../defaultSfondo.js';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import { CollectionsBookmarkOutlined, WindowSharp } from "@mui/icons-material";
import { id } from "ethers/lib/utils";
export const MainContext = createContext();
export const MainProvider = ({ children }) => {
  const [corsi, setCorsi] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [etherscanLink, setEtherscanLink] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [contractCorsi, setContractCorsi] = useState({})
  const [contractUserDetails,setContractUserDetails] = useState({})
  const [contractRecensioni,setContractRecensioni]= useState({})
  // const [contractPurchase,setContractPurchase] = useState({})
  const [isAuth,setIsAuth]=useState()
  const[username,setUsername]=useState("");
  const[email,setEmail]=useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [corsiUtente, setCorsiUtente] = useState([]);
  const [show, setShow] = useState(false);
  const [recensioni,setRecensioni]=useState([]);
  const [immagineProfilo,setImmagineProfilo]=useState("");
  const [userDetails,setUserDetails]=useState();
  const [hash,setHash]=useState("");
  const [hashUtenteEsterno,setHashUtenteEsterno]=useState("");
  const [metamaskDetect,setMetamaskDetect]=useState();
  const [showErrorInHome,setShowErrorInHome]=useState("false");
  const [alertText,setAlertText]=useState("");
  const [corsiComprati,setCorsiComprati]=useState([]);
  const [apriModaleRegistrazione,setApriModaleRegistrazione]=useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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


  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      setMetamaskDetect("false")
      setIsLoading(false)
      return;
    }
    setMetamaskDetect("true")
    setIsLoading(false)
    return provider;
  };

  useEffect(() => {
      const userData = localStorage.getItem('userAccount');
      if (userData != null && !currentAccount) {
        detectAccount()
      }
  }, []);

  const onDisconnect = () => {
    setIsConnected(false);
    setCurrentAccount(null);
    localStorage.clear()
  };

  useEffect(()=>{    
    if(currentAccount) onConnect();
  },[currentAccount])

  const detectAccount= async()=>{
    setIsLoading(true)
    const currentProvider = detectCurrentProvider();
    if (currentProvider) {
      if (currentProvider !== window.ethereum) {
        setMetamaskDetect("false")
        setIsLoading(false)
        return;
      }
      try{
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0])
      setIsConnected(true)
      setMetamaskDetect("true")
      setIsLoading(false)
      }catch(error)
      {
        window.location.reload(false);
      }
    }
}

useEffect(() => {
  if(window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      detectAccount()
    })
}
},[])

  const onConnect = async () => {
    try {
      setIsLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer =  provider.getSigner()
            await loadContractDettagli(signer)
            await loadContractCorsi(signer)
            await loadContractRecensioni(signer)
            setIsLoading(false)
            localStorage.setItem('userAccount',currentAccount)
    } catch (err) {
        setAlertText('There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'+err.code+" "+err.message)
        setIsLoading(false)
      setShow(true);
    }
    setShow(false);
  };

  useEffect(()=>{
    if(contractUserDetails && Object.keys(contractUserDetails).length!=0) loadUserDetails()
  },[contractUserDetails])

  useEffect(()=>{
    if(!hash) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer =  provider.getSigner()
    loadContractCorsi(signer)
    loadContractRecensioni(signer)
  },[hash])

  useEffect(()=>{
    if(Object.keys(contractCorsi).length === 0)  return;
    loadCorsi()
  },[contractCorsi])

  async function loadContractCorsi(signer){
    await (async()=>{
    const contract = new ethers.Contract(CorsiAddress, CorsiAbi, signer)
    setContractCorsi(contract)})()
  }

  async function loadContractDettagli(signer){
    
    await (async()=>{
      
          const contract = new ethers.Contract(UserDetailsAddress,UserDetailsAbi, signer)
    setContractUserDetails(contract)})()
  }

  const loadContractRecensioni = async (signer) => {
    await (async()=>{
    const contract = new ethers.Contract(RecensioniAddress,RecensioniAbi, signer)
    setContractRecensioni(contract)})()
  }

  const loadCorsi = async () => {
    if(Object.keys(contractCorsi).length === 0) return;
    try{
    let results = await contractCorsi.getAllCorsi()
    let fetchCorsi = await Promise.all(results.map(async i => {
      if(!i || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataPost = await response.json()
        let corso = {
            id: i.id,
            content: metadataPost.corso,
            img: metadataPost.corso.img,
            author:i.creatore
        }
        corso.content.hash=i.hash;
        corso.content.id=i.id;

        let nAcquisti=await contractCorsi.getNumeroAcquisti(corso.content.id)
        let acquirenti=await contractCorsi.getAcquirenti(corso.content.id)

        corso.content.nAcquisti=nAcquisti;
        corso.content.acquirenti=acquirenti;
        for(let i=0;i<nAcquisti;i++)
        {
          if(acquirenti[i].toLowerCase()==currentAccount.toLowerCase()){
            corso.content.comprato=true;
            break;
          }
        }
        return corso
    }))
    fetchCorsi = fetchCorsi.filter(e=>e)
    setCorsi(fetchCorsi)
  }catch(error){
    setIsLoading(false)
  }
}

useEffect(()=>{
 if(corsi) loadCorsiAcquistati()
},[corsi])

  async function loadCorsiUtente(userid){
    if(Object.keys(contractCorsi).length === 0) return;
      let results=await contractCorsi.getAllCorsiByUserId(userid)
      let fetchCorsi = await Promise.all(results.map(async i=>{
        if(!i || !i.hash || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataPost = await response.json()
        let corso = {
            id: i.id,
            content: metadataPost.corso,
            img: metadataPost.corso.img,
            author:i.creatore
        }
        corso.content.hash=i.hash;
        corso.content.id=i.id;

        let nAcquisti=await contractCorsi.getNumeroAcquisti(corso.content.id)
        let acquirenti=await contractCorsi.getAcquirenti(corso.content.id)

        corso.content.nAcquisti=nAcquisti;
        corso.content.acquirenti=acquirenti;
        for(let i=0;i<nAcquisti;i++)
        {
          if(acquirenti[i].toLowerCase()==currentAccount.toLowerCase()){
            corso.content.comprato=true;
            break;
          }
        }
        return corso
      }))
      
      fetchCorsi = fetchCorsi.filter(e=>e)
      setCorsiUtente(fetchCorsi)
  }

  async function loadCorsiAcquistati(){
    if(!corsi) return
    let vector=corsi.map((corso)=>{
      for(let i=0;i<corso.content.nAcquisti;i++) if(corso.content.acquirenti[i].toLowerCase()==currentAccount.toLowerCase()){
        return corso
      }
    })
    vector = vector.filter(e=>e)
    setCorsiComprati(vector);
  }

  async function loadRecensioniUtente(userid){
    if(Object.keys(contractRecensioni).length === 0) return;
      let results=await contractRecensioni.getAllRecensioniByUserId(userid)
      let fetchRecensioni = await Promise.all(results.map(async i=>{
        if(!i || !i.hash || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataRecensione = await response.json()
        let recensione = {
            id: i.id,
            content: metadataRecensione.recensione,
            author:metadataRecensione.recensione.creatore,
            titolo:metadataRecensione.recensione.titolo,
            testo:metadataRecensione.recensione.testo,
            voto:metadataRecensione.recensione.voto
        }
        recensione.content.hash=i.hash;
        recensione.content.id=i.id;
        return recensione
      }))
      setRecensioni(fetchRecensioni)
    }


    const uploadUserDetails = async () => {
      if (!userDetails) return
      setIsLoading(true)
      let hash
      try {
          let options={
            warpWithDirectory:true,
          }
          const result = await client.add(JSON.stringify({ userDetails }),options)
          hash = result.path
      } catch (error) {
        setAlertText("Registrazione fallita: ",error.code)
        setApriModaleRegistrazione(false)
          setShowErrorInHome(true)
          setIsLoading(false)
          onDisconnect();
          return;
      }
      await(await contractUserDetails.addUtente(currentAccount,userDetails.username,userDetails.email,hash)
      .catch(
        (error)=>{
          setAlertText("Registrazione fallita: ",error.code)
          setShowErrorInHome(true)
          setApriModaleRegistrazione(false)
          setIsLoading(false)
          onDisconnect();
          return;
        }
      )
      ).wait()
      setShowErrorInHome(true)
      setAlertText("Registrazione effettuata con successo!!")
      setApriModaleRegistrazione(false)
      setHash(hash)
      setIsLoading(false)
    }

  const loadUserDetails= async()=>{
    if(!currentAccount && !hash) return
    
    if(Object.keys(contractUserDetails).length === 0) {
      onDisconnect()
      return
    };
    let results = await contractUserDetails.getUtente(currentAccount)
    if(!results || results=="") {
      setApriModaleRegistrazione(true)
    }else{
      setApriModaleRegistrazione(false)
    let dati = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${results}`)
    dati= await dati.json()
    setUsername(dati.userDetails.username)
    setEmail(dati.userDetails.email)
    setImmagineProfilo(dati.userDetails.img)
    setIsLoading(false)
    }
  }

  useEffect(()=>{
    if(!userDetails) return;
    const fetchData=async()=>{
    await uploadUserDetails()
    if(Object.keys(contractUserDetails).length === 0)  return;
    let hashProdotto = await contractUserDetails.getUtente(currentAccount)
    if(!hashProdotto) return;
    let dati = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${hashProdotto}`)
    dati= await dati.json()
    setUsername(dati.userDetails.username)
    setEmail(dati.userDetails.email)
    setImmagineProfilo(dati.userDetails.img)
    setIsLoading(false)
  }
    fetchData()
  
},[userDetails])

async function getPhotoUtente(id)
{
  if(Object.keys(contractUserDetails).length === 0) return;
  let results = await contractUserDetails.getUtente(id)
  if(!results) return "fail"
  let dati = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${results}`)
  dati= await dati.json()
  return dati.userDetails.img
}


  const caricaDatiUtenteEsterno=async(id)=>{
    if(Object.keys(contractUserDetails).length === 0) return;
    let results = await contractUserDetails.getUtente(id)
    setHashUtenteEsterno(results)
    return results
  }


  return (
    <MainContext.Provider
      value={{
        corsi,
        setTokenAmount,
        tokenAmount,
        amountDue,
        setAmountDue,
        isLoading,
        setIsLoading,
        setEtherscanLink,
        etherscanLink,
        currentAccount,
        contractCorsi,
        loadCorsi,
        isAuth,
        setIsAuth,
        loadUserDetails,
        username,
        email,
        isConnected,
        onConnect,
        onDisconnect,
        contractCorsi,
        contractUserDetails,
        loadCorsiUtente,
        corsiUtente,
        getPhotoUtente,
        show,
        handleClose,
        loadRecensioniUtente,
        recensioni,
        contractRecensioni,
        immagineProfilo,
        hash,
        setHash,
        detectAccount,
        caricaDatiUtenteEsterno,
        hashUtenteEsterno,
        setHashUtenteEsterno,
        metamaskDetect,
        showErrorInHome,
        alertText,
        corsiComprati,
        apriModaleRegistrazione,
        setApriModaleRegistrazione,
        setUserDetails,
        onDisconnect      }}
    >
      {children}
    </MainContext.Provider>
  );
};
