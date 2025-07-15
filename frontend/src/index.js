import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Root from './Root';

const container = document.getElementById('root');
hydrateRoot(container, <Root />);
