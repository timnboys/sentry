import React from 'react';

import {IconGrabbable} from 'app/icons/iconGrabbable';
import {DynamicSamplingRule} from 'app/types/dynamicSampling';

import CenteredColumn from '../centeredColumn';
import Column from '../column';

import Actions from './actions';
import Conditions from './conditions';
import SampleRate from './sampleRate';
import Type from './type';

type Props = {
  rule: DynamicSamplingRule;
};

function Rule({rule}: Props) {
  const {ty, condition, sampleRate} = rule;
  return (
    <React.Fragment>
      <Column>
        <IconGrabbable />
      </Column>
      <Column>
        <Type type={ty} />
      </Column>
      <Column>
        <Conditions condition={condition} />
      </Column>
      <CenteredColumn>
        <SampleRate sampleRate={sampleRate} />
      </CenteredColumn>
      <Column>
        <Actions onEditRule={() => {}} onDeleteRule={() => {}} disabled={false} />
      </Column>
    </React.Fragment>
  );
}

export default Rule;
