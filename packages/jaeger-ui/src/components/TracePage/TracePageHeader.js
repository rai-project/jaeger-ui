// @flow

// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from 'react';
import { Button, Dropdown, Icon, Input, Menu, Divider } from 'antd';
import IoChevronDown from 'react-icons/lib/io/chevron-down';
import IoChevronRight from 'react-icons/lib/io/chevron-right';
import IoChevronLeft from 'react-icons/lib/io/chevron-left';
import IoIosFilingOutline from 'react-icons/lib/io/ios-filing-outline';
import { Link } from 'react-router-dom';

import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import { trackAltViewOpen } from './TracePageHeader.track';
import TracePageSearchBar from './TracePageSearchBar';
import LabeledList from '../common/LabeledList';
import { FALLBACK_TRACE_NAME } from '../../constants';
import { formatDatetime, formatDuration } from '../../utils/date';
import prefixUrl from '../../utils/prefix-url';

import './TracePageHeader.css';

type TracePageHeaderProps = {
  traceID: string,
  name: String,
  slimView: boolean,
  onSlimViewClicked: () => void,
  updateTextFilter: string => void,
  textFilter: string,
  prevResult: () => void,
  nextResult: () => void,
  clearSearch: () => void,
  forwardedRef: { current: Input | null },
  resultCount: number,
  archiveButtonVisible: boolean,
  onArchiveClicked: () => void,
  onGoBackClicked: () => void,
  onGoFullViewClicked: () => void,
  embed: boolean,
  details: boolean,
  // these props are used by the `HEADER_ITEMS`
  // eslint-disable-next-line react/no-unused-prop-types
  timestamp: number,
  // eslint-disable-next-line react/no-unused-prop-types
  duration: number,
  // eslint-disable-next-line react/no-unused-prop-types
  numServices: number,
  // eslint-disable-next-line react/no-unused-prop-types
  maxDepth: number,
  // eslint-disable-next-line react/no-unused-prop-types
  numSpans: number,
};

export const HEADER_ITEMS = [
  {
    key: 'timestamp',
    title: 'Trace Start',
    propName: null,
    renderer: (props: TracePageHeaderProps) => formatDatetime(props.timestamp),
  },
  {
    key: 'duration',
    title: 'Duration',
    propName: null,
    renderer: (props: TracePageHeaderProps) => formatDuration(props.duration),
  },
  {
    key: 'service-count',
    title: 'Services',
    propName: 'numServices',
    renderer: null,
  },
  {
    key: 'depth',
    title: 'Depth',
    propName: 'maxDepth',
    renderer: null,
  },
  {
    key: 'span-count',
    title: 'Total Spans',
    propName: 'numSpans',
    renderer: null,
  },
];

export function TracePageHeaderFn(props: TracePageHeaderProps) {
  const {
    archiveButtonVisible,
    onArchiveClicked,
    duration,
    maxDepth,
    numSpans,
    timestamp,
    numServices,
    traceID,
    name,
    slimView,
    onSlimViewClicked,
    onGoBackClicked,
    onGoFullViewClicked,
    updateTextFilter,
    textFilter,
    prevResult,
    nextResult,
    clearSearch,
    resultCount,
    forwardedRef,
    embed,
    details,
  } = props;

  if (!traceID) {
    return null;
  }

  const viewMenu = (
    <Menu>
      <Menu.Item>
        <Link
          to={prefixUrl(`/api/traces/${traceID}?prettyPrint=true`)}
          rel="noopener noreferrer"
          target="_blank"
          onClick={trackAltViewOpen}
        >
          Trace JSON
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={prefixUrl(`/api/traces/${traceID}?raw=true&prettyPrint=true`)}
          rel="noopener noreferrer"
          target="_blank"
          onClick={trackAltViewOpen}
        >
          Trace JSON (unadjusted)
        </Link>
      </Menu.Item>
    </Menu>
  );

  const overviewItems = [
    {
      key: 'start',
      label: 'Trace Start:',
      value: formatDatetime(timestamp),
    },
    {
      key: 'duration',
      label: 'Duration:',
      value: formatDuration(duration),
    },
    {
      key: 'svc-count',
      label: 'Services:',
      value: numServices,
    },
    {
      key: 'depth',
      label: 'Depth:',
      value: maxDepth,
    },
    {
      key: 'span-count',
      label: 'Total Spans:',
      value: numSpans,
    },
  ];

  const embedComponent = (
    <div className="TracePageHeader--titleRowEmbed">
      <a className="ub-mr2 ub-flex ub-items-center" onClick={onGoBackClicked}>
        <IoChevronLeft className="ub-mr2" />Go back
      </a>
      <Divider type="vertical" />
      <h1 className="TracePageHeader--titleEmbed ub-flex-auto ub-mr2 ub-items-center">
        {name || FALLBACK_TRACE_NAME}
      </h1>
      <a className="ub-mr2 ub-flex ub-items-center" onClick={onGoFullViewClicked}>
        View Trace
      </a>
      <TracePageSearchBar
        updateTextFilter={updateTextFilter}
        textFilter={textFilter}
        prevResult={prevResult}
        nextResult={nextResult}
        clearSearch={clearSearch}
        resultCount={resultCount}
        ref={forwardedRef}
      />
    </div>
  );

  return (
    <header>
      {embed ? (
        embedComponent
      ) : (
        <div className="TracePageHeader--titleRow">
          <a
            className="ub-flex-auto ub-mr2"
            onClick={onSlimViewClicked}
            role="switch"
            aria-checked={!slimView}
          >
            <h1 className="TracePageHeader--title ub-flex ub-items-center">
              {slimView ? <IoChevronRight className="ub-mr2" /> : <IoChevronDown className="ub-mr2" />}
              {name || FALLBACK_TRACE_NAME}
            </h1>
          </a>
          <KeyboardShortcutsHelp className="ub-mr2" />
          <TracePageSearchBar
            updateTextFilter={updateTextFilter}
            textFilter={textFilter}
            prevResult={prevResult}
            nextResult={nextResult}
            clearSearch={clearSearch}
            resultCount={resultCount}
            ref={forwardedRef}
          />
          <Dropdown overlay={viewMenu}>
            <Button className="ub-mr2">
              View Options <Icon type="down" />
            </Button>
          </Dropdown>

          {archiveButtonVisible && (
            <Button className="ub-mr2 ub-flex ub-items-center" onClick={onArchiveClicked}>
              <IoIosFilingOutline className="TracePageHeader--archiveIcon" />
              Archive Trace
            </Button>
          )}
        </div>
      )}
      {((!slimView && !embed) || (embed && details)) && (
        <LabeledList className="TracePageHeader--overviewItems" items={overviewItems} />
      )}
    </header>
  );
}

// ghetto fabulous cast because the 16.3 API is not in flow yet
// https://github.com/facebook/flow/issues/6103
export default (React: any).forwardRef((props, ref) => <TracePageHeaderFn {...props} forwardedRef={ref} />);
