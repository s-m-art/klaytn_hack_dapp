import styled from "@emotion/styled";

export const NewGameContentContainer = styled("form")(() => ({
  backgroundColor: "#eef1ff",
  position: "absolute",
  top: "64px",
  height: "calc(100vh - 64px)",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,

  button: {
    height: "fit-content",
    width: 100,
  },
}));
