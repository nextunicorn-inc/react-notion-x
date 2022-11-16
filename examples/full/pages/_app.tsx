import * as React from 'react'

// core styles shared by all of react-notion-x (required)
import '@nextunicorn-inc/react-notion-x/src/styles.css'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
