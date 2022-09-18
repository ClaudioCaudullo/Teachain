import { createContext, useState, useEffect } from "react";
import {CoursesAbi,CoursesAddress} from '../utils/constants';
import {UserDetailsAbi,UserDetailsAddress} from '../utils/constants2';
import {ReviewsAbi,ReviewsAddress} from '../utils/constants3';
import { ethers } from "ethers";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
export const MainContext = createContext();
export const MainProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [etherscanLink, setEtherscanLink] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [contractCourses, setContractCourses] = useState({})
  const [contractUserDetails,setContractUserDetails] = useState({})
  const [contractReviews,setContractReviews]= useState({})
  const [isAuth,setIsAuth]=useState()
  const[username,setUsername]=useState("");
  const[email,setEmail]=useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userCourses, setUserCourses] = useState([]);
  const [show, setShow] = useState(false);
  const [reviews,setReviews]=useState([]);
  const [profileImage,setProfileImage]=useState("");
  const [userDetails,setUserDetails]=useState();
  const [hash,setHash]=useState("");
  const [hashUtenteEsterno,setHashUtenteEsterno]=useState("");
  const [metamaskDetect,setMetamaskDetect]=useState();
  const [showErrorInHome,setShowErrorInHome]=useState("false");
  const [alertText,setAlertText]=useState("");
  const [buyedCourses,setBuyedCourses]=useState([]);
  const [openModalRegistration,setOpenModalRegistration]=useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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


  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
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
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0])
      setIsConnected(true)
      setMetamaskDetect("true")
      setIsLoading(false)
      
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
            await loadContractCourses(signer)
            await loadContractReviews(signer)
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
    loadContractCourses(signer)
    loadContractReviews(signer)
  },[hash])

  useEffect(()=>{
    if(Object.keys(contractCourses).length === 0)  return;
    loadCourses()
  },[contractCourses])

  async function loadContractCourses(signer){
    await (async()=>{
    const contract = new ethers.Contract(CoursesAddress, CoursesAbi, signer)
    setContractCourses(contract)})()
  }

  async function loadContractDettagli(signer){
    
    await (async()=>{
      
          const contract = new ethers.Contract(UserDetailsAddress,UserDetailsAbi, signer)
    setContractUserDetails(contract)})()
  }

  const loadContractReviews= async (signer) => {
    await (async()=>{
    const contract = new ethers.Contract(ReviewsAddress,ReviewsAbi, signer)
    setContractReviews(contract)})()
  }

  const loadCourses = async () => {
    if(Object.keys(contractCourses).length === 0) return;
    try{
    let results = await contractCourses.getAllCourses()
    let fetchCourses = await Promise.all(results.map(async i => {
      if(!i || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataPost = await response.json()
        let course = {
            id: i.id,
            content: metadataPost.course,
            img: metadataPost.course.img,
            author:i.creator
        }
        course.content.hash=i.hash;
        course.content.id=i.id;

        let nPurchase=await contractCourses.getNumberPurchase(course.content.id)
        let buyers=await contractCourses.getBuyer(course.content.id)

        course.content.nPurchase=nPurchase;
        course.content.buyers=buyers;
        for(let i=0;i<nPurchase;i++)
        {
          if(buyers[i].toLowerCase()==currentAccount.toLowerCase()){
            course.content.buyed=true;
            break;
          }
        }
        return course
    }))
    fetchCourses = fetchCourses.filter(e=>e)
    setCourses(fetchCourses)
  }catch(error){
    setIsLoading(false)
  }
}

useEffect(()=>{
 if(courses) loadBuyedCourses()
},[courses])

  async function loadUserCourses(userid){
    if(Object.keys(contractCourses).length === 0) return;
      let results=await contractCourses.getAllCoursesByUserId(userid)
      let fetchCourses = await Promise.all(results.map(async i=>{
        if(!i || !i.hash || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataPost = await response.json()
        let course = {
            id: i.id,
            content: metadataPost.course,
            img: metadataPost.course.img,
            author:i.creator
        }
        course.content.hash=i.hash;
        course.content.id=i.id;

        let nPurchase=await contractCourses.getNumberPurchase(course.content.id)
        let buyers=await contractCourses.getBuyer(course.content.id)

        course.content.nPurchase=nPurchase;
        course.content.buyers=buyers;
        for(let i=0;i<nPurchase;i++)
        {
          if(buyers[i].toLowerCase()==currentAccount.toLowerCase()){
            course.content.buyed=true;
            break;
          }
        }
        return course
      }))
      
      fetchCourses = fetchCourses.filter(e=>e)
      setUserCourses(fetchCourses)
  }

  async function loadBuyedCourses(){
    if(!courses) return
    let vector=courses.map((course)=>{
      for(let i=0;i<course.content.nPurchase;i++) if(course.content.buyers[i].toLowerCase()==currentAccount.toLowerCase()){
        return course
      }
    })
    vector = vector.filter(e=>e)
    setBuyedCourses(vector);
  }

  async function loadUserReviews(userid){
    if(Object.keys(contractReviews).length === 0) return;
      let results=await contractReviews.getAllReviewByUserId(userid)
      let fetchReviews = await Promise.all(results.map(async i=>{
        if(!i || !i.hash || i.hash=="-1") return;
        let response = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${i.hash}`)
        const metadataReview = await response.json()
        let Review = {
            id: i.id,
            content: metadataReview.review,
            author:metadataReview.review.creator,
            title:metadataReview.review.title,
            text:metadataReview.review.text,
            vote:metadataReview.review.vote
        }
        Review.content.hash=i.hash;
        Review.content.id=i.id;
        return Review
      }))
      setReviews(fetchReviews)
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
        setOpenModalRegistration(false)
          setShowErrorInHome(true)
          setIsLoading(false)
          onDisconnect();
          return;
      }
      await(await contractUserDetails.addUser(currentAccount,userDetails.username,userDetails.email,hash)
      .catch(
        (error)=>{
          setAlertText("Registrazione fallita: ",error.code)
          setShowErrorInHome(true)
          setOpenModalRegistration(false)
          setIsLoading(false)
          onDisconnect();
          return;
        }
      )
      ).wait()
      setShowErrorInHome(true)
      setAlertText("Registrazione effettuata con successo!!")
      setOpenModalRegistration(false)
      setHash(hash)
      setIsLoading(false)
    }

  const loadUserDetails= async()=>{
    if(!currentAccount && !hash) return
    
    if(Object.keys(contractUserDetails).length === 0) {
      onDisconnect()
      return
    };
    let results = await contractUserDetails.getUser(currentAccount)
    if(!results || results=="") {
      setOpenModalRegistration(true)
    }else{
      setOpenModalRegistration(false)
    let data = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${results}`)
    data= await data.json()
    setUsername(data.userDetails.username)
    setEmail(data.userDetails.email)
    setProfileImage(data.userDetails.img)
    setIsLoading(false)
    }
  }

  useEffect(()=>{
    if(!userDetails) return;
    const fetchData=async()=>{
    await uploadUserDetails()
    if(Object.keys(contractUserDetails).length === 0)  return;
    let productHash = await contractUserDetails.getUser(currentAccount)
    if(!productHash) return;
    let data = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${productHash}`)
    data= await data.json()
    setUsername(data.userDetails.username)
    setEmail(data.userDetails.email)
    setProfileImage(data.userDetails.img)
    setIsLoading(false)
  }
    fetchData()
  
},[userDetails])

async function getUserImage(id)
{
  if(Object.keys(contractUserDetails).length === 0) return;
  let results = await contractUserDetails.getUser(id)
  if(!results) return "fail"
  let data = await fetch(`https://learningdata.infura-ipfs.io/ipfs/${results}`)
  data= await data.json()
  return data.userDetails.img
}


  const loadExternalUserData=async(id)=>{
    if(Object.keys(contractUserDetails).length === 0) return;
    let results = await contractUserDetails.getUser(id)
    setHashUtenteEsterno(results)
    return results
  }


  return (
    <MainContext.Provider
      value={{
        courses,
        setTokenAmount,
        tokenAmount,
        amountDue,
        setAmountDue,
        isLoading,
        setIsLoading,
        setEtherscanLink,
        etherscanLink,
        currentAccount,
        contractCourses,
        loadCourses,
        isAuth,
        setIsAuth,
        loadUserDetails,
        username,
        email,
        isConnected,
        onConnect,
        onDisconnect,
        contractCourses,
        contractUserDetails,
        loadUserCourses,
        userCourses,
        getUserImage,
        show,
        handleClose,
        loadUserReviews,
        reviews,
        contractReviews,
        profileImage,
        hash,
        setHash,
        detectAccount,
        loadExternalUserData,
        hashUtenteEsterno,
        setHashUtenteEsterno,
        metamaskDetect,
        showErrorInHome,
        alertText,
        buyedCourses,
        openModalRegistration,
        setOpenModalRegistration,
        setUserDetails,
        onDisconnect,
        setProfileImage,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
