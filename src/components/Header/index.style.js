import { styled } from "@mui/system";

export const HeaderContainer = styled("div")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  minWidth: "100%",
  maxWidth: "100%",
  display: "block",
  backgroundColor: "#b1b2ff",

  "> div": {
    padding: "8px 16px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  ".left": {
    display: "flex",
    alignItems: "center",
    gap: "64px",
  },

  ".right": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    "> div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "16px",
      svg: {
        cursor: "pointer",
      },
    },
  },
}));
