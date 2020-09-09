import { Collection, State, Computed, extractAll } from '@pulsejs/core';

export function preserveServerState(nextProps: { [key: string]: any }) {
  // const state = new Set<State>();
  // const collections = new Set<Collection>();

  const PULSE_DATA = {
    collections: [],
    state: {}
  };

  //   state.forEach(stateItem => {
  //     if (stateItem.name && stateItem.isSet && !(stateItem instanceof Computed)) PULSE_DATA.state[stateItem.name] = stateItem._value;
  //   });

  //   collections.forEach(collection => {
  //     const collectionData = { data: {}, groups: {} };

  //     for (let key in collection.data) if (collection.data[key].isSet) collectionData.data[key] = collection.data[key]._value;

  //     for (let key in collection.groups as any) if (collection.groups[key].isSet) collectionData.groups[key] = collection.groups[key]._value;

  //     PULSE_DATA.collections.push(collectionData);
  //   });

  nextProps.props.PULSE_DATA = PULSE_DATA;

  console.log('preserveServerState finished', nextProps);
  return nextProps;
}

export function loadServerState(core: { [key: string]: any }) {
  if (isServer()) {
    console.log('loadServerState, server says hi!');
    return;
  }
  if (globalThis?.__NEXT_DATA__?.props?.pageProps?.PULSE_DATA) {
    const pulseData = globalThis.__NEXT_DATA__.props.pageProps.PULSE_DATA;

    const state = extractAll(State, core);
    const collections = extractAll(Collection, core);

    state.forEach(item => {
      if (item.name && pulseData.state[item.name] && !(item instanceof Computed)) item.set(pulseData.state[item.name]);
    });
  }
}

export function isServer() {
  return typeof process !== 'undefined' && process?.release?.name === 'node';
}