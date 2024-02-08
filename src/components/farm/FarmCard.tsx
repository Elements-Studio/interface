import React from 'react'
import styled from 'styled-components/macro'

export const CardWrapper = styled.div<{ margin?: string; maxWidth?: string }>`
  position: relative;
  max-width: ${({ maxWidth }) => maxWidth ?? '450px'};
  width: 450px;
  margin: 20px;
  background: ${({ theme }) => theme.bgCard};
  // box-shadow: 0px 13px 16px 0px rgba(0, 0, 0, 0.72);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 34px;
  // border: 1px solid #18335D;
  padding: 40px 30px;
`

interface FarmProps {
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function FarmCard({ children, ...rest }: FarmProps) {
  return <CardWrapper {...rest}>{children}</CardWrapper>
}
