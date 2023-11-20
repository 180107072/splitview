import React from 'react'
import ReactDOM from 'react-dom/client'
import { SplitView } from './lib/splitview.tsx'
import { Orientation } from './lib/common/splitview.ts'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ width: '100vw', height: '100vh', display: 'flex', color: 'white' }}>
      <SplitView orientation={Orientation.VERTICAL}>
        <SplitView>
          {[1, 2, 3].map((i) => <div key={i}>{i} </div>)}
        </SplitView>
        <SplitView>
          {[1, 2, 3].map((i) => <div key={i}>{i} </div>)}
        </SplitView>
      </SplitView>
    </div>
  </React.StrictMode>,
)
