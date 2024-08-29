import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import {
  createExchangeRequest,
  deleteExchangeRequest,
  getExchangeReqMadebyUser,
  getIncomingExchangeRequests,
  respondToExchangeRequest,
} from '../controllers/exchangeController.js'
// server.js -> routes -> controllers
const router = express.Router()

// create an exchange request
router.post('/createExchange', protectRoute, createExchangeRequest)

// get all exchange requests made by user
router.get('/allrequests', protectRoute, getExchangeReqMadebyUser)

// Update the status of an exchange request (accept or reject)
router.put('/:id', protectRoute, respondToExchangeRequest)

// delete a request
router.delete('/:id', protectRoute, deleteExchangeRequest)

// get incoming requests
router.get('/incoming', protectRoute, getIncomingExchangeRequests)
export default router
