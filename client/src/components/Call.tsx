import React, {useState, useContext,useEffect, FormEvent, useMemo, useCallback} from 'react';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { NavigationType, UNSAFE_NavigationContext } from "react-router-dom";
import { History, Update } from "history";
import Peer from 'peerjs';
import {Navigate} from 'react-router-dom';
import Streamer from './Streamer';
//import io from "socket.io-client";
import Message from './Message';
import { v4 as uuidv4 } from 'uuid';

const io = require("socket.io-client/dist/socket.io")


interface ConnectParams {
    audio: boolean;
    video: boolean;
}

interface VideoStreamsInterface {
    user: string;
    stream: MediaStream;
}

const Call:React.FC = () => {
    let arrayClient:any[]=[];
    const socket = useMemo(() => io(process.env.REACT_APP_BACKEND_URL ?? ''), []);
    const myPeerUniqueID = useMemo(() => uuidv4(), []);
    const myPeer = useMemo(() => new Peer(myPeerUniqueID), [myPeerUniqueID]); 
    const [streamOptions] = useState<ConnectParams>({
        audio: true,
        video: true
    })

    const [videoStreams, setVideoStreams] = useState<any[]>([])
    const [peersArray, setPeersArray] = useState<string[]>([]);
    const [myStream, setMyStream] = useState<MediaStream>();
    const [newMessage, setNewMessage] = useState<string>('');
    const [messages, setMessages] = useState<Object[]>([]);
    const [shareScreenButtonText, setShareScreenButtonText] = useState<string>(
        'Start screen sharing'
    )
    const [fullName] = useState(localStorage.getItem('fullName') ?? 'User');
    const [roomId] = useState(localStorage.getItem('roomId') ?? false);
    const screenVideoRef =  React.createRef<HTMLVideoElement>();
    const [startSharing, setStartSharing] = useState<Boolean>(false)
    const [startSharingButtonDisabled, setStartSharingButtonDisabled] = useState<Boolean>(false)
    const [screenStream, setScreenStream] =  useState<MediaStream>();

    let sonofottutamenteconnesso=false;
    const getUserMedia = useMemo(() => {
        var n=navigator as any;
        return n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia
    }, []);

    // React.useEffect(() => {     
    //     window.onpopstate = e => {
    //         console.log("VCv")  
                             
    //         myPeer.disconnect();
            
    //     socket.emit('userExited', myStream?.id, roomId);
    //     console.log("Dati dopo userexited:",myPeerUniqueID, roomId, fullName, socket, getUserMedia, streamOptions) 
    //     sonofottutamenteconnesso=!sonofottutamenteconnesso;
    //     };   });

        


    const useBackListener = () => {
        const navigator = useContext(UNSAFE_NavigationContext).navigator as History;
      
        useEffect(() => {
          const listener = ({ location, action }: Update) => {
            if (action === NavigationType.Pop) {
            //   ()=>console.log("{ location, action }");
            myPeer.disconnect();
            socket.emit('userExited', myStream?.id, roomId);

            }
          };
      
          const unlisten = navigator.listen(listener);
          return unlisten;
        }, [ navigator]);
      };

      useBackListener();


    useEffect(() => {
        // user just opened the call page
        getUserMedia(streamOptions, function(stream:any) {
            stream['peerID']=myPeerUniqueID;
            stream['socket']=socket;
            stream['myPeer']=myPeer;
            stream['roomID']=roomId;
            setMyStream(stream);
            socket.emit('i-am-arrived', myPeerUniqueID, roomId, fullName,stream.id);

        }, function(err:any) {
            console.log('Failed to get my local stream' ,err);
        });
    }, [myPeerUniqueID, roomId, fullName, socket, getUserMedia, streamOptions])

    useEffect(() => {

        // We have new user in the room, all members in the room needs to call him only when our stream data available
        socket.on('new-user-arrived', (peerID:string, roomID:string, userName:string) => {
            sonofottutamenteconnesso=true;
            if(myStream){
                setPeersArray((peers) => {
                    const streamsCopy = [...peers];
                    const found = streamsCopy.some(el => el === peerID);
                    if(!found && peerID !== myPeerUniqueID) streamsCopy.push(peerID)
    
                    return streamsCopy;
                })
                const call = myPeer.call(peerID, myStream, {metadata: {userName: fullName, screenShare: false, stopShare: false, streamID: null}} )
                call.on('stream', function(remoteStream:any) {
                    setVideoStreams((streams) => {
                        const streamsCopy = [...streams];
                        
                        const found = streamsCopy.some(el => el.stream.id === remoteStream.id);
                        remoteStream['peerID']=peerID;
                        if(!found) streamsCopy.push({user: userName, stream: remoteStream})
                        return streamsCopy;
                    })
                });
            }
        })
    }, [socket, peersArray, myPeerUniqueID, myPeer, myStream, fullName, screenStream]);

    useEffect(() => {

        // We are receiving the call, answering and send our streaming data back when it is available
        myPeer.on('call', function(call) {
            if(myStream){
                call.answer(myStream);

                setPeersArray((peers) => {
                    const streamsCopy = [...peers];
                    const found = streamsCopy.some(el => el === call.peer);
                    if(!found && call.peer !== myPeerUniqueID) streamsCopy.push(call.peer)
                    return streamsCopy;
                })
                
                call.on('stream', function(remoteStream) {
                    if(call.metadata.screenShare){
                        setScreenStream(call.metadata.stopShare ? undefined : remoteStream);
                    }
                    else {
                        setVideoStreams((streams) => {
                            const streamsCopy = [...streams];
                            
                            const found = streamsCopy.some(el => el.stream.id === remoteStream.id);
                            if(!found && call.metadata.streamID !== remoteStream.id) streamsCopy.push({user:call.metadata.userName, stream: remoteStream})
                            return streamsCopy;
                        })
                    }
                });
            }
            
      });
    }, [getUserMedia, myPeer, myStream, myPeerUniqueID])

    useEffect(() => {

        socket.on('new message received', (data: { sender: string, receivedMessage: string; }) => {
            let currentSender = data.sender;
            setMessages(currentArray => {
                return [...currentArray, {
                    sender:currentSender,
                    receivedMessage: data.receivedMessage
                }]
            })
            setNewMessage('');
        })
    }, [socket])


    useEffect(() => {

        socket.on('userLeft', (streamID: string) => {
           // console.log("peerasrary",peersArray)
            setVideoStreams(currentArray => {
                let currentStreams =  currentArray.filter(el => {
                    return el.stream.id !== streamID;
                })
                return [...currentStreams];
            })
            //console.log("Dati dopo userleft:",myPeerUniqueID, roomId, fullName, socket, getUserMedia, streamOptions)
            //console.log("video stream dopo user left",videoStreams)
        });

        window.onbeforeunload = () => {
            myPeer.disconnect();
            sonofottutamenteconnesso=false;
            socket.emit('userExited', myStream?.id, roomId);
          //  console.log("Dati dopo userexited:",myPeerUniqueID, roomId, fullName, socket, getUserMedia, streamOptions)

        }
    }, [roomId, socket, myPeer])

    useEffect(() => {
        if(screenStream){
            if(screenVideoRef?.current){
                screenVideoRef.current.srcObject = screenStream;
                screenVideoRef.current.onloadedmetadata = function(e) {
                    if(screenVideoRef?.current){
                        screenVideoRef.current.play();
                    }
                }
            }
        }
    }, [screenVideoRef, screenStream])

    const stopScreenShare = useCallback(() => {

        const tracks = screenStream?.getTracks();
        if(tracks && screenStream){
            for( var i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
            if(peersArray.length > 0){
                peersArray.forEach(peer => {
                    myPeer.call(peer, screenStream, {metadata: {userName: fullName, screenShare: true, stopShare: true, streamID: null}} )
                })
                setStartSharing(false)
                setScreenStream(undefined);
                setShareScreenButtonText('Start screen Sharing')
            }
            return;
        }
        
        
        return;
    }, [screenStream, myPeer, peersArray, fullName])


    const startScreenShare = useCallback(async () => {
        try {
            const mediaDevices = navigator.mediaDevices as any;
            let captureStream = await mediaDevices.getDisplayMedia({video:true, audio: false});

            setStartSharing(true);
            
            setScreenStream(captureStream);

            setShareScreenButtonText('Stop screen sharing')

            if(peersArray.length > 0){
                peersArray.forEach(peer => {
                    myPeer.call(peer, captureStream, { metadata: { userName: fullName, screenShare: true, stopShare: false, streamID: captureStream.id} })
                })
            }
          
        } catch (err) {
          console.error("Error: " + err);
        }
    }, [myPeer, peersArray, fullName])



    const shareScreenHandler = useCallback(async () => {

        if(startSharing && screenStream){
            return stopScreenShare();
        }

        return await startScreenShare();
      
        
      }, [startScreenShare, stopScreenShare, startSharing, screenStream])

    

    const videoStreamsList =  useMemo(() => {
          //  console.log("aggiornamento videostrereams",myStream,videoStreams, fullName)
            for(let stream of videoStreams){
                if(stream.stream['peerID'] && stream.stream['id']) arrayClient[stream.stream['peerID']]=stream.stream['id']
            }
            // setTimeout(()=>{
            //     console.log("bbb",arrayClient)

            // },1000)
        return (
            <>
                {myStream && (<Streamer controls={true} fullName={fullName ?? 'User 1'} muted={true} stream={myStream} /> ) }
                {videoStreams.length > 0 && (
                    videoStreams.map(({user, stream}, idx) => {
    
                        return (
                            <Streamer key={`stream-${idx}`} controls={false} fullName={user ?? `User ${idx + 1}`} muted={false} stream={stream} /> 
                        )
                    }
                ))}
                
            </>
        )
    }, [myStream, videoStreams, fullName])

    const videoSharingBlock = useMemo(() => {
        return (
            <>
                {screenStream && screenVideoRef && (
                    <div className="screen-sharing-video-cover video">
                        <video ref={screenVideoRef} muted={false} autoPlay={true} controls={true} />
                    </div>
                )}
            </>
        )
    }, [screenStream, screenVideoRef])

    const formHandler = (e:FormEvent) => {
        e.preventDefault();
        if(newMessage){
            socket.emit('new message', {
                sender:fullName,
                receivedMessage: newMessage
            }, roomId)
        }
    }


    return (
        <>
        {!roomId && (<Navigate to="/" />)}
        {roomId && (
            <div className="AppCover">
                <div className="video-streams">
                    <div className="streamsCover">
                        {videoStreamsList}
                    </div>
                    {videoSharingBlock}
                </div>
                <div className="video-sidebar">
                    <div className="room-headline">
                        <div>Copy and share the room ID in order to join the conference</div>
                        <strong>ROOM ID: {roomId}</strong>
                    </div>
                    {videoStreams.length > 0 && (
                        <div className="screenShareCover">
                            <button type="button" className="screen-share" disabled={startSharingButtonDisabled ? true : false}  onClick={shareScreenHandler}>
                                {shareScreenButtonText}
                                <ScreenShareIcon />
                            </button>
                        </div>
                    )}
                    <div className="messages">
                        {messages.length > 0 ? 
                            messages.map((el, idx) => {
                                let data:any = el;
                                return <Message key={idx} data={data} />
                            })
                        : 'Chat is empty'}
                    </div>
                    <div className="input-area">
                        <form onSubmit={formHandler}>
                            <input type="text" name="message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Message" />
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>

    )
}

export default Call;
