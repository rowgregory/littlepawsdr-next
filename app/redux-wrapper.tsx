'use client'

import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { ClientPageProps } from './types/common.types'
import PageWrapper from './page-wrapper'
import { store } from './redux/store'

const ReduxWrapper: FC<ClientPageProps> = ({ children, data }) => {
  return (
    <Provider store={store}>
      <PageWrapper data={data}>{children}</PageWrapper>
    </Provider>
  )
}

export default ReduxWrapper
