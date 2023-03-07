import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({
    isOpen,
    title,
    mainText,
    primaryButtonText,
    secondaryButtonText,
    onClose,
    onPrimaryAction
}) {

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {mainText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{secondaryButtonText}</Button>
                <Button onClick={onPrimaryAction} autoFocus>
                    {primaryButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
