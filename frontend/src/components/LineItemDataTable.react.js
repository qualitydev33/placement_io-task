import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DoneIcon from '@mui/icons-material/Done';
import CommentIcon from '@mui/icons-material/Comment';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';

import { getComparator, stableSort} from '../utility';

import EnhancedTableHead from './EnhancedTableHead.react';

import { updateAdjustment, setItemReviewed } from '../features/lineItemSlice';


const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'bookedAmount',
        numeric: true,
        disablePadding: false,
        label: 'Booked Amount',
    },
    {
        id: 'actualAmount',
        numeric: true,
        disablePadding: false,
        label: 'Actual Amount',
    },
    {
        id: 'adjustment',
        numeric: true,
        disablePadding: false,
        label: 'Adjustment',
    },
    {
        id: 'billableAmount',
        numeric: true,
        disablePadding: false,
        label: 'Billable Amount',
    },
];

const EnhancedTableToolbar = (props) => {
    const {
        numSelected,
        campaignName,
        onFilterIconClick,
        onReviewedClick,
        filter,
        cleanFilter,
    } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {numSelected} selected
            </Typography>
        ) : (
            <>
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h5"
                    id="tableTitle"
                    component="div"
                >
                    Line-items of {campaignName}
                </Typography>
                {filter ? (
                    <Chip
                        label={`Name: ${filter}`}
                        variant="outlined"
                        onDelete={cleanFilter}
                    />) : null
                }
            </>
        )}

        {numSelected > 0 ? (
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button
                    size="small"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                    onClick={onReviewedClick}
                >
                    Toggle reviewed
                </Button>
            </ButtonGroup>
        ) : (
            <Tooltip title="Filter" arrow>
                <IconButton
                    onClick={onFilterIconClick}
                >
                    <FilterListIcon />
                </IconButton>
            </Tooltip>
        )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    campaignName: PropTypes.string,
};

export default function EnhancedTable({
    campaignId,
    onFilterIconClick,
    filter,
    cleanFilter,
    onCommentIconClick,
}) {
    const dispatch = useDispatch()
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [adjustmentEditLookup, setAdjustmentEditLookup] = useState({});
    const [adjustmentValueLookup, setAdjustmentValueLookup] = useState({})
    const [showToggleReviewedSnackbar, setShowToggleReviewedSnackbar] = useState(false);

    const isItemLoading = useSelector((state) => (state.lineItem.isItemLoading));

    const lowerCaseFilter = filter.toLowerCase();
    const lineItems = useSelector((state) => (state.lineItem.items))
        .filter((item) => (item?.name.toLowerCase().includes(lowerCaseFilter)));
    const rows = useMemo(() => (isItemLoading ? [] : lineItems), [isItemLoading, lineItems]);
    const campaignName = useSelector((state) => (state.campaign.campaignLookup?.[campaignId]?.name));
    const usdToCurrentCurrencyRate = useSelector((state) => (state.app.usdToCurrentCurrencyRate));
    const currentCurrency = useSelector((state) => (state.app.currentCurrency));
    const isUsd = currentCurrency === 'USD';

    const handleRequestSort = useCallback((event, property) => {
        const isAsc = orderBy === property && order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }, [order, orderBy]);

    const handleSelectAllClick = useCallback((event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);

            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, [rows]);

    const handleClick = useCallback((event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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
    }, [selected]);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleChangeDense = useCallback((event) => {
        setDense(event.target.checked);
    }, []);

    const createHandleAdjustmentClick = (id, initValue) => {
        return (event) => {
            event.stopPropagation();

            if(!isUsd) {
                return
            }

            const newAdjustmentEditLookup = {
                ...adjustmentEditLookup,
                [id]: !adjustmentEditLookup[id],
            };

            const newAdjustmentValueLookup = {
                ...adjustmentValueLookup,
                [id]: initValue,
            };

            setAdjustmentEditLookup(newAdjustmentEditLookup)
            setAdjustmentValueLookup(newAdjustmentValueLookup);
        };
    }

    const createHandleAdjustmentSaveClick = (id) => {
        return (event) => {
            const newAdjustmentEditLookup = {
                ...adjustmentEditLookup,
                [id]: !adjustmentEditLookup[id],
            }

            event.stopPropagation();

            setAdjustmentEditLookup(newAdjustmentEditLookup);

            dispatch(updateAdjustment({ id, adjustment: adjustmentValueLookup[id] }));
        };
    }

    const createHandleAdjustmentEnter = (id) => {
        return (event) => {
            if (event.key === 'Enter') {
                const newAdjustmentEditLookup = {
                    ...adjustmentEditLookup,
                    [id]: !adjustmentEditLookup[id],
                }

                event.stopPropagation();

                setAdjustmentEditLookup(newAdjustmentEditLookup);

                dispatch(updateAdjustment({ id, adjustment: adjustmentValueLookup[id] }));
            }
        };
    }

    const createHandleAdjustmentChange = (id) => {
        return (event) => {
            const value = Number(event.target.value);

            if (isNaN(value)) {
                return;
            }

            const newAdjustmentValueLookup = {
                ...adjustmentValueLookup,
                [id]: value,
            }

            event.stopPropagation();

            setAdjustmentValueLookup(newAdjustmentValueLookup);
        };
    }

    const handleTextFieldClick = useCallback((event) => {
        event.stopPropagation();
    }, [])

    const handleReviewedClick = useCallback(() => {
        dispatch(setItemReviewed(selected))

        setShowToggleReviewedSnackbar(true);

        setSelected([]);
    }, [selected, dispatch])

    const handleToggleReviewSnackbarClose = useCallback(() => {
        setShowToggleReviewedSnackbar(false);
    }, []);

    const createHandleCommentIconClick = (id) => {
        return (event) => {
            event.stopPropagation();

            onCommentIconClick(id);
        };
    }

    const isSelected = (id) => selected.indexOf(id) !== -1;

        // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    campaignName={campaignName}
                    onFilterIconClick={onFilterIconClick}
                    filter={filter}
                    cleanFilter={cleanFilter}
                    onReviewedClick={handleReviewedClick}
                />
                <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                >
                    <EnhancedTableHead
                        headCells={headCells}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                    {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            const isItemSelected = isSelected(row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.name}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            {row.name}
                                            {row.isReviewed ? (
                                                <Tooltip title="reviewed" arrow>
                                                    <CommentsDisabledIcon
                                                        sx={{
                                                            width: '1rem',
                                                            opacity: '0.3'
                                                        }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Leave comment" arrow>
                                                    <IconButton
                                                        onClick={createHandleCommentIconClick(row.id)}
                                                    >
                                                        <CommentIcon
                                                            sx={{
                                                                width: '1rem',
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{row.bookedAmount * usdToCurrentCurrencyRate}</TableCell>
                                    <TableCell align="left">{row.actualAmount * usdToCurrentCurrencyRate}</TableCell>
                                    <TableCell align="left">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            { (adjustmentEditLookup[row.id]) ? (
                                                <>
                                                    <TextField
                                                        name={`${row.id}`}
                                                        value={adjustmentValueLookup[row.id]}
                                                        size="small"
                                                        onChange={createHandleAdjustmentChange(row.id)}
                                                        onClick={handleTextFieldClick}
                                                        onKeyDown={createHandleAdjustmentEnter(row.id)}
                                                    />
                                                    <Tooltip title="Click to save" arrow>
                                                        <IconButton
                                                            onClick={createHandleAdjustmentSaveClick(row.id)}
                                                        >
                                                            <DoneIcon
                                                                sx={{
                                                                    width: '1rem',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{row.adjustment * usdToCurrentCurrencyRate}</span>
                                                    <Tooltip arrow title={(isUsd && !row.isReviewed) ? 'Click to edit' : (
                                                        row.isReviewed ? 'Reviewed item is not editable' : 'Editable only when currency is USD'
                                                    )}>
                                                        <IconButton
                                                            onClick={createHandleAdjustmentClick(row.id, row.adjustment * usdToCurrentCurrencyRate)}
                                                        >
                                                            {(isUsd && !row.isReviewed) ? (
                                                                <ModeEditIcon
                                                                    disabled={!isUsd || row.isReviewed}
                                                                    sx={{
                                                                        width: '1rem',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <EditOffIcon
                                                                    disabled={!isUsd || row.isReviewed}
                                                                    sx={{
                                                                        width: '1rem',
                                                                        opacity: '0.3',
                                                                    }}
                                                                />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{(row.actualAmount + row.adjustment) * usdToCurrentCurrencyRate}</TableCell>
                                </TableRow>
                            );
                        })}
                    {emptyRows > 0 && (
                        <TableRow
                            style={{
                                height: (dense ? 33 : 53) * emptyRows,
                            }}
                        >
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                {isItemLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '15px',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                ) : null}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <Snackbar
                open={showToggleReviewedSnackbar}
                autoHideDuration={3000}
                message="Items review toggled"
                onClose={handleToggleReviewSnackbarClose}
            />
        </Box>
    );
}
