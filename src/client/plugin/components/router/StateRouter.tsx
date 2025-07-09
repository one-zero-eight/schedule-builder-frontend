import React, { useState } from 'react';
import { type RouteProps } from './Route';
import routerContext from '../../contexts/routerContext';
import { RouteLink } from '../../../lib/types';

interface StateRouterProps {
  children: React.ReactNode;
  initialRoute: RouteLink;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export default function StateRouter({
  children,
  initialRoute,
  layout: Layout,
}: StateRouterProps) {
  const [location, setLocation] = useState(initialRoute);

  const navigate = (path: RouteLink) => {
    setLocation(path);
  };

  // Find the matching route among children
  let matchedElement: React.ReactNode = null;

  // Iterate through children to find matching Route
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<RouteProps>(child) &&
      child.props.path === location
    ) {
      matchedElement = child.props.element;
    }
  });

  if (matchedElement === null) {
    throw new Error(`Found non-existent path in state router: ${location}`);
  }

  const contentToRender = Layout ? (
    <Layout>{matchedElement}</Layout>
  ) : (
    matchedElement
  );

  return (
    <routerContext.Provider value={{ location, navigate }}>
      {contentToRender}
    </routerContext.Provider>
  );
}
