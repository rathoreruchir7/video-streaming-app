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
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';



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

  function Posts(props){

    const classes = useStyles()
    const [spinner, setSpinner] = useState(true)
    const [posts, setPosts] = useState([])
    const [country, setCountry] = useState('')

    var list;
    useEffect(async() => {
        const result = await props.fetchPosts(country)
        if(result.data){
            setPosts(result.data)
            setSpinner(false)
        }
    },[country])

    const handleSelectChange = (e) => {
        setSpinner(true);
        setCountry(e.target.value)
    }

    
    if(!spinner){
        return (
            <div>
            <HideOnScroll {...props}>
            <AppBar>
              <Toolbar>
              <Typography>Select Country</Typography>
              <Select
                labelId="select-country"
                id="select-country"
                value={country}
                onChange={handleSelectChange}
                >
                <MenuItem value='' selected={true}>All</MenuItem>
                <MenuItem value='India'>India</MenuItem>
                <MenuItem value='China'>China</MenuItem>
                <MenuItem value='France'>France</MenuItem>
                <MenuItem value='Germany'>Germany</MenuItem>
            </Select>
            <Typography >
                <div style={{marginLeft: '20px', cursor: 'pointer'}} onClick={() => props.history.push('/profile')}>Profile</div>
            </Typography>
              </Toolbar>
            </AppBar>
            </HideOnScroll>
          <div style={{height: '100vh', width: '90%', margin: "auto", overflow: 'scroll'}}>
            <Grid container spacing={3}>
             {
               posts.map((item) => {
                 return (
                   <Grid item xs={12} sm={4} lg={3}>
                      <PostDetail item={item} />
                   </Grid>
                 );
               })
             }
             </Grid>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts))