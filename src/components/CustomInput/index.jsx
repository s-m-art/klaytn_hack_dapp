import { Box, Typography } from '@mui/material';
import React from 'react';

import {
  ErrorText,
  Image,
  InputText,
  InputType,
  StyledInputContainer,
  WrapInput,
} from './index.style';

export default function CustomInput({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  setValues,
  error = false,
  errorText,
  disabled,
  prefix,
  sm,
  showDeleteButton = true,
  decimal,
  type = 'text',
  ...props
}) {
  const onInput = (e) => {
    const val = e.target.value
      // eslint-disable-next-line no-useless-escape
      .replace(/[^0-9\.]/g, '')
      .replace(/\./, '*')
      .replace(/\./g, '')
      .replace(/\*/, '.');
    e.target.value =
      val.indexOf('.') >= 0
        ? val.substr(0, val.indexOf('.')) +
          val.substr(val.indexOf('.'), decimal + 1)
        : val;
  };

  return (
    <StyledInputContainer {...props} required={required}>
      <Typography className="label">{label}:</Typography>
      <WrapInput>
        <InputType>
          <Box sx={{display: 'flex'}} className={`${prefix ? 'has-prefix' : ''}`}>
            {prefix && <div className="prefix">{prefix}</div>}
            <InputText
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              error={error}
              className={`${error ? 'inputError' : ''}`}
              disabled={disabled}
              onInput={type === 'number' ? onInput : null}
              InputProps={{
                onWheel: (event) => {
                  // event.preventDefault();
                  event.target.blur();
                },
              }}
              sx={{
                'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                'input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
              {...props}
            />
          </Box>
          {!!value && !disabled && showDeleteButton && (
            <div
              tabIndex={-1}
              role="button"
              onClick={() => setValues(name, '')}
              className="closeWrap"
            >
              <Image alt="" src="/img/close-icon.png" />
            </div>
          )}
          {!!error && (
            <ErrorText className="form__input-error">{errorText}</ErrorText>
          )}
        </InputType>
      </WrapInput>
    </StyledInputContainer>
  );
}
