

import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';

import Header from '../Header.react';
import LineItemDataTable from '../LineItemDataTable.react';
import FilterDialog from '../FilterDialog.react';
import CommentDialog from '../CommentDialog.react';

import { fetchLineItemsByCampaignId } from '../../features/lineItemSlice';
import { fetchCampaignById } from '../../features/campaignSlice';
import { updateItemComment } from '../../features/lineItemSlice';

const LineItemPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(fetchLineItemsByCampaignId(id));
        dispatch(fetchCampaignById(id));
    }, [dispatch, id])

    const [isFilterDialogOpened, setIsFilterDialogOpened] = useState(false);
    const [isCommentDialogOpened, setIsCommentDialogOpened] = useState(false);
    const [currentCommentItemId, setCurrentCommentItemId] = useState(null);
    const [filter, setFilter] = useState('');

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

    const handleCommentIconClick = useCallback((id) => {
        setIsCommentDialogOpened(true);
        setCurrentCommentItemId(id)
    }, []);

    const handleCommentDialogClose = useCallback(() => {
        setIsCommentDialogOpened(false);
    }, []);

    const handleCommentCreate = useCallback((value) => {
        setIsCommentDialogOpened(false);
        dispatch(updateItemComment({
            id: currentCommentItemId,
            comment: value,
        }))
    }, [currentCommentItemId, dispatch])

    return (
        <>
            <Header />
            <LineItemDataTable
                campaignId={id}
                onFilterIconClick={handleFilterIconClick}
                filter={filter}
                cleanFilter={handleCleanFilter}
                onCommentIconClick={handleCommentIconClick}
            />
            <FilterDialog
                open={isFilterDialogOpened}
                onDialogClose={handleFilterDialogClose}
                onFilterSet={handleFilterSet}
                dialogTitle="Line-item Filter"
                dialogContent="Enter line-item name keyword"
            />
            <CommentDialog
                open={isCommentDialogOpened}
                onDialogClose={handleCommentDialogClose}
                onCommentCreate={handleCommentCreate}
                currentCommentItemId={currentCommentItemId}
            />
        </>
    )
}

export default LineItemPage;