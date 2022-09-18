import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Navigate } from "react-router-dom";
import styles from "../styles/Main.module.css";

const Main: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [existOpen, setExistOpen] = useState(false);
  const [createRoomInput, setCreateRoomInput] = useState("");
  const [joinRoomInput, setJoinRoomInput] = useState("");
  const [fullName, setFullName] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleNewClickOpen = () => {
    setCreateRoomInput("");
    setFullName("");
    setOpen(true);
  };

  const handleNewClose = () => {
    setCreateRoomInput("");
    setFullName("");
    setOpen(false);
  };

  const handleExistClickOpen = () => {
    setJoinRoomInput("");
    setFullName("");
    setExistOpen(true);
  };

  const handleExistClose = () => {
    setJoinRoomInput("");
    setFullName("");
    setExistOpen(false);
  };

  const generateID = () => {
    const uniqueID = "conf-" + Date.now();
    setCreateRoomInput(uniqueID);
  };

  const createNewConference = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (createRoomInput && fullName) {
      localStorage.setItem("roomId", createRoomInput);
      localStorage.setItem("fullName", fullName);
      setRedirect(true);
    }
  };

  const joinConference = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (joinRoomInput && fullName) {
      localStorage.setItem("roomId", joinRoomInput);
      localStorage.setItem("fullName", fullName);
      setRedirect(true);
    }
  };

  return (
    <>
      {redirect && <Navigate to="/call" />}
      {!redirect && (
        <>
          <div className="page-bg">
            <Container
              maxWidth="sm"
              component="main"
              className={styles.heroContent}
            >
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
              <div className={styles.heroButtons}>
                <Grid container className={styles.grid}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNewClickOpen}
                    >
                      Crea una nuova conferenza
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleNewClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Creazione della conference
                      </DialogTitle>
                      <form onSubmit={createNewConference}>
                        <DialogContent>
                          <DialogContentText>
                            Per creare una nuova conferenza, inserisci il tuo
                            nome, un ID a piacere (puoi generarlo dal bottone in
                            basso)
                          </DialogContentText>

                          <TextField
                            autoFocus
                            margin="dense"
                            id="new-room"
                            label="ID della stanza"
                            type="text"
                            value={createRoomInput}
                            onChange={(e) => setCreateRoomInput(e.target.value)}
                            fullWidth
                          />
                          <TextField
                            autoFocus
                            margin="dense"
                            id="full-name"
                            label="Nome"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            fullWidth
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleNewClose} color="primary">
                            Cancella
                          </Button>
                          <Button onClick={generateID} color="primary">
                            Genera ID
                          </Button>
                          <Button
                            type="submit"
                            onClick={createNewConference}
                            color="primary"
                          >
                            Inizia la conferenza
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExistClickOpen}
                    >
                      Entra in una conferenza
                    </Button>
                    <Dialog
                      open={existOpen}
                      onClose={handleExistClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">
                        Entra in una conferenza
                      </DialogTitle>
                      <form onSubmit={joinConference}>
                        <DialogContent>
                          <DialogContentText>
                            Inserisci l'id della stanza e il tuo nome per
                            entrare.
                          </DialogContentText>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="exist-room"
                            label="ID della stanza"
                            type="text"
                            value={joinRoomInput}
                            onChange={(e) => setJoinRoomInput(e.target.value)}
                            fullWidth
                          />
                          <TextField
                            autoFocus
                            margin="dense"
                            id="full-name-2"
                            label="Nome"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            fullWidth
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleExistClose} color="primary">
                            Cancella
                          </Button>
                          <Button
                            type="submit"
                            onClick={joinConference}
                            color="primary"
                          >
                            Entra in conferenza
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default Main;
