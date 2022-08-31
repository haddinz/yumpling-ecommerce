import { getSession } from 'next-auth/react'
import Order from '../../../../models/Order'
import db from '../../../../utils/db'

const handler = async (req, res) => {
    const session = getSession(req)
    if(!session){
        return res.send({ message: " Singin Required"})
    }

    await db.connect()
    const order = await Order.findById(req.query.id)
    if(order){
        if(order.isPaid){
            return res.status(400).send({ message: "Order Has Been Paid"})
        }
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            emailAddress: req.body.emailAddress
        }
        const paidOrderCOD = await order.save()
        await db.disconnect()
        res.send({ message: "Order with COD Already Created", order: paidOrderCOD})
    } else {
        await db.disconnect()
        res.send(401).send({ message: "Product Not Found" })
    }
}

export default handler