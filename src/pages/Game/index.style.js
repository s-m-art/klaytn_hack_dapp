import styled from "@emotion/styled";

export const GameDetailContainer = styled("div")(() => ({
  ".home__content-mantra": {
    fontWeight: 700,
    fontSize: "48px",
  },
}));

export const GameBoardContainer = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  width: 306,
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
}));

export const GameBoardSquare = styled("div")(() => ({
  border: "1px solid black",
  height: 100,
  width: 100,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  svg: {
    height: 64,
    width: 64,
  },
}));
