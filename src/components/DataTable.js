import React from 'react';
import PropTypes from 'prop-types';

import SnackBar from './SnackBar';

import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { Link } from 'react-router-dom';
import { removeUsers } from '../actions/userActions';
import { showSnackBar } from '../actions/utilActions';
import { getSorting, stableSort } from '../utils/helper';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: 'auto',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  icon: {
    fontSize: 20
  }
}));

/**
 * Populate API response in table with remove row checkbox selection and edit action
 * @param {Array<Object>} props Contains formatted API array of Objects
 */

const ExtendedDataTable = (props) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }

  // Check for props
  // Place newly added row at top
  if (props.newUsers && props.newUsers.length > 0) {
    const usersID = props.users.map(user => +user.id);
    let largest = Math.max(...usersID);
    const newUsers = props.newUsers.map((user, index) => {
      return { ...user, id: ++largest}
    })
    props.users.unshift(...newUsers);
    props.newUsers.splice(0);
    handleOpen();
  } else if(props.editUsers && props.editUsers.length > 0) {
    props.editUsers.forEach(editUser => {
      props.users.splice(props.users.findIndex(user => 
        user.id === editUser.id), 1, editUser);
    })
    props.editUsers.splice(0);
    handleOpen();
  } else if (props.deleteUsers && props.deleteUsers.length > 0) {
    props.deleteUsers.forEach(delUser => {
      props.users.splice(props.users.findIndex(user => 
        user.name === delUser), 1);
    })
    // Empty selected array
    selected.splice(0);
    props.deleteUsers.splice(0);
    handleOpen();
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function handleUsersDelete(usersNameArr) {
    props.removeUsers(usersNameArr);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelection = props.users.map(n => n.name);
      setSelected(newSelection);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.users.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar selected={selected} removeUserCallback={handleUsersDelete} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.users.length}
            />
            <TableBody>
              {stableSort(props.users, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" align="right" id={labelId} scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">
                        <Link to={{
                          pathname:`/detail`,
                          state: {
                            user:row
                          }
                        }}> {row.name}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">
                        <Link to={{
                          pathname:`/detail`,
                          state: {
                            user:row
                          }
                        }}>
                          <img src={row.image} />
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Link to={{
                          pathname: '/add-edit',
                          state: {
                            user: row,
                            edit: true
                          }
                        }}>
                          <IconButton>
                              <EditIcon className={classes.icon}/>
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <SnackBar
        open={open}
        handleClose={handleClose}
        variant={props.snackBarVariant}
        message={props.snackBarMessage}
      />
    </div>
  );
}

ExtendedDataTable.propTypes = {
    users: PropTypes.array.isRequired,
    newUsers: PropTypes.array,
    editUsers: PropTypes.array,
    deleteUsers: PropTypes.array,
    removeUsers: PropTypes.func,
    showSnackBar: PropTypes.func,
    snackBarMessage: PropTypes.string,
    snackBarVariant: PropTypes.string
}

const mapStateToProps = state => ({
    users: state.users.allUsers,
    newUsers: state.users.newUsers,
    editUsers: state.users.editUsers,
    deleteUsers: state.users.deleteUsers,
    snackBarMessage: state.users.message,
    snackBarVariant: state.users.variant
});

export default connect(mapStateToProps, { removeUsers, showSnackBar })(ExtendedDataTable);