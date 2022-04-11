import React, { useState } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEditUsers } from '../actions/userActions';
import { TextField, Button } from '@material-ui/core';

import SnackBar from './SnackBar';

/**
 * Handles Add/edit user form with required validation
 * @param {*} props Contains users detail i.e name, email, phone
 */
const AddEditUser = (props) => {
  const [state, setState] = useState({
    user:{
      id: props.location.state?.user ? props.location.state.user.id : null,
      name: props.location.state?.user ? props.location.state.user.name : '',
      email: props.location.state?.user ? props.location.state.user.email : '',
      phone: props.location.state?.user ? props.location.state.user.phone : '',
      date: props.location.state?.user ? props.location.state.user.date : '',
      image: props.location.state?.user ? props.location.state.user.image : '',
      edit: props.location.state?.user ? props.location.state.edit : false
    },
    open: false
  })
  
  
  const handleClose = (event, reason) =>{
    if (reason === "clickaway") {
      return;
    }
    setState({open: false});
  }

    return (
      <Route render={ ({history}) => (
        <div>
          <Formik
          initialValues={state.user}
          onSubmit={(values, actions) => {
            console.log(values)
            setTimeout(() => {
              history.push('/');
              state.user.id ? props.addNewUser([{...values, id: state.user.id }]) : props.addNewUser([values])
            }, 100);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name field is required'),
            email: Yup.string()
              .email('Email not valid')
              .required('Email field is required'),
            phone: Yup.string()
              .required('Phone field is required')
              .max(10)
              .min(10),
            website: Yup.string().notRequired()
          })}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = props;
            return (
              <form
                onSubmit={handleSubmit}
                style={{ width: '30%', margin: 'auto' }}
              >
                <TextField
                  id="standard-name"
                  type="text"
                  name="name"
                  label="Name" // Label acts like placeholder
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.name && touched.name && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.name}
                  </div>
                )}
  
                <TextField
                  id="standard-email"
                  type="email"
                  name="email"
                  label="Email" // Label acts like placeholder
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.email && touched.email && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.email}
                  </div>
                )}
  
                <TextField
                  id="standard-phone"
                  type="text"
                  name="phone"
                  label="Phone Number" // Label acts like placeholder
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
                {errors.phone && touched.phone && (
                  <div
                    style={{ textAlign: 'start', marginTop: '2px', color: 'red' }}
                  >
                    {errors.phone}
                  </div>
                )}
    
                <Button
                  disabled={!dirty && !isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: '1em', float: 'right' }}
                >
                  {state.user.edit ? 'Update User' : 'Add User'}
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="contained"
                  color="primary"
                  style={{ margin: '1em', float: 'right' }}
                >
                  Cancel
                </Button>
              </form>
            );
          }}
        </Formik>
        <SnackBar
          open={state.open}
          handleClose={handleClose}
          variant="success"
          message="User Created Successfully"
        />
      </div>
      )} />
    );
}

AddEditUser.propTypes = {
  addNewUser: PropTypes.func,
  snackBarMessage: PropTypes.string,
  snackBarVariant: PropTypes.string
};

const mapStateToProps = state => ({
  snackBarMessage: state.utils.message,
  snackBarVariant: state.utils.variant
})

export default connect(
  mapStateToProps,
  { addNewUser: addEditUsers }
)(AddEditUser);
