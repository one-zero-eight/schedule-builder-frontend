import { PropsWithChildren, useEffect, useState } from 'react';
import { SchemaCheckParameters } from '../../api/types';
import { CHECK_PARAMETERS_KEY } from '../../lib/constants';
import getAllIssues, { DEFAULT_CHECK_PARAMETERS } from '../../lib/endpoints';
import { issuesContext } from '../contexts/issuesContext';
import useAPI from '../hooks/useAPI';
import useToken from '../hooks/useToken';

function loadCheckParameters(): SchemaCheckParameters {
  const stored = localStorage.getItem(CHECK_PARAMETERS_KEY);
  if (stored) {
    return { ...DEFAULT_CHECK_PARAMETERS, ...JSON.parse(stored) };
  }
  return DEFAULT_CHECK_PARAMETERS;
}

export function IssuesProvider({ children }: PropsWithChildren) {
  const { token } = useToken();
  const [callAPI, issues] = useAPI(getAllIssues, []);
  const [checkParameters, setCheckParametersState] =
    useState<SchemaCheckParameters>(loadCheckParameters);

  useEffect(() => {
    localStorage.setItem(CHECK_PARAMETERS_KEY, JSON.stringify(checkParameters));
  }, [checkParameters]);

  function setCheckParameters(params: SchemaCheckParameters) {
    setCheckParametersState(params);
  }

  async function updateIssues() {
    if (token === undefined || token === '') {
      return;
    }

    await callAPI(token, checkParameters);
  }

  return (
    <issuesContext.Provider
      value={{ issues, updateIssues, checkParameters, setCheckParameters }}
    >
      {children}
    </issuesContext.Provider>
  );
}
