import React from 'react';
import {RouteComponentProps} from 'react-router';
import isEqual from 'lodash/isEqual';
import partition from 'lodash/partition';

import ExternalLink from 'app/components/links/externalLink';
import {t, tct} from 'app/locale';
import {Organization, Project} from 'app/types';
import {DynamicSamplingRules, DynamicSamplingRuleType} from 'app/types/dynamicSampling';
import AsyncView from 'app/views/asyncView';
import SettingsPageHeader from 'app/views/settings/components/settingsPageHeader';
import TextBlock from 'app/views/settings/components/text/textBlock';
import PermissionAlert from 'app/views/settings/organization/permissionAlert';

import RulesPanel from './rulesPanel';
import {getPlatformDocLink} from './utils';

type Props = RouteComponentProps<{projectId: string; orgId: string}, {}> &
  AsyncView['props'] & {
    organization: Organization;
  };

type State = AsyncView['state'] & {
  project: Project | null;
  errorRules: DynamicSamplingRules;
  transactionRules: DynamicSamplingRules;
};

class FiltersAndSampling extends AsyncView<Props, State> {
  getTitle() {
    return t('Filters & Sampling');
  }

  getDefaultState() {
    return {
      ...super.getDefaultState(),
      errorRules: [],
      transactionRules: [],
      project: null,
    };
  }

  getEndpoints(): ReturnType<AsyncView['getEndpoints']> {
    const {orgId, projectId} = this.props.params;
    return [['project', `/projects/${orgId}/${projectId}/`]];
  }

  componentDidMount() {
    this.getRules();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !isEqual(
        this.props.organization.dynamicSampling,
        prevProps.organization.dynamicSampling
      )
    ) {
      this.getRules();
    }
    super.componentDidUpdate(prevProps, prevState);
  }

  getRules() {
    const {organization} = this.props;
    const {dynamicSampling} = organization;

    const [errorRules, transactionRules] = partition(
      dynamicSampling,
      rule => rule.ty === DynamicSamplingRuleType.ERROR
    );

    this.setState({errorRules, transactionRules});
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
    const {transactionRules, errorRules, project} = this.state;

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
        <RulesPanel
          rules={errorRules}
          platformDocLink={platformDocLink}
          onAddRule={this.handleAddRule}
        />
        <TextBlock>
          {t(
            'The transaction order is limited. Traces must occur first and individual transactions must occur last. Any individual transaction rules before a trace rule will be disregarded. '
          )}
        </TextBlock>
        <RulesPanel
          rules={transactionRules}
          platformDocLink={platformDocLink}
          onAddRule={this.handleAddRule}
        />
      </React.Fragment>
    );
  }
}

export default FiltersAndSampling;
