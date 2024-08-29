import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import { createExchangeRequest } from '../controllers/exchangeController.js'
// server.js -> routes -> controllers
const router = express.Router()

// create an exchange request
router.post('/createExchange',protectRoute,createExchangeRequest)

export default router