

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import Header from '../Header.react';
import CampaignDataTable from '../CampaignDataTable.react';
import ConfirmDialog from '../ConfirmDialog.react';
import FilterDialog from '../FilterDialog.react';

import { fetchCampaigns } from '../../features/campaignSlice';
import { createInvoices, showInvoiceCreateSnackbar } from '../../features/invoiceSlice';

const CampaignPage = () => {
    const dispatch = useDispatch()
    const [selected, setSelected] = useState([]);
    const [isFilterDialogOpened, setIsFilterDialogOpened] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCampaigns());
    }, [dispatch])

    const handleConfirmDialogOpen = useCallback(() => {
        setIsConfirmDialogOpen(true);
    }, []);

    const handleConfirmDialogClose = useCallback(() => {
        setIsConfirmDialogOpen(false);
    }, []);

    const handleConfirmCreateInvoice = useCallback(() => {
        setIsConfirmDialogOpen(false);

        dispatch(createInvoices(selected)).then(() => {
            dispatch(showInvoiceCreateSnackbar());
            navigate('/invoices')
        })
    }, [dispatch, selected, navigate]);

    const handleSelected = useCallback((s) => {
        setSelected(s);
    }, [])

    const handleFilterIconClick = useCallback(() => {
        setIsFilterDialogOpened(true);
    }, []);

    const handleFilterDialogClose = useCallback(() => {
        setIsFilterDialogOpened(false);
    }, []);

    const handleFilterSet = useCallback((keyword) => {
        setFilter(keyword);
        setIsFilterDialogOpened(false);
    }, []);

    const handleCleanFilter = useCallback((keyword) => {
        setFilter('');
    }, []);

    return (
        <>
            <Header />
            <CampaignDataTable
                selected={selected}
                onCreateInvoiceClick={handleConfirmDialogOpen}
                setSelected={handleSelected}
                onFilterIconClick={handleFilterIconClick}
                filter={filter}
                cleanFilter={handleCleanFilter}
            />
            <ConfirmDialog
                title="Create Invoices"
                mainText="Are you sure to create invoices?"
                primaryButtonText="Yes"
                secondaryButtonText="Cancel"
                isOpen={isConfirmDialogOpen}
                onClose={handleConfirmDialogClose}
                onPrimaryAction={handleConfirmCreateInvoice}
            />
            <FilterDialog
                open={isFilterDialogOpened}
                onDialogClose={handleFilterDialogClose}
                onFilterSet={handleFilterSet}
                dialogTitle="Campaign Filter"
                dialogContent="Enter campaign name keyword"
            />
        </>
    )
}

export default CampaignPage;