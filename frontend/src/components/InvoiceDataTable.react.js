import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

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
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FilterListIcon from '@mui/icons-material/FilterList';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

import { getComparator, stableSort} from '../utility';

import EnhancedTableHead from './EnhancedTableHead.react';

import { getLineItemsByCampaignIds } from '../apis/lineItemApi';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'total',
        numeric: true,
        disablePadding: false,
        label: 'Total',
    },
    {
        id: 'updatedAt',
        numeric: false,
        disablePadding: false,
        label: 'Update Time',
    },
];

const EnhancedTableToolbar = (props) => {
    const {
        numSelected,
        onCsvCreate,
        onFilterIconClick,
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
                    Invoice
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
                    onClick={onCsvCreate}
                >
                    Export to CSV
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
    onCsvCreate: PropTypes.func,
};

export default function EnhancedTable({
    selected,
    setSelected,
    onFilterIconClick,
    filter,
    cleanFilter,
}) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const lowerCaseFilter = filter.toLowerCase();
    const isLoading = useSelector((state) => (state.invoice.isInvoicesLoading));
    const invoices = Object.values(useSelector((state) => (state.invoice.invoiceLookup)))
        .filter((invoice) => (invoice?.name.toLowerCase().includes(lowerCaseFilter)));;
    const rows = useMemo(() => (isLoading ? [] : invoices), [isLoading, invoices]);
    const usdToCurrentCurrencyRate = useSelector((state) => (state.app.usdToCurrentCurrencyRate));

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
    }, [rows, setSelected]);

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
    }, [selected, setSelected]);

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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleCsvCreate = useCallback(async () => {
        const selectedSet = new Set(selected);
        const selectedInvoice = rows.filter((row) => (selectedSet.has(row.id)));
        const campaignIds = selectedInvoice.map((invoice) => (invoice.campaignId));

        const lineItems = await getLineItemsByCampaignIds(campaignIds);
        const campaignItemLookup = lineItems.reduce((lookup, lineItem) => {
            if(lookup[lineItem.campaignId]) {
                lookup[lineItem.campaignId].push(lineItem.name);
            } else {
                lookup[lineItem.campaignId] = [lineItem.name];
            }

            return lookup;
        }, {})

        let data = 'Name,Total,Update Time, Items\n';

        selectedInvoice.forEach((invoice) => {
            data += `"${invoice.name}","${invoice.total}","${new Date(invoice.updatedAt).toLocaleString()}","${campaignItemLookup[invoice.campaignId].join(';')}"\n`
        });

        const fileName = `Invoice_${new Date().getTime()}.csv`;
        const blob = new Blob([data], {
            type : "application/octet-stream"
        });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = href;
        link.download = fileName;
        link.click();
    }, [rows, selected]);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    onCsvCreate={handleCsvCreate}
                    onFilterIconClick={onFilterIconClick}
                    filter={filter}
                    cleanFilter={cleanFilter}
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
                                    key={row.name+row.id}
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
                                        <Link
                                            to={`/line-items/campaign/${row.campaignId}`}
                                        >
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row.total * usdToCurrentCurrencyRate}</TableCell>
                                    <TableCell align="left">{new Date(row.updatedAt).toLocaleString()}</TableCell>
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
                {isLoading ? (
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
        </Box>
    );
}
