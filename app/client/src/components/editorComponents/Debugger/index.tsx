import { Classes } from "components/ads/common";
import Icon, { IconSize } from "components/ads/Icon";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "store";
import styled from "styled-components";
import Content from "./Content";
import { AppState } from "reducers";

const Container = styled.div<{ errorCount: number }>`
  background-color: #2b2b2b;
  position: fixed;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  padding: 19px;
  color: #d4d4d4;
  border-radius: 50px;
  box-shadow: 0px 12px 28px -6px rgba(0, 0, 0, 0.32);

  .${Classes.ICON} {
    &:hover {
      path {
        fill: ${(props) => props.theme.colors.icon.normal};
      }
    }
  }

  .debugger-count {
    color: white;
    font-size: 14px;
    font-weight: 500;
    height: 20px;
    padding: 6px;
    background-color: ${(props) =>
      !!props.errorCount ? "#F22B2B" : "#03B365"};
    border-radius: 10px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
  }
`;

const Debugger = () => {
  const [open, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const errorCount = useSelector(
    (state: AppState) => state.ui.debugger.errorCount,
  );

  const onClose = () => {
    setIsOpen(false);
  };

  const onClick = () => {
    setIsOpen(true);
    dispatch({
      type: "DEBUGGER_RESET_ERROR_COUNT",
    });
  };

  if (!open)
    return (
      <Container onClick={onClick} errorCount={errorCount}>
        <Icon name="bug" size={IconSize.XXXL} />
        <div className="debugger-count">{errorCount}</div>
      </Container>
    );
  return <Content onClose={onClose} />;
};

export default Debugger;
