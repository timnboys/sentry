import styled from '@emotion/styled';

import overflowEllipsis from 'app/styles/overflowEllipsis';

const Column = styled('div')`
  ${overflowEllipsis};
  display: inline-block;
  vertical-align: middle;
`;

export default Column;
