import {
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export const StyledDialog = styled(Dialog)(({ width }) => ({
  backgroundColor: "transparent",
  position: "fixed",

  "&.not-scroll": {
    ".MuiPaper-root": {
      overflow: "initial",
    },
  },

  ".MuiPaper-root": {
    padding: "40px 52px",
    minWidth: "400px",
    width,
    position: "relative",
    borderRadius: "20px",
    backgroundColor: "#eef1ff",
    maxWidth: "none",
  },
}));

export const StyledDialogTitle = styled(DialogTitle)`
  padding: 16px 0;

  .title {
    font-size: 24px;
    font-weight: 700;
  }

  .close-icon {
    position: absolute;
    top: 18px;
    right: 20px;
    border: 2px solid #b1b2ff;

    svg {
      font-size: 24px;
      color: #b1b2ff;
    }
  }
`;

export const StyledDialogContent = styled(DialogContent)`
  padding: 0;
  overflow-y: unset;
`;

export const StyledDialogAction = styled(DialogActions)`
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin-top: 14px;
  width: 100%;

  .MuiButton-root {
    flex-grow: 1;
    min-width: 200px;
    min-height: 40px;
  }
`;
