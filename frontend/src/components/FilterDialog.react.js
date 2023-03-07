import React, { useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function FilterDialog({
    open,
    onDialogClose,
    onFilterSet,
    dialogTitle,
    dialogContent,
}) {

    const [value, setValue] = useState('');

    const handleChange = useCallback((event) => {
        setValue(event.target.value);
    }, [setValue]);

    const handleFilterClick = useCallback(() => {
        onFilterSet(value);
    }, [onFilterSet, value]);

    return (
        <Dialog
            open={open}
            onClose={onDialogClose}
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {dialogContent}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="name"
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDialogClose}>Cancel</Button>
                <Button onClick={handleFilterClick}>Filter</Button>
            </DialogActions>
        </Dialog>
    );
}
