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
import { DialogContentText, ListItemAvatar } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { ContactSupportOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '100px',
        justifyContent: 'center',
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
        height: 'auto',
        minHeight: '200px',
        width: '500px',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: "flex-start",
        // paddingLeft: "20px",
        paddingTop: '20px',
        paddingBottom: '50px',
        cursor: 'pointer'
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


function PostDetail(props){
    const classes = useStyles()
    const [spinner, setSpinner] = useState(true)
    const [like, setLike] = useState(false)
    const [likes, setLikes] = useState(0)
    useEffect(() => {
        if(props.item.user){
            setLikes(props.item.likes.length)  
            const getLike = props.item.likes.filter((item) => {
                if(item.author===props.item.user._id)
                    {
                        console.log(item)
                        return item;
                    }
            })
            
            setSpinner(false)

        }
    },[])
    
    const dateFunc = () => {
        const postDate = new Date(`${props.item.date}`);
        const curr_date = new Date();
        const diff = (curr_date-postDate)/1000;
        
       
        if(diff>12*30*24*3600)
            return `${Math.round(diff/(12*30*24*3600))} yr`;
        else if(diff>30*24*3600)
            return `${Math.round(diff/(30*24*3600))} months`;
        else if(diff>24*3600)
            return `${Math.round(diff/(24*3600))} days`;
        else if(diff>3600)
            return `${Math.round(diff/(3600))} hours`;
        else if(diff>60)
            return `${Math.round(diff/60)} minutes`;
        else if(diff<60)
        return `${Math.round(diff)} seconds`;
    }
    
    console.log(dateFunc())
    
    
    const postLike = () => {
        setLike(!like)
        console.log(like)
        const bearer = 'Bearer ' + localStorage.getItem('token');
        const payload = {
            like: like
        }
        console.log("PAYLOAD->", payload)
        axios({
            url: `posts/${props.item._id}/likes`,
            method: "POST",
            data: payload,
            headers: {Authorization: bearer }
        })
        .then((res) => {
            console.log(res)
        })
        .catch((err) => console.log(err))
    }
    if(!spinner){
        return (
            <div className={classes.root}>
            <Paper className={classes.paper} elevation={0} onClick={(e) => {e.target.style.backgroundColor="#d3d3d3"; props.history.push(`/videos/${props.item._id}`)}}>
                <video src={props.item.video}  loop onmouseover="this.play()" onmouseout="this.pause();" type="video/mp4" style={{width: '100%', height: '100%', marginBottom: '20px'}}></video>
                <div style={{marginBottom: '2px', display: 'flex', alignItems: 'center'}}>
                    <Avatar src={`${props.item.user.avatar}`} style={{width: '40px', height: "40px", marginRight: '10px'}} />
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{marginBottom: '10px', fontWeight: "bold"}}>{props.item.text}</div>
                    {/* <div style={{marginBottom: '20px'}}>{props.item.location}</div> */}
                         <div style={{marginBottom: '0px', fontSize: '14px'}}>{props.item.userName}</div>
                    </div>
                </div>
                <div style={{marginRight: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px'}}>
                    <span style={{marginRight: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => postLike()}> { like?<FavoriteOutlinedIcon/> :<FavoriteBorderIcon />}<span>{likes}</span></span>
                    <span>{`${dateFunc()} ago`}</span>
                </div>
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

export default PostDetail