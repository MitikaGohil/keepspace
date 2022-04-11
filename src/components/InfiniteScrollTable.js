import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import SnackBar from './SnackBar';

import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import { Link } from 'react-router-dom';
import { removeUsers } from '../actions/userActions';
import { showSnackBar } from '../actions/utilActions';
import { formatData, stableSort, getSorting } from '../utils/helper';

const headRows = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'image', numeric: false, disablePadding: false, label: 'Profile Image' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

const ExtendedDataTable = (props) => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen(true);
  }

  const fetchPosts = () => {
    axios
      .get(`https://randomuser.me/api/?page=${page}&results=10`)
      .then((res) => {
        const result = res.data.results;
        const manipulateData = formatData(result)
        setPosts([...posts, ...manipulateData]);
        setPage((prev) => prev + 1);
      });
    console.log("page", page);
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

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

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.users.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer style={{ margin: 'auto', maxHeight: '430px' }} id="tableContainer">
          <InfiniteScroll
              dataLength={posts.length}
              next={() => fetchPosts()}
              hasMore={true}
              loader={<h4>Loading.....</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>You read all news posts.</b>
                </p>
              }
              scrollableTarget="tableContainer"
            >
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            options = {{
              paging: false
            }}
            stickyHeader
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={posts.length}
            />
            <TableBody>
              {stableSort(posts, getSorting(order, orderBy))
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
            </InfiniteScroll>
        </TableContainer>
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