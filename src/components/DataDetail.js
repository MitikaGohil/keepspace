import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Avatar,
    CardHeader,
    CardActionArea,
  } from "@material-ui/core";
  import { makeStyles } from "@material-ui/core/styles";
  import ConfirmDialog from './Dialog';


const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    title: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    fullWidth: {
      width: '100%',
    },
    root: {
        "& > *": {
          margin: theme.spacing(3),
        },
      },
  }));

/**
 * Handles User detail page with edit and delete action
 * @param {Object} props 
 */

const DataDetail = (props) => {
    const classes = useStyles();
    const [confirmOpen, setConfirmOpen] = useState(false)
    const { name, email, age, pageImage, phone, gender, city, country, postcode, street } = props.location.state.user;
    return (        
        <main className={classes.fullWidth}>
            <Box className={classes.root}>
                <Card>
                    <CardActionArea>
                        <CardHeader
                            avatar={<Avatar src={pageImage}></Avatar>}
                            title={name}
                            subheader={email}
                        />
                        <CardContent>               
                            <Typography variant="h6">Contact No: {phone}</Typography>
                            <Typography variant="h6">Gender: {gender}</Typography>
                            <Typography variant="h6">Address: {street},</Typography>
                            <Typography variant="h6">{city},</Typography>
                            <Typography variant="h6">{country},</Typography>
                            <Typography variant="h6">{postcode}</Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button component={Link} to={{pathname: '/add-edit',
                          state: {
                            user: props.location.state.user,
                            edit: true
                          }}} variant="contained" color="primary">Edit</Button>
                          <Button onClick={() => setConfirmOpen(true)} variant="contained" color="primary">Delete
                          </Button>                          
                            <ConfirmDialog
                                title="Delete User?"
                                open={confirmOpen}
                                setOpen={setConfirmOpen}
                                onConfirm={props.location.state.user}
                            >
                                Are you sure you want to delete this user?
                            </ConfirmDialog>
                    </CardActions>
            </Card>
        </Box>
    </main>
    )
}

export default DataDetail;