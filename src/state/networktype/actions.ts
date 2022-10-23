import { createAction } from '@reduxjs/toolkit'

export const setType = createAction<{key: string}>('networktype/setType')
