import { styled } from "@mui/system";

export const HomeContainer = styled("div")(() => ({
  position: "relative",
}));

export const HomeContentContainer = styled("div")(() => ({
  backgroundColor: "#eef1ff",
  position: "absolute",
  top: "64px",
  height: "calc(100vh - 64px)",
  width: "100%",

  ".home__content-mantra": {
    fontWeight: 700,
    fontSize: "48px",
    marginTop: "16px",
  },
}));

export const GameTableContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  width: "30%",
  padding: "24px 2%",
  ".home__content__table-title": {
    fontSize: "24px",
    fontWeight: 700,
  },

  ".home__content__table-header": {
    backgroundColor: "#b1b2ff",
  },
}));
