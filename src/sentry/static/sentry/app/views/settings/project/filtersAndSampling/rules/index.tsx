import React from 'react';
import styled from '@emotion/styled';

import {PanelTable} from 'app/components/panels';
import {t} from 'app/locale';
import {DynamicSamplingRule} from 'app/types/dynamicSampling';

import CenteredColumn from './centeredColumn';
import Column from './column';
import Rule from './rule';

type Props = {
  rules: Array<DynamicSamplingRule>;
};

function Rules({rules}: Props) {
  return (
    <StyledPanelTable
      headers={[
        <Column key="drag-and-drop">{''}</Column>,
        <Column key="event-type">{t('Event Type')}</Column>,
        <Column key="category">{t('Category')}</Column>,
        <CenteredColumn key="sampling-rate">{t('Sampling Rate')}</CenteredColumn>,
        '',
      ]}
      isEmpty={!rules.length}
      emptyMessage={t('There are no rules to display')}
    >
      {rules.map((rule, index) => (
        <Rule key={index} rule={rule} />
      ))}
    </StyledPanelTable>
  );
}

export default Rules;

// TODO(Priscila): Add PanelTable footer prop
const StyledPanelTable = styled(PanelTable)`
  overflow: visible;
  margin-bottom: 0;
  border: none;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;

  > * {
    overflow: hidden;

    :nth-child(5n - 4),
    :nth-child(5n - 3) {
      display: none;
    }

    :nth-child(5n) {
      overflow: visible;
    }
  }

  grid-template-columns: 1fr 0.5fr max-content;

  @media (min-width: ${p => p.theme.breakpoints[1]}) {
    > * {
      :nth-child(5n - 3) {
        display: block;
      }
    }
    grid-template-columns: 0.5fr 1fr 0.5fr max-content;
  }
`;
