import { Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';

import {
  StyledDialog,
  StyledDialogAction,
  StyledDialogContent,
  StyledDialogTitle,
} from './index.style';

const CustomModal = ({
  children,
  title,
  open,
  onConfirm,
  onCancel,
  confirmMessage,
  cancelMessage,
  onClose,
  cancelColor,
  disableSubmitButton,
  hasCloseButton = true,
  loading = false,
  className,
  width,
}) => (
  <StyledDialog
    scroll="body"
    open={open}
    className={className}
    disableScrollLock
    width={width}
  >
    <StyledDialogTitle>
      <Typography className="title">{title}</Typography>
      {hasCloseButton ? (
        <IconButton className="close-icon" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </StyledDialogTitle>
    <StyledDialogContent>{children}</StyledDialogContent>
    <StyledDialogAction>
      {cancelMessage && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ background: cancelColor }}
          onClick={onCancel}
        >
          {cancelMessage}
        </Button>
      )}
      {loading ? (
        <Button variant="contained" color="primary" disabled>
          <CircularProgress size="24px" sx={{ color: 'white' }} />
        </Button>
      ) : (
        confirmMessage && (
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            disabled={disableSubmitButton}
          >
            {confirmMessage}
          </Button>
        )
      )}
    </StyledDialogAction>
  </StyledDialog>
);

export default CustomModal;
