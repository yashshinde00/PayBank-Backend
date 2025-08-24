import { Router } from 'express'
import { getAllCustomers,getCustomerTransactions } from '../controller/bankercontroller'
import { authToken } from '../middlewares/authToken'
import { authorizeRole } from '../middlewares/authorizeRole'


const router = Router()
router.use(authToken,authorizeRole("Banker"))
router.get("/customers",getAllCustomers)
router.get("/customers/:customerId/transactions", getCustomerTransactions);

export default router;