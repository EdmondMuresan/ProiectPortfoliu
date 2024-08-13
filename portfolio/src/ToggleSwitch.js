import React from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
`;

const ToggleCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => (props.checked ? '#4CAF50' : '#ccc')};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${props => (props.checked ? 'translateX(26px)' : 'translateX(0)')};
  }
`;

const ToggleSwitch = ({ checked, onChange }) => (
  <ToggleWrapper>
    <ToggleCheckbox
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
    <ToggleSlider checked={checked} />
  </ToggleWrapper>
);

export default ToggleSwitch;