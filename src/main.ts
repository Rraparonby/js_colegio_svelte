import './app.css'
import App from './App.svelte'

import '@/assets/css/bootstrap/5/bootstrap.min.css'
import '@/assets/css/w3css/4/w3.css'

const app = new App({
  target: document.getElementById('app'),
})

export default app
