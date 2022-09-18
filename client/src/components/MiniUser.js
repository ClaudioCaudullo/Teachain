import { useEffect,useContext,useState } from 'react'
import { MainContext } from '../context/MainContext';
import styles from '../styles/MiniUser.module.css';
import {useNavigate} from "react-router-dom";
const MiniUser = ({address}) => {

    let {loadExternalUserData }=useContext(MainContext);
    const[hash,setHash]=useState();
    const[profileImage,setProfileImage]=useState("");
    const[username,setUsername]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{

        const fetchData=async()=>{
            if(!address) return
        let x=await loadExternalUserData(address);
            setHash(x)
        }
        fetchData()
    },[])
    useEffect(()=>{
        const fetchData=async()=>{
            let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${hash}`)
            let content=await response.json();
            setProfileImage(content.userDetails.img);
            setUsername(content.userDetails.username);
    }
    fetchData()
},[hash])
  return (
    <div className={styles.miniContainerUser}>
        <img src={profileImage} onClick={()=>{navigate(`/profilo/${address}`)}} />
        <p onClick={()=>{navigate(`/profilo/${address}`)}}>{username}</p>
    </div>
  )
}

export default MiniUser