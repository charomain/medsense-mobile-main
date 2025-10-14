jest.mock('../../../../../../shared/components/Screen', () => {
  const RN = jest.requireActual('react-native');
  return {MedsenseScreen: RN.View};
});

import React from 'react';
import renderer from 'react-test-renderer';
import {
  createMockNavigationProps,
  MockAppProvider,
  mockSuccesfulResponse,
  wait,
} from '../../../../../../__mocks__/helpers';
import {AddMedicationScreen} from '../index';

test('renders correctly', async () => {
  mockSuccesfulResponse(200, []);

  const tree = renderer
    .create(
      <MockAppProvider>
        <AddMedicationScreen {...createMockNavigationProps()} />
      </MockAppProvider>,
    )
    .toJSON();

  await wait(1);

  expect(tree).toMatchSnapshot();
});
