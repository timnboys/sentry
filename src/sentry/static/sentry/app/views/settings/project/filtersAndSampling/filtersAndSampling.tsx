import React from 'react';
import {RouteComponentProps} from 'react-router';
import isEqual from 'lodash/isEqual';

import ExternalLink from 'app/components/links/externalLink';
import {t, tct} from 'app/locale';
import {Organization, Project} from 'app/types';
import {DynamicSamplingRules, DynamicSamplingRuleType} from 'app/types/dynamicSampling';
import AsyncView from 'app/views/asyncView';
import SettingsPageHeader from 'app/views/settings/components/settingsPageHeader';
import TextBlock from 'app/views/settings/components/text/textBlock';
import PermissionAlert from 'app/views/settings/organization/permissionAlert';

import TransactionRules from './transactionRules';
import {getPlatformDocLink} from './utils';

type Props = RouteComponentProps<{projectId: string; orgId: string}, {}> &
  AsyncView['props'] & {
    organization: Organization;
  };

type State = AsyncView['state'] & {
  project: Project | null;
  transactionRules: DynamicSamplingRules;
};

class FiltersAndSampling extends AsyncView<Props, State> {
  getTitle() {
    return t('Filters & Sampling');
  }

  getDefaultState() {
    return {
      ...super.getDefaultState(),
      transactionRules: [],
      project: null,
    };
  }

  getEndpoints(): ReturnType<AsyncView['getEndpoints']> {
    const {orgId, projectId} = this.props.params;
    return [['project', `/projects/${orgId}/${projectId}/`]];
  }

  componentDidMount() {
    this.getTransactionsRules();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !isEqual(
        this.props.organization.dynamicSampling,
        prevProps.organization.dynamicSampling
      )
    ) {
      this.getTransactionsRules();
    }
    super.componentDidUpdate(prevProps, prevState);
  }

  getTransactionsRules() {
    const {organization} = this.props;
    const {dynamicSampling} = organization;

    const transactionRules = dynamicSampling.filter(
      rule => rule.ty !== DynamicSamplingRuleType.ERROR
    );

    this.setState({transactionRules});
  }

  handleAddRule = () => {
    // TODO(Priscila): Implement the request here
  };

  renderBody() {
    const {transactionRules, project} = this.state;

    if (!project) {
      return null;
    }

    const {platform} = project;
    const platformDocLink = getPlatformDocLink(platform);

    return (
      <React.Fragment>
        <SettingsPageHeader title={this.getTitle()} />
        <PermissionAlert />
        <TextBlock>
          {platformDocLink
            ? tct(
                'Manage the inbound data you want to store. To change the sampling rate or rate limits, [link:update your SDK configuration]. The rules added below will apply on top of your SDK configuration.',
                {
                  link: <ExternalLink href={platformDocLink} />,
                }
              )
            : t(
                'Manage the inbound data you want to store. To change the sampling rate or rate limits, update your SDK configuration. The rules added below will apply on top of your SDK configuration.'
              )}
        </TextBlock>
        <TransactionRules
          rules={transactionRules}
          onAddRule={this.handleAddRule}
          platformDocLink={platformDocLink}
        />
      </React.Fragment>
    );
  }
}

export default FiltersAndSampling;
