import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { set } from 'mongoose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { logoutUser, getProfile, uploadProfile, updateProfile } from '../redux/ActionCreators';
import { DialogContentText } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginTop: '100px',
        justifyContent: 'center',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            width: theme.spacing(50),
            height: theme.spacing(40),
        },
    },

    loaderRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
      },
      
    paper: {
        display: "flex",
        justifyContent: 'space-around',
        alignItems: "center",
        paddingLeft: "20px",
        
    },

    field: {
        marginTop: '20px',
        display: "flex",
        justifyContent: 'space-around',
        alignItems: "center",
    },

 

    inputStyle: {
        // fontWeight: 'bold'
    }
}));


function Profile(props){

    const classes = useStyles()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const [profile, setProfile] = useState()
    const [isDisabled, setDisabled] = useState(true)
    const [edit, setEditDisabled] = useState(false)
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false)
    const [spinner, setSpinner] = useState(false);
    const [file, setFile] = useState('')
    const [text, setText] = useState('')
    const [location, setLocation] = useState('')
    const [postImage, setPostImage] = useState()
 
    useEffect(() => {
       
        setSpinner(true)
        if(props.auth.user!=undefined){
            // console.log(props.auth)
            setAvatar(props.auth.user.avatar)
            setName(props.auth.user.name)
            setEmail(props.auth.user.email)
            setSpinner(false)
        }    
    },[])

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleCreatePost = () => {
        setOpen1(true)
    }

      const handleClose1 = () => {
        setOpen1(false);
      };


    const handleSave=()=>{
        setSpinner(true)
        const formData = new FormData();
        formData.append("imageFile", profile)
        if(profile){
          
            // console.log(spinner)
            props.uploadProfile(formData, props.history)
            
           
        }
        
        const payload={ name: name, email: email}
        setSpinner(true)
        props.updateProfile(payload, props.history)
       
        // axios({
        //     url: '/profile',
        //     method: 'PATCH',
        //     data: payload,

        //     headers: {Authorization: bearer }
        //   }).then((res)=>{
        //         setName(res.data[0].name)
        //         setEmail(res.data[0].email)
        //         setAvatar(res.data[0].avatar)
        //         setEditDisabled(false)
        //         setDisabled(true)
        //         alert("Profile Updated successfully!")
            
        //   }).catch((err)=>{
        //     console.log(err)
        //   })
    }


    const handleEdit=()=>{
        setEditDisabled(true)
        setDisabled(false)
    }


    const handleInputFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]))
        setPostImage(e.target.files[0])
    }

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

    const success=(pos)=> {
        var crd = pos.coords;
      
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
      }
      
    const errorFunc=(err)=> {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      
    const handlePost = () => {
       if(localStorage.getItem("token")){
        setSpinner(true)
        axios.get('http://ip-api.com/json')
        .then(
            function success(response) {
                console.log('User\'s Location Data is ', response.data.lat, response.data.lon);
                console.log(response.data.country);
                setLocation(response.data.country)
                var location1 = response.data.country
                const bearer = 'Bearer ' + localStorage.getItem('token');
                console.log(props.auth.user._id)
                
                const formData = new FormData();
                formData.append("imageFile", postImage)
                console.log(postImage)
                console.log(bearer)
                axios({
                    url: '/postImage',
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: bearer,
                        'Content-Type':'application/json',
                    },
                })
                .then((res) => {
                   console.log("POST URL-> ", res.data);
                   var postURL = res.data;
                   const payload = {
                       user: props.auth.user._id,
                       userName: name,
                       location: location1,
                       text: text,
                       image: postURL
                   }
                   console.log(location)
                   axios({
                       url: '/posts',
                       method: "POST",
                       data: payload,
                       headers: {
                        Authorization: bearer,
                        'Content-Type':'application/json',
                    },
                   })
                   .then((res) => {
                       console.log(res)
                       setText('')
                       setPostImage()
                       setFile('')
                       handleClose1()
                       setSpinner(false)
                   })
                   
                })
                .catch((err) => console.log(err))
            },
      
            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                            status);
            }
        );
       }

       else{
           console.log("token absent")
       }
    }
        if(!spinner){
            return (
                <div className={classes.root} style={{marginTop: '0px'}}>
                    <nav style={{marginLeft: 'auto', marginTop: '20px', height: 'fit-content', weight: 'fit-content'}}>
                        <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                            <li style={{cursor: 'pointer'}} onClick={() => props.history.push('/posts')}>Home</li>
                            <li style={{cursor: 'pointer'}} >Logout</li>
                        </ul>
                    </nav>
                    <Dialog open={open} onClose={handleClose}>
                        <Avatar alt={name} src={`${avatar}`} style={{width: '100%', height: "100%"}} variant="square" />
                    </Dialog>
                    <Dialog open={open1} onClose={handleClose1}  >
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogContent style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'center'}}>
                            <input type='file' name='imageFile' id='imageFile' onChange={(e) => handleInputFile(e)} />
                            <img src={file} style={{marginTop: '20px', height: '200px', width: '200px'}} />
                            <label for='text' style={{marginTop: '20px'}}>Describe</label><input type='textarea' id='text' name='text'   onChange={(e) => {setText(e.target.value)} } />
                        </DialogContent>
                        <DialogActions><Button variant='contained' color='primary' onClick={handlePost}>Post</Button></DialogActions>
                    </Dialog>
                    <Paper >
                    <div className={classes.field}><Avatar alt={name} src={`${avatar}`} style={{width: '100px', height: "100px"}} onClick={handleClickOpen}/><input type="file" id="profile" name="profile" style={{display: isDisabled ? "none" : ""}} onChange={(e) => setProfile(e.target.files[0])}  /> </div>
                       <div className={classes.field}>Name: <input className={classes.inputStyle} id="title" name="title" value={name} disabled={isDisabled} onChange={(e) => setName(e.target.value)} /></div>
                       <div className={classes.field}>Email: <input  className={classes.inputStyle} id="email" name="email" value={email} disabled={isDisabled} onChange={(e) => setEmail(e.target.value)} /></div>
        
                       <div className={classes.field}><Button variant="contained" color="primary"  disabled={edit} onClick={handleEdit} >Edit</Button><Button variant="contained" color="primary" onClick={handleSave} disabled={isDisabled}>Save</Button>  <Button variant="contained" color="primary" onClick={handleCreatePost}>
                        Create Post 
                    </Button></div>
                       {/* <span onClick={() => props.logoutUser(props.history)} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</span> */}
                    </Paper>
                   
                   
                </div>
            );
        }
        else{
            return (
                <div className={classes.loaderRoot} style={{marginTop: '300px'}}>
                  <CircularProgress />
                </div>        
                 );
        }
       
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = (dispatch) => ({
    logoutUser: (history) => dispatch(logoutUser(history)),
    getProfile: (history) => dispatch((getProfile(history))),
    uploadProfile: (formData, history) => dispatch((uploadProfile(formData, history))),
    updateProfile: (payload, history) => dispatch((updateProfile(payload, history)))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile))

