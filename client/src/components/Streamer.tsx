import React, {useState, useEffect} from 'react';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Navigate, useNavigate } from 'react-router-dom';

interface videoStreamInterface {
    stream: any,
    fullName: string,
    muted: boolean,
    controls: boolean
}

const Streamer:React.FC<videoStreamInterface> = ({stream, muted, fullName, controls=false}:videoStreamInterface) => {

    const [videoMuted, setVideoMuted] = useState<Boolean>(false)
    const [audioMuted, setAudioMuted] = useState<Boolean>(false)
    const [showMuteIcon, setShowMuteIcon] = useState<Boolean>(false)
    const [showMuteTargetIcon, setShowMuteTargetIcon] = useState<Boolean>(false)

    const videoEl =  React.createRef<HTMLVideoElement>();
    let navigate=useNavigate();


    useEffect(() => {
        let video = videoEl.current;
        let showVideo = true,
            showAudio = true;

        if(video){
            if(controls){
                if(videoMuted) showVideo = false;
                if(audioMuted) showAudio = false;

                stream.getVideoTracks()[0].enabled = showVideo
                if(stream.getAudioTracks()[0]){
                    stream.getAudioTracks()[0].enabled = showAudio;
                }
            }
            


            video.srcObject = stream;
            video.onloadedmetadata = function(e) {
                if(video) {
                    video.play();
                }
            }
        }
        
    }, [videoMuted, audioMuted, controls, stream, videoEl])

    const audioHandler = () => {
        setAudioMuted(!audioMuted);
        setShowMuteIcon(!showMuteIcon)
    }

    const videoHandler = () => {
        setVideoMuted(!videoMuted);
        
    }

    function clickDisconnect()
    {
            stream['myPeer'].disconnect();
            stream['socket'].emit('userExited', stream?.id, stream['roomId']);
            navigate("/home")
    }

    function muteTarget(element:any)
    {
        element.muted=!element.muted
        setShowMuteTargetIcon(!showMuteTargetIcon)
    }

    return (
        <div className="stream-item" id={`stream-item-${stream['id']}`}>
            <h2>{fullName}</h2>
            <video ref={videoEl} muted={muted} autoPlay={true} />
            {controls && (
                <div className="stream-buttons">
                    {stream.getAudioTracks()[0] && (
                        <button type="button" onClick={audioHandler}>
                            {showMuteIcon ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
                        </button>
                    )}
                    
                    <button type="button" onClick={videoHandler}>
                        {videoMuted ? <VideocamOffRoundedIcon /> : <VideocamRoundedIcon />}
                    </button>
                    <button type="button" onClick={()=>clickDisconnect()}>
                        <LogoutIcon/>
                    </button>
                </div>
            )}

            {!controls && (
                <div className="stream-buttons">
                    
                        <button type="button" onClick={()=>muteTarget(document.getElementById(`stream-item-${stream['id']}`)?.getElementsByTagName('video')[0])}>
                            {document.getElementById(`stream-item-${stream['id']}`)?.getElementsByTagName('video')[0].muted==false ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                    
                </div>
            )}
            
        </div>
    )
}

export default Streamer
