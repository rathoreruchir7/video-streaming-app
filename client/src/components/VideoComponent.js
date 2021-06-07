import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import PostDetail from './PostDetail'
import { fetchPosts } from '../redux/ActionCreators';
import { withRouter, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import logo from '../cipher-school.png'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
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
        alignItems: "center",
        paddingLeft: "20px",
        
    },

    field: {
        marginTop: '20px',
        display: "flex",
        justifyContent: 'space-around',
        alignItems: "center",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      },

 

    inputStyle: {
        // fontWeight: 'bold'
    }
}));


function HideOnScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  
  HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };


function VideoComponent(props){
    const classes = useStyles()
    const [spinner, setSpinner] = useState(true)
    const [post, setPost] = useState([])
    const [avatar, setAvatar] = useState('')

    useEffect(async() => {
        const bearer = 'Bearer ' + localStorage.getItem('token');
        console.log(props)
        const result = await axios({
          url: `/posts/${props.match.params.id}`,
          method: "GET",
          headers: {Authorization: bearer }
        })

        if(result.data){
          console.log(result.data);
          setSpinner(false)
          setPost(result.data[0])
          setAvatar(result.data[0].user.avatar)
        }
    },[])
  
    let date;
   if(post && post.date){
      date = new Date(`${post.date}`).toString().substr(4,11);
   
   } 

    if(!spinner){
        return (
            <div>
            <HideOnScroll {...props}>
            <AppBar style={{backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between'}} >
              <Toolbar>
                  <Typography>
                      <img src={logo} style={{height: '80px', width: '80px', cursor: 'pointer'}}></img>
                      
                  </Typography>
                <Typography style={{fontFamily: 'monospace', color: '#3a0d63', fontSize: '30px', cursor: 'pointer'}}>
                      Cipher Schools
                </Typography>
                <Typography style={{marginLeft: 'auto', cursor: 'pointer', color: 'black'}} onClick={() => props.history.push('/profile')}>
                    <Avatar src={`${props.auth.user.avatar}`} style={{width: '40px', height: "40px"}}/>
                </Typography>
              </Toolbar>
             
            </AppBar>
            </HideOnScroll>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100vh', width: '70%', marginTop: "100px", overflow: 'scroll'}}>
                <video src={post.video} controls autoPlay  type="video/mp4" style={{width: '100%', height: '60%', marginBottom: '20px'}}></video>
                <div style={{marginLeft: '20px', float: 'left', fontSize: '20px'}}>{post.text}</div>
                <div style={{marginLeft: '20px', marginTop: '10px',float: 'left', fontSize: '15px'}}>{`${date}`}</div>
                <div style={{marginLeft: '20px', marginTop: '20px',float: 'left', fontSize: '15px',  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                   <Avatar src={`${avatar}`} style={{width: '40px', height: "40px", marginRight: '10px'}} />
                   <div>{`${post.userName}`}</div>
                </div>
            </div> 
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
      posts: state.posts
  }
}

const mapDispatchToProps = (dispatch) => ({
 
  fetchPosts: (country) => dispatch((fetchPosts(country))),
 
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoComponent))