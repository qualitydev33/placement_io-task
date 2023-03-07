import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import DialogTitle from '@mui/material/DialogTitle';

import { getItemComment } from '../features/lineItemSlice';

export default function CommentDialog({
    open,
    onDialogClose,
    onCommentCreate,
    currentCommentItemId,
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getItemComment(currentCommentItemId))
    }, [dispatch, currentCommentItemId, open]);

    const ref = useRef();
    const items = useSelector((state) => (state.lineItem.items));
    const item = items.find((item) => (item.id === currentCommentItemId))
    const comment = item?.comment || '';

    const handleCommentCreateClick = useCallback(() => {
        const value = ref.current.value;
        onCommentCreate(value);
    }, [onCommentCreate]);

    if (!currentCommentItemId) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onDialogClose}
            maxWidth="50%"
            fullWidth
        >
            <DialogTitle>{`Update Comment for ${item?.name}`}</DialogTitle>
            <DialogContent>
                <TextareaAutosize
                    minRows="15"
                    autoFocus
                    id="name"
                    label="name"
                    variant="standard"
                    placeholder="Comment..."
                    defaultValue={comment}
                    style={{width: '100%'}}
                    ref={ref}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDialogClose}>Cancel</Button>
                <Button onClick={handleCommentCreateClick}>Comment</Button>
            </DialogActions>
        </Dialog>
    );
}
