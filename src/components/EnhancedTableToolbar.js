import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';

// Create CSS for module
const useToolbarStyles = makeStyles(theme => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  }));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { selected } = props;
    const numSelected = selected.length;

    function handleDelete() {
        props.removeUserCallback(selected);
    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
                ) : (
                <Typography variant="h6" id="tableTitle">
                    Users
                </Typography>
                )}
            </div>
            <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        
                        <IconButton onClick={handleDelete} aria-label="delete">
                        <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                        <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );  
};

EnhancedTableToolbar.propTypes = {
    selected: PropTypes.array.isRequired
};

export default EnhancedTableToolbar;