import { FormControl, styled } from "@mui/material";

const StyledInputContainer = styled(FormControl)(
  ({ theme, required, error }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    [theme.breakpoints.down("md")]: {
      marginBottom: 15,
    },

    ".MuiFormControl-root": {
      padding: 0,
      width: "100%",
    },

    ".MuiTypography-root": {
      fontWeight: 500,

      "&.required:after": {
        content: required && '" *"',
        fontSize: 18,
        color: "#FF7149",
        marginLeft: "3px",
      },
    },
    "input::placeholder": {
      color: "#E9EBF9",
    },
    ".MuiInputBase-input": {
      border: "none",
      borderRadius: 8,
      fontWeight: 500,
    },

    "&:hover": error
      ? {
          ".MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }
      : null,

    ".MuiOutlinedInput-root": error
      ? {
          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        }
      : {
          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              borderWidth: "1px",
            },
          },
        },

    fieldset: {
      borderColor: "transparent",
    },
  })
);

const WrapInput = styled("div")(() => ({
  "& .inputError": {
    border: `1px solid #FF7149`,
  },
}));

const InputType = styled("div")(({ theme }) => ({
  position: "relative",
  height: "100%",

  ".closeWrap": {
    position: "absolute",
    right: 0,
    top: "23px",
  },

  ".has-prefix": {
    display: "flex",

    input: {
      flexShrink: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },

  ".prefix": {
    height: 40,
    padding: "0 20px",
    lineHeight: "40px",
    backgroundColor: "#2D325A",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
}));

const Image = styled("img")(() => ({
  position: "absolute",
  display: "block",
  width: 10,
  height: 10,
  right: 15,
  top: "50%",
  cursor: "pointer",
  transform: "translateY(-50%)",
}));

const WrapIcon = styled("div")(() => ({
  position: "absolute",
  right: 15,
  top: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const InputText = styled("input")(({ theme, error }) => ({
  fontFamily: "Poppins",
  outline: "none",
  background: "transparent",
  border: `1px solid ${error ? "#FF7149" : "#b1b2ff"}`,
  color: "#2D325A",
  fontSize: 16,
  padding: "10px 36px 10px 16px",
  width: "100%",
  borderRadius: 8,

  "&:-webkit-autofill": {
    transition: "background-color 600000s 0s, color 600000s 0s",
  },
  "&:-webkit-autofill:focus": {
    transition: "background-color 600000s 0s, color 600000s 0s",
  },

  ":disabled": {
    padding: "10px 16px 10px 16px",
    WebkitTextFillColor: "#E9EBF9",
    opacity: 0.4,
  },

  input: {
    "&::placeholder": {
      color: "#616796",
      opacity: 1,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "20px",
    },
  },
}));

const ErrorText = styled("p")(({ theme }) => ({
  fontSize: 12,
  color: "#FF7149",
  marginTop: 4,
  marginBottom: 0,
}));

export {
  InputText,
  WrapInput,
  InputType,
  Image,
  WrapIcon,
  StyledInputContainer,
  ErrorText,
};
